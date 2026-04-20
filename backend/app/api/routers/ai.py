import json
from typing import Any

from fastapi import APIRouter, Depends, Query
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_user
from app.db.session import get_db_session
from app.models.crowd import CrowdSnapshot
from app.models.user import User
from app.services.ai_service import get_cached_prediction, predict_crowd_density, stream_assistant_reply

router = APIRouter(prefix="/api/ai", tags=["ai"])


class AIChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=1000)
    venue_id: int
    user_id: int


@router.post("/chat")
async def ai_chat(
    payload: AIChatRequest,
    db: AsyncSession = Depends(get_db_session),
    _: User = Depends(get_current_user),
):
    recent_snapshots = (
        await db.execute(
            select(CrowdSnapshot)
            .where(CrowdSnapshot.venue_id == payload.venue_id)
            .order_by(CrowdSnapshot.captured_at.desc())
            .limit(10)
        )
    ).scalars().all()

    top_zone = recent_snapshots[0].zone_id if recent_snapshots else None
    venue_context: dict[str, Any] = {
        "venue_id": payload.venue_id,
        "top_zone": top_zone,
        "recent_density": [
            {"zone_id": s.zone_id, "density": s.density_score, "timestamp": s.captured_at.isoformat()}
            for s in recent_snapshots
            if s.captured_at
        ],
    }

    async def event_generator():
        async for chunk in stream_assistant_reply(
            message=payload.message,
            venue_id=payload.venue_id,
            user_id=payload.user_id,
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
    return await ai_chat(payload, db, user)


@router.get("/predict")
async def ai_predict(
    venue_id: int = Query(..., ge=1),
    refresh: bool = Query(False),
    db: AsyncSession = Depends(get_db_session),
    _: User = Depends(get_current_user),
):
    if not refresh:
        cached = await get_cached_prediction(venue_id)
        if cached is not None:
            return cached

    return await predict_crowd_density(db, venue_id)
