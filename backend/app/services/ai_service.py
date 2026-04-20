import json
from collections import defaultdict
from datetime import UTC, datetime
from typing import Any, AsyncGenerator

import httpx
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.cache import cache_get, cache_set
from app.core.config import settings
from app.models.crowd import CrowdSnapshot

GROQ_CHAT_URL = "https://api.groq.com/openai/v1/chat/completions"

# In-memory conversation history storage
_conversations: dict[tuple[int, int], list[dict[str, str]]] = {}


async def _groq_completion(messages: list[dict[str, str]], stream: bool = False) -> Any:
    if not settings.groq_api_key:
        return None

    payload = {
        "model": settings.groq_model,
        "messages": messages,
        "temperature": 0.2,
        "stream": stream,
        "response_format": {"type": "json_object"} if not stream else None,
    }
    if payload["response_format"] is None:
        payload.pop("response_format")

    headers = {"Authorization": f"Bearer {settings.groq_api_key}", "Content-Type": "application/json"}

    timeout = httpx.Timeout(40.0, connect=10.0)
    async with httpx.AsyncClient(timeout=timeout) as client:
        response = await client.post(GROQ_CHAT_URL, headers=headers, json=payload)
        response.raise_for_status()
        return response.json()


def get_conversation_history(venue_id: int, user_id: int) -> list[dict[str, str]]:
    """Get conversation history from in-memory store."""
    key = (venue_id, user_id)
    return _conversations.get(key, [])


def append_conversation(venue_id: int, user_id: int, role: str, content: str) -> None:
    """Append to conversation history."""
    key = (venue_id, user_id)
    if key not in _conversations:
        _conversations[key] = []
    _conversations[key].append({"role": role, "content": content})


def _fallback_assistant_reply(message: str, venue_context: dict[str, Any]) -> str:
    top_zone = venue_context.get("top_zone")
    return (
        f"I could not reach the AI provider right now. Based on live data, consider moving toward zone "
        f"{top_zone or 'with the lowest density'} and pick concessions with the smallest queue positions. "
        f"Your request was: {message}"
    )


async def stream_assistant_reply(
    message: str,
    venue_id: int,
    user_id: int,
    venue_context: dict[str, Any],
) -> AsyncGenerator[str, None]:
    history = get_conversation_history(venue_id, user_id)
    system_prompt = (
        "You are Relaxena Assistant for a sporting venue. Use the provided venue state to answer with "
        "specific actionable guidance. Keep it concise and practical."
    )

    messages = [{"role": "system", "content": f"{system_prompt}\nContext: {json.dumps(venue_context)}"}]
    messages.extend(history[-12:])
    messages.append({"role": "user", "content": message})

    append_conversation(venue_id, user_id, "user", message)

    if not settings.groq_api_key:
        fallback = _fallback_assistant_reply(message, venue_context)
        append_conversation(venue_id, user_id, "assistant", fallback)
        yield f"data: {json.dumps({'chunk': fallback, 'done': True})}\n\n"
        return

    payload = {
        "model": settings.groq_model,
        "messages": messages,
        "temperature": 0.2,
        "stream": True,
    }
    headers = {"Authorization": f"Bearer {settings.groq_api_key}", "Content-Type": "application/json"}
    timeout = httpx.Timeout(40.0, connect=10.0)

    full_text: list[str] = []
    try:
        async with httpx.AsyncClient(timeout=timeout) as client:
            async with client.stream("POST", GROQ_CHAT_URL, headers=headers, json=payload) as response:
                response.raise_for_status()
                async for line in response.aiter_lines():
                    if not line or not line.startswith("data:"):
                        continue
                    sse_payload = line.removeprefix("data:").strip()
                    if sse_payload == "[DONE]":
                        break
                    try:
                        parsed = json.loads(sse_payload)
                        chunk = parsed["choices"][0]["delta"].get("content", "")
                    except Exception:
                        chunk = ""

                    if chunk:
                        full_text.append(chunk)
                        yield f"data: {json.dumps({'chunk': chunk, 'done': False})}\n\n"
    except Exception:
        fallback = _fallback_assistant_reply(message, venue_context)
        append_conversation(venue_id, user_id, "assistant", fallback)
        yield f"data: {json.dumps({'chunk': fallback, 'done': True})}\n\n"
        return

    final_text = "".join(full_text).strip() or _fallback_assistant_reply(message, venue_context)
    append_conversation(venue_id, user_id, "assistant", final_text)
    yield f"data: {json.dumps({'chunk': '', 'done': True})}\n\n"


async def predict_crowd_density(db: AsyncSession, venue_id: int) -> dict[str, Any]:
    stmt = (
        select(CrowdSnapshot)
        .where(CrowdSnapshot.venue_id == venue_id)
        .order_by(CrowdSnapshot.captured_at.desc())
        .limit(30)
    )
    snapshots = list(reversed((await db.execute(stmt)).scalars().all()))

    grouped: dict[int, list[float]] = defaultdict(list)
    for snap in snapshots:
        grouped[snap.zone_id].append(snap.density_score)

    heuristic_predictions: list[dict[str, Any]] = []
    for zone_id, values in grouped.items():
        avg_density = sum(values) / max(len(values), 1)
        momentum = (values[-1] - values[0]) if len(values) > 1 else 0.0
        projected = max(0.0, min(1.0, avg_density + momentum * 0.35))
        action = "Open auxiliary gate" if projected >= 0.8 else "Keep current flow"
        heuristic_predictions.append(
            {
                "zone_id": zone_id,
                "predicted_density": round(projected, 3),
                "confidence": round(0.55 + min(abs(momentum), 0.25), 2),
                "suggested_actions": [action, "Deploy staff at chokepoints"],
            }
        )

    if settings.groq_api_key and snapshots:
        compressed = [
            {
                "zone_id": s.zone_id,
                "density": s.density_score,
                "timestamp": s.captured_at.isoformat() if s.captured_at else None,
            }
            for s in snapshots
        ]
        prompt = {
            "task": "Predict next 15/30/60 minute density trend per zone",
            "input": compressed,
            "format": {
                "predictions": [
                    {
                        "zone_id": "int",
                        "predicted_density": "0-1 float",
                        "confidence": "0-1 float",
                        "suggested_actions": ["string"],
                    }
                ]
            },
        }

        response = await _groq_completion(
            [
                {
                    "role": "system",
                    "content": "Return ONLY valid JSON object with key predictions.",
                },
                {"role": "user", "content": json.dumps(prompt)},
            ],
            stream=False,
        )

        if response:
            try:
                content = response["choices"][0]["message"]["content"]
                parsed = json.loads(content)
                predictions = parsed.get("predictions", [])
                if isinstance(predictions, list) and predictions:
                    heuristic_predictions = predictions
            except Exception:
                pass

    result = {
        "venue_id": venue_id,
        "generated_at": datetime.now(UTC).isoformat(),
        "predictions": heuristic_predictions,
    }

    cache_set(f"ai:predict:{venue_id}", result, ttl=settings.ai_predict_cache_ttl_seconds)
    return result


def get_cached_prediction(venue_id: int) -> dict[str, Any] | None:
    """Get cached prediction if available."""
    return cache_get(f"ai:predict:{venue_id}")
