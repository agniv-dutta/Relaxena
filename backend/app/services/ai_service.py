import json
import re
from collections import defaultdict
from datetime import UTC, datetime
from typing import Any, AsyncGenerator

from groq import AsyncGroq
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.cache import cache_get, cache_set
from app.core.config import settings
from app.models.crowd import CrowdSnapshot

# Groq async client (initialized lazily)
_groq_client: AsyncGroq | None = None


def _get_groq_client() -> AsyncGroq:
    global _groq_client
    if _groq_client is None:
        _groq_client = AsyncGroq(api_key=settings.groq_api_key)
    return _groq_client


# In-memory conversation history storage (last 10 messages per user)
_conversations: dict[tuple[int, int], list[dict[str, str]]] = {}


def get_conversation_history(venue_id: int, user_id: int) -> list[dict[str, str]]:
    """Get conversation history from in-memory store (last 10 messages)."""
    key = (venue_id, user_id)
    return _conversations.get(key, [])


def append_conversation(venue_id: int, user_id: int, role: str, content: str) -> None:
    """Append to conversation history, keeping only last 10 messages."""
    key = (venue_id, user_id)
    if key not in _conversations:
        _conversations[key] = []
    _conversations[key].append({"role": role, "content": content})
    # Keep only last 10 messages
    if len(_conversations[key]) > 10:
        _conversations[key] = _conversations[key][-10:]


def _build_system_prompt(venue_context: dict[str, Any]) -> str:
    """Build enriched system prompt with venue context."""
    context_str = json.dumps(venue_context, indent=2)
    return (
        "You are Rexi, the smart venue assistant for Relaxena. "
        "You have access to live venue data including crowd densities, wait times, weather, and event scores. "
        "Be concise, helpful, and always suggest the least crowded option when relevant. "
        "Current venue state:\n"
        f"{context_str}\n\n"
        "Respond in 1-3 sentences with actionable guidance."
    )


def _fallback_assistant_reply(message: str, venue_context: dict[str, Any]) -> str:
    """Fallback response when Groq API is unavailable."""
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
    """Stream assistant reply using Groq API with venue context and conversation history."""
    history = get_conversation_history(venue_id, user_id)
    system_prompt = _build_system_prompt(venue_context)

    # Build message list: system + history (last 8 pairs) + current message
    messages = [{"role": "system", "content": system_prompt}]
    messages.extend(history[-8:])
    messages.append({"role": "user", "content": message})

    # Store user message in history
    append_conversation(venue_id, user_id, "user", message)

    # Fallback if no API key
    if not settings.groq_api_key:
        fallback = _fallback_assistant_reply(message, venue_context)
        append_conversation(venue_id, user_id, "assistant", fallback)
        yield f"data: {json.dumps({'chunk': fallback, 'done': True})}\n\n"
        return

    full_text: list[str] = []
    try:
        client = _get_groq_client()
        stream = await client.chat.completions.create(
            model=settings.groq_model,
            messages=messages,
            max_tokens=1024,
            temperature=0.7,
            stream=True,
        )

        async for chunk in stream:
            delta_content = chunk.choices[0].delta.content
            if delta_content:
                full_text.append(delta_content)
                yield f"data: {json.dumps({'chunk': delta_content, 'done': False})}\n\n"
    except Exception as e:
        fallback = _fallback_assistant_reply(message, venue_context)
        append_conversation(venue_id, user_id, "assistant", fallback)
        yield f"data: {json.dumps({'chunk': fallback, 'done': True})}\n\n"
        return

    final_text = "".join(full_text).strip() or _fallback_assistant_reply(message, venue_context)
    append_conversation(venue_id, user_id, "assistant", final_text)
    yield f"data: {json.dumps({'chunk': '', 'done': True})}\n\n"


