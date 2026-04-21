import json
from typing import Any

from fastapi import APIRouter, Depends, Query
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_user, get_current_user_optional
from app.db.session import get_db_session
from app.models.crowd import CrowdSnapshot
from app.models.user import User
from app.services.ai_service import (
    generate_event_summary,
    get_cached_prediction,
    get_venue_tips,
    predict_crowd_density,
    stream_assistant_reply,
    suggest_route,
    triage_incident,
)

router = APIRouter(prefix="/api/ai", tags=["ai"])


class AIChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=1000)
    venue_id: int
    user_id: int | None = None


class AIRouteRequest(BaseModel):
    from_zone: int
    to_zone: int
    user_preferences: dict[str, Any] = Field(default_factory=dict)
    venue_id: int


class AIIncidentRequest(BaseModel):
    description: str = Field(min_length=1, max_length=2000)
    venue_id: int
    zone_id: int


@router.post("/chat")
async def ai_chat(
    payload: AIChatRequest,
    db: AsyncSession = Depends(get_db_session),
    current_user: User | None = Depends(get_current_user_optional),
):
    """
    Stream AI chat response with enriched venue context.
    1. STREAMING CHAT ASSISTANT
    - Inject live venue context: crowd densities, wait times, weather, event score
    - Stream via SSE (text/event-stream)
    - Store last 10 messages per user session
    """
    recent_snapshots = (
        await db.execute(
            select(CrowdSnapshot)
            .where(CrowdSnapshot.venue_id == payload.venue_id)
            .order_by(CrowdSnapshot.captured_at.desc())
            .limit(20)
        )
    ).scalars().all()

    # Build enriched venue context
    zone_densities = {}
    for snap in recent_snapshots:
        if snap.zone_id not in zone_densities:
            zone_densities[snap.zone_id] = []
        zone_densities[snap.zone_id].append(snap.density_score)

    avg_densities = {
        z: round(sum(d) / len(d), 2) for z, d in zone_densities.items()
    }

    venue_context: dict[str, Any] = {
        "venue_id": payload.venue_id,
        "zone_densities": avg_densities,
        "peak_zone": max(avg_densities, key=avg_densities.get) if avg_densities else None,
        "least_crowded_zone": min(avg_densities, key=avg_densities.get) if avg_densities else None,
        "recent_density_trend": [
            {"zone_id": s.zone_id, "density": round(s.density_score, 2), "timestamp": s.captured_at.isoformat()}
            for s in recent_snapshots[:5]
            if s.captured_at
        ],
    }

    async def event_generator():
        async for chunk in stream_assistant_reply(
            message=payload.message,
            venue_id=payload.venue_id,
            user_id=payload.user_id or (current_user.id if current_user else 1),
            venue_context=venue_context,
        ):
            yield chunk

    return StreamingResponse(event_generator(), media_type="text/event-stream")


@router.post("/assistant")
async def ai_assistant_alias(
    payload: AIChatRequest,
    db: AsyncSession = Depends(get_db_session),
    user: User = Depends(get_current_user),
):
    """Alias for /chat endpoint."""
    return await ai_chat(payload, db, user)


@router.get("/tip")
async def ai_venue_tips(
    venue_id: int = Query(..., ge=1),
    db: AsyncSession = Depends(get_db_session),
    _: User = Depends(get_current_user),
):
    """
    2. SMART VENUE TIPS
    - Called on dashboard load
    - Groq analyzes: top 3 crowded zones, top 3 low-wait stands, weather, event minute
    - Returns: 1-sentence personalized tip
    - Cached for 2 minutes per venue
    """
    return await get_venue_tips(db, venue_id)


@router.get("/predict")
async def ai_predict(
    venue_id: int = Query(..., ge=1),
    refresh: bool = Query(False),
    db: AsyncSession = Depends(get_db_session),
    _: User = Depends(get_current_user),
):
    """
    3. CROWD PREDICTION NARRATIVE
    - Returns: narrative + structured predictions
    - Cached for 5 minutes
    """
    if not refresh:
        cached = await get_cached_prediction(venue_id)
        if cached is not None:
            return cached

    return await predict_crowd_density(db, venue_id)


@router.post("/route")
async def ai_suggest_route(
    payload: AIRouteRequest,
    db: AsyncSession = Depends(get_db_session),
    _: User = Depends(get_current_user),
):
    """
    5. PERSONALIZED ROUTE SUGGESTION
    - Input: from_zone, to_zone, user_preferences (mobility, food_pref)
    - Returns: { steps[], estimated_time, avoid_zones[], narrative }
    """
    return await suggest_route(
        from_zone=payload.from_zone,
        to_zone=payload.to_zone,
        user_preferences=payload.user_preferences,
        db=db,
    )


@router.post("/triage-incident")
async def ai_triage_incident(
    payload: AIIncidentRequest,
    db: AsyncSession = Depends(get_db_session),
    _: User = Depends(get_current_user),
):
    """
    4. INCIDENT AUTO-TRIAGE (internal service call)
    - Staff POST incident description
    - Groq returns: severity (1-10), category, suggested_steps[]
    - Automatically saved to incident record
    """
    return await triage_incident(
        incident_description=payload.description,
        venue_id=payload.venue_id,
        zone_id=payload.zone_id,
        db=db,
    )


class AIEventSummaryRequest(BaseModel):
    venue_id: int
    event_analytics: dict[str, Any] = Field(default_factory=dict)


@router.post("/event-summary")
async def ai_event_summary(
    payload: AIEventSummaryRequest,
    _: User = Depends(get_current_user),
):
    """
    6. POST-EVENT SUMMARY
    - Only available after event ends
    - Returns: markdown report with highlights, bottlenecks, improvements
    - Staff can download as PDF
    """
    return await generate_event_summary(
        venue_id=payload.venue_id,
        event_analytics=payload.event_analytics,
    )

