import json
from datetime import UTC, datetime
from typing import Any

import httpx
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.cache import cache_get, cache_set
from app.core.config import settings
from app.models.event import Event


async def get_live_score(db: AsyncSession, event_id: int) -> dict[str, Any] | None:
    event = await db.get(Event, event_id)
    if event is None:
        return None

    cache_key = f"sports:score:{event_id}"
    cached = cache_get(cache_key)
    if cached:
        return cached

    score_payload = {
        "event_id": event.id,
        "home_team": event.home_team or "Home",
        "away_team": event.away_team or "Away",
        "home_score": 0,
        "away_score": 0,
        "period": "Pre-match",
        "top_events": [],
        "updated_at": datetime.now(UTC).isoformat(),
    }

    if settings.sportsdata_api_key:
        try:
            # Provider-specific mapping can be customized with external IDs.
            async with httpx.AsyncClient(timeout=12.0) as client:
                resp = await client.get(
                    "https://api.sportsdata.io/v3/soccer/scores/json/LiveGames",
                    headers={"Ocp-Apim-Subscription-Key": settings.sportsdata_api_key},
                )
                if resp.status_code == 200:
                    games = resp.json()
                    if games:
                        first = games[0]
                        score_payload.update(
                            {
                                "home_score": first.get("HomeTeamScore", 0),
                                "away_score": first.get("AwayTeamScore", 0),
                                "period": first.get("Status", "Live"),
                            }
                        )
        except Exception:
            pass

    cache_set(cache_key, score_payload, ttl=60)
    return score_payload


async def poll_sports_updates(db: AsyncSession) -> list[dict[str, Any]]:
    events = (await db.execute(select(Event).order_by(Event.start_time.desc()).limit(10))).scalars().all()
    updates: list[dict[str, Any]] = []
    for event in events:
        payload = await get_live_score(db, event.id)
        if payload:
            updates.append(payload)
    return updates
