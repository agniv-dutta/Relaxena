from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db_session
from app.models.queue import QueueType
from app.schemas.common import MessageResponse
from app.schemas.queue import QueueEntryResponse, QueueJoinRequest, QueueStatusResponse
from app.services.queue_service import join_queue, leave_queue, queue_status, rebalance_queue

router = APIRouter()


@router.post("/join", response_model=QueueEntryResponse, status_code=status.HTTP_201_CREATED)
async def join_virtual_queue(payload: QueueJoinRequest, db: AsyncSession = Depends(get_db_session)):
    return await join_queue(db, payload)


@router.post("/leave/{ticket_id}", response_model=MessageResponse)
async def leave_virtual_queue(ticket_id: int, db: AsyncSession = Depends(get_db_session)) -> MessageResponse:
    removed = await leave_queue(db, ticket_id)
    if not removed:
        raise HTTPException(status_code=404, detail="Queue entry not found")
    return MessageResponse(message="Queue entry removed")


@router.get("/status/{ticket_id}", response_model=QueueStatusResponse)
async def get_queue_status(ticket_id: int, db: AsyncSession = Depends(get_db_session)) -> QueueStatusResponse:
    return await queue_status(db, ticket_id)


@router.get("/rebalance/{venue_id}")
async def rebalance(
    venue_id: int,
    queue_type: QueueType,
    resources: list[str] = Query(default=[]),
    db: AsyncSession = Depends(get_db_session),
) -> dict[str, str | None]:
    target = await rebalance_queue(db, venue_id, queue_type, resources)
    return {"recommended_resource": target}