async def get_venue_tips(db: AsyncSession, venue_id: int) -> dict[str, Any]:
    """
    Generate smart venue tips based on current state.
    GET /api/ai/tip
    """
    cache_key = f"ai:tips:{venue_id}"
    cached = cache_get(cache_key)
    if cached:
        return cached

    # Fetch top 3 crowded zones and top 3 low-wait stands
    snapshots = (
        await db.execute(
            select(CrowdSnapshot)
            .where(CrowdSnapshot.venue_id == venue_id)
            .order_by(CrowdSnapshot.captured_at.desc())
            .limit(30)
        )
    ).scalars().all()

    zone_densities = defaultdict(list)
    for snap in snapshots:
        zone_densities[snap.zone_id].append(snap.density_score)

    top_crowded = sorted(
        [(z, sum(d) / len(d)) for z, d in zone_densities.items()],
        key=lambda x: x[1],
        reverse=True
    )[:3]
    low_wait = sorted(
        [(z, sum(d) / len(d)) for z, d in zone_densities.items()],
        key=lambda x: x[1]
    )[:3]

    venue_data = {
        "venue_id": venue_id,
        "top_crowded_zones": [{"zone_id": z, "avg_density": round(d, 2)} for z, d in top_crowded],
        "low_wait_zones": [{"zone_id": z, "avg_density": round(d, 2)} for z, d in low_wait],
        "timestamp": datetime.now(UTC).isoformat(),
    }

    # Call Groq to generate a personalized tip
    if not settings.groq_api_key:
        tip = "Head to the less crowded zones for shorter wait times."
    else:
        try:
            client = _get_groq_client()
            response = await client.chat.completions.create(
                model=settings.groq_model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are Rexi, a venue assistant. Generate 1 concise, actionable tip (1 sentence max).",
                    },
                    {
                        "role": "user",
                        "content": f"Based on this venue state, give 1 smart tip: {json.dumps(venue_data)}",
                    },
                ],
                max_tokens=100,
                temperature=0.8,
            )
            tip = response.choices[0].message.content.strip()
        except Exception:
            tip = "Head to the less crowded zones for shorter wait times."

    result = {
        "venue_id": venue_id,
        "tip": tip,
        "data": venue_data,
    }

    cache_set(cache_key, result, ttl=120)  # Cache for 2 minutes
    return result


async def predict_crowd_density(db: AsyncSession, venue_id: int) -> dict[str, Any]:
    """
    Predict crowd density with narrative explanation.
    GET /api/ai/predict
    """
    snapshots = (
        await db.execute(
            select(CrowdSnapshot)
            .where(CrowdSnapshot.venue_id == venue_id)
            .order_by(CrowdSnapshot.captured_at.desc())
            .limit(30)
        )
    ).scalars().all()

    snapshots = list(reversed(snapshots))

    grouped: dict[int, list[float]] = defaultdict(list)
    for snap in snapshots:
        grouped[snap.zone_id].append(snap.density_score)

    # Heuristic predictions
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

    # Get Groq narrative
    narrative = ""
    if settings.groq_api_key and snapshots:
        compressed = [
            {
                "zone_id": s.zone_id,
                "density": round(s.density_score, 2),
                "timestamp": s.captured_at.isoformat() if s.captured_at else None,
            }
            for s in snapshots[-10:]
        ]

        try:
            client = _get_groq_client()
            response = await client.chat.completions.create(
                model=settings.groq_model,
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "You are a venue analytics assistant. Based on crowd snapshots, "
                            "write a 2-3 sentence narrative prediction for crowd trends in the next 15-30 minutes."
                        ),
                    },
                    {
                        "role": "user",
                        "content": f"Crowd data: {json.dumps(compressed)}. Predict trends.",
                    },
                ],
                max_tokens=200,
                temperature=0.7,
            )
            narrative = response.choices[0].message.content.strip()
        except Exception:
            narrative = "Unable to generate AI prediction at this time."

    result = {
        "venue_id": venue_id,
        "generated_at": datetime.now(UTC).isoformat(),
        "predictions": heuristic_predictions,
        "narrative": narrative,
    }

    cache_set(f"ai:predict:{venue_id}", result, ttl=settings.ai_predict_cache_ttl_seconds)
    return result


async def triage_incident(
    incident_description: str,
    venue_id: int,
    zone_id: int,
    db: AsyncSession,
) -> dict[str, Any]:
    """
    Auto-triage incident using Groq.
    Internal service call when staff POST /incidents.
    Returns: { severity (1-10), category, suggested_steps[] }
    """
    # Get current zone state
    recent_snap = (
        await db.execute(
            select(CrowdSnapshot)
            .where(CrowdSnapshot.venue_id == venue_id, CrowdSnapshot.zone_id == zone_id)
            .order_by(CrowdSnapshot.captured_at.desc())
            .limit(1)
        )
    ).scalar_one_or_none()

    zone_state = {
        "zone_id": zone_id,
        "current_density": recent_snap.density_score if recent_snap else 0.5,
    }

    if not settings.groq_api_key:
        return {
            "severity": 5,
            "category": "general",
            "suggested_steps": ["Assess situation", "Contact supervisor", "Document incident"],
        }

    try:
        client = _get_groq_client()
        response = await client.chat.completions.create(
            model=settings.groq_model,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a venue incident triage assistant. "
                        "Respond ONLY with valid JSON: {\"severity\": 1-10, \"category\": \"medical|crowd|technical|security\", "
                        "\"suggested_steps\": [\"step1\", \"step2\", ...]}"
                    ),
                },
                {
                    "role": "user",
                    "content": (
                        f"Incident: {incident_description}\n"
                        f"Zone state: {json.dumps(zone_state)}\n"
                        f"Classify and suggest steps."
                    ),
                },
            ],
            max_tokens=300,
            temperature=0.5,
        )

        content = response.choices[0].message.content.strip()
        # Extract JSON from response
        try:
            result = json.loads(content)
        except json.JSONDecodeError:
            # Try to extract JSON block
            match = re.search(r"\{.*\}", content, re.DOTALL)
            if match:
                result = json.loads(match.group(0))
            else:
                result = {
                    "severity": 5,
                    "category": "general",
                    "suggested_steps": ["Assess situation", "Contact supervisor"],
                }

        return result
    except Exception:
        return {
            "severity": 5,
            "category": "general",
            "suggested_steps": ["Assess situation", "Contact supervisor"],
        }


