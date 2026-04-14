from sqlalchemy import and_, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.queue import QueueEntry, QueueType, WaitTimeLog
from app.schemas.queue import QueueJoinRequest, QueueStatusResponse


async def join_queue(db: AsyncSession, payload: QueueJoinRequest) -> QueueEntry:
    existing_stmt = select(QueueEntry).where(QueueEntry.ticket_id == payload.ticket_id)
    existing = (await db.execute(existing_stmt)).scalar_one_or_none()
    if existing is not None:
        await db.delete(existing)

    entry = QueueEntry(
        ticket_id=payload.ticket_id,
        venue_id=payload.venue_id,
        queue_type=payload.queue_type,
        resource_id=payload.resource_id,
    )
    db.add(entry)
    await db.commit()
    await db.refresh(entry)
    return entry


async def leave_queue(db: AsyncSession, ticket_id: int) -> bool:
    stmt = select(QueueEntry).where(QueueEntry.ticket_id == ticket_id)
    entry = (await db.execute(stmt)).scalar_one_or_none()
    if entry is None:
        return False
    await db.delete(entry)
    await db.commit()
    return True


async def queue_status(db: AsyncSession, ticket_id: int) -> QueueStatusResponse:
    stmt = select(QueueEntry).where(QueueEntry.ticket_id == ticket_id)
    entry = (await db.execute(stmt)).scalar_one_or_none()

    if entry is None:
        return QueueStatusResponse(ticket_id=ticket_id, in_queue=False)

    position_stmt = select(func.count()).where(
        and_(
            QueueEntry.queue_type == entry.queue_type,
            QueueEntry.resource_id == entry.resource_id,
            QueueEntry.joined_at <= entry.joined_at,
        )
    )
    position = (await db.execute(position_stmt)).scalar_one()

    wait_stmt = (
        select(WaitTimeLog)
        .where(
            and_(
                WaitTimeLog.queue_type == entry.queue_type,
                WaitTimeLog.resource_id == entry.resource_id,
            )
        )
        .order_by(WaitTimeLog.observed_at.desc())
        .limit(1)
    )
    wait_log = (await db.execute(wait_stmt)).scalar_one_or_none()
    estimated_wait = wait_log.avg_wait_minutes if wait_log else float(position) * 1.5

    return QueueStatusResponse(
        ticket_id=ticket_id,
        in_queue=True,
        queue_type=entry.queue_type,
        resource_id=entry.resource_id,
        position=int(position),
        estimated_wait_minutes=estimated_wait,
        joined_at=entry.joined_at,
    )


async def rebalance_queue(
    db: AsyncSession,
    venue_id: int,
    queue_type: QueueType,
    candidate_resources: list[str],
) -> str | None:
    if not candidate_resources:
        return None

    counts_stmt = (
        select(QueueEntry.resource_id, func.count(QueueEntry.id).label("count"))
        .where(
            and_(
                QueueEntry.venue_id == venue_id,
                QueueEntry.queue_type == queue_type,
                QueueEntry.resource_id.in_(candidate_resources),
            )
        )
        .group_by(QueueEntry.resource_id)
    )
    rows = (await db.execute(counts_stmt)).all()
    counts = {resource: count for resource, count in rows}

    for resource in candidate_resources:
        counts.setdefault(resource, 0)

    return min(counts, key=counts.get)
