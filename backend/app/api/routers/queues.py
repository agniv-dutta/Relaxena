from datetime import UTC, datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy import and_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_user
from app.db.session import get_db_session
from app.models.queue import QueueEntry, QueueType
from app.models.user import User
from app.websockets.manager import ws_channel_manager

router = APIRouter(prefix="/api/queues", tags=["queues"])


class QueueJoinRequest(BaseModel):
    venue_id: int
    location_id: str = Field(min_length=1, max_length=80)
    queue_type: QueueType


@router.post("/join")
async def join_queue(
    payload: QueueJoinRequest,
    db: AsyncSession = Depends(get_db_session),
    user: User = Depends(get_current_user),
):
    existing = (
        await db.execute(select(QueueEntry).where(and_(QueueEntry.user_id == user.id, QueueEntry.status == "waiting")))
    ).scalar_one_or_none()
    if existing is not None:
        raise HTTPException(status_code=409, detail="User already in a waiting queue")

    current_count = (
        await db.execute(
            select(QueueEntry).where(
                and_(
                    QueueEntry.venue_id == payload.venue_id,
                    QueueEntry.location_id == payload.location_id,
                    QueueEntry.status == "waiting",
                )
            )
        )
    ).scalars().all()

    position = len(current_count) + 1
    service_time = 90
    estimated_ready = datetime.now(UTC) + timedelta(seconds=service_time * position)

    entry = QueueEntry(
        user_id=user.id,
        venue_id=payload.venue_id,
        queue_type=payload.queue_type,
        resource_id=payload.location_id,
        location_id=payload.location_id,
        position=position,
        estimated_ready_at=estimated_ready,
        service_time_seconds=service_time,
        status="waiting",
    )
    db.add(entry)
    await db.commit()
    await db.refresh(entry)

    await ws_channel_manager.broadcast(
        f"queue:{user.id}",
        {
            "type": "QUEUE_JOINED",
            "queue_id": entry.id,
            "position": entry.position,
            "estimated_ready_at": entry.estimated_ready_at.isoformat() if entry.estimated_ready_at else None,
        },
    )

    return {
        "queue_id": entry.id,
        "position": entry.position,
        "estimated_ready_at": entry.estimated_ready_at,
        "status": entry.status,
    }