async def suggest_route(
    from_zone: int,
    to_zone: int,
    user_preferences: dict[str, Any],
    db: AsyncSession,
) -> dict[str, Any]:
    """
    Suggest personalized route avoiding high-density zones.
    POST /api/ai/route
    """
    # Get current zone densities
    snapshots = (
        await db.execute(
            select(CrowdSnapshot).order_by(CrowdSnapshot.captured_at.desc()).limit(50)
        )
    ).scalars().all()

    zone_densities = defaultdict(list)
    for snap in snapshots:
        zone_densities[snap.zone_id].append(snap.density_score)

    zone_state = {
        z: round(sum(d) / len(d), 2) for z, d in zone_densities.items()
    }

    if not settings.groq_api_key:
        return {
            "steps": ["Move toward zone with lower crowd density"],
            "estimated_time_minutes": 5,
            "avoid_zones": [],
            "narrative": "Recommend moving to less crowded areas.",
        }

    try:
        client = _get_groq_client()
        response = await client.chat.completions.create(
            model=settings.groq_model,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a venue navigation assistant. Return ONLY valid JSON: "
                        "{\"steps\": [\"step1\", ...], \"estimated_time_minutes\": int, "
                        "\"avoid_zones\": [int], \"narrative\": \"string\"}"
                    ),
                },
                {
                    "role": "user",
                    "content": (
                        f"Route from zone {from_zone} to {to_zone}\n"
                        f"User preferences: {json.dumps(user_preferences)}\n"
                        f"Zone densities: {json.dumps(zone_state)}\n"
                        f"Suggest the best route avoiding crowded zones."
                    ),
                },
            ],
            max_tokens=400,
            temperature=0.7,
        )

        content = response.choices[0].message.content.strip()
        try:
            result = json.loads(content)
        except json.JSONDecodeError:
            match = re.search(r"\{.*\}", content, re.DOTALL)
            if match:
                result = json.loads(match.group(0))
            else:
                result = {
                    "steps": ["Move to destination"],
                    "estimated_time_minutes": 5,
                    "avoid_zones": [],
                    "narrative": "Unable to generate detailed route.",
                }

        return result
    except Exception:
        return {
            "steps": ["Move to destination"],
            "estimated_time_minutes": 5,
            "avoid_zones": [],
            "narrative": "Unable to generate route suggestion.",
        }


async def generate_event_summary(
    venue_id: int,
    event_analytics: dict[str, Any],
) -> dict[str, Any]:
    """
    Generate post-event summary with insights.
    GET /api/ai/event-summary (only after event ends)
    """
    cache_key = f"ai:summary:{venue_id}"
    cached = cache_get(cache_key)
    if cached:
        return cached

    if not settings.groq_api_key:
        markdown = (
            "# Event Summary\n\n"
            "Event analytics available. AI summary unavailable at this time.\n\n"
            "## Statistics\n"
            "- Peak crowd density recorded\n"
            "- Queue performance monitored\n"
            "- Incidents logged\n"
        )
    else:
        try:
            client = _get_groq_client()
            response = await client.chat.completions.create(
                model=settings.groq_model,
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "You are a venue operations analyst. "
                            "Generate a markdown event summary with: highlights, bottlenecks, improvements."
                        ),
                    },
                    {
                        "role": "user",
                        "content": f"Event analytics: {json.dumps(event_analytics)}\n\nWrite a detailed markdown summary.",
                    },
                ],
                max_tokens=1000,
                temperature=0.7,
            )

            markdown = response.choices[0].message.content.strip()
        except Exception:
            markdown = (
                "# Event Summary\n\n"
                "Unable to generate AI summary. Please review raw analytics."
            )

    result = {
        "venue_id": venue_id,
        "generated_at": datetime.now(UTC).isoformat(),
        "markdown_report": markdown,
    }

    cache_set(cache_key, result, ttl=86400)  # Cache for 24 hours
    return result


def get_cached_prediction(venue_id: int) -> dict[str, Any] | None:
    """Get cached prediction if available."""
    return cache_get(f"ai:predict:{venue_id}")

