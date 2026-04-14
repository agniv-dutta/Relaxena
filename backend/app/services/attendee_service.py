from sqlalchemy import and_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.event import Event
from app.models.queue import QueueType, WaitTimeLog
from app.models.user import User
from app.schemas.attendee import (
    ConcessionSuggestion,
    EventScheduleItem,
    LiveScoreStub,
    NavigationSuggestion,
)


async def suggest_path_to_seat(db: AsyncSession, user_id: int) -> NavigationSuggestion:
    user = await db.get(User, user_id)
    destination = user.seat_label if user and user.seat_label else "Assigned Seat"

    route = [
        "Entrance",
        "Main Concourse",
        "Section Corridor",
        destination,
    ]
    return NavigationSuggestion(user_id=user_id, destination=destination, route=route, estimated_minutes=8)


async def nearest_low_wait_concession(db: AsyncSession, venue_id: int) -> ConcessionSuggestion:
    stmt = (
        select(WaitTimeLog)
        .where(
            and_(
                WaitTimeLog.venue_id == venue_id,
                WaitTimeLog.queue_type == QueueType.concession,
            )
        )
        .order_by(WaitTimeLog.avg_wait_minutes.asc(), WaitTimeLog.observed_at.desc())
        .limit(1)
    )
    best = (await db.execute(stmt)).scalar_one_or_none()

    if best is None:
        return ConcessionSuggestion(
            venue_id=venue_id,
            recommended_resource_id="concession-a",
            estimated_wait_minutes=5.0,
        )

    return ConcessionSuggestion(
        venue_id=venue_id,
        recommended_resource_id=best.resource_id,
        estimated_wait_minutes=best.avg_wait_minutes,
    )


async def event_schedule(db: AsyncSession, venue_id: int) -> list[EventScheduleItem]:
    stmt = select(Event).where(Event.venue_id == venue_id).order_by(Event.start_time.asc())
    events = (await db.execute(stmt)).scalars().all()
    return [
        EventScheduleItem(
            event_id=item.id,
            name=item.name,
            start_time=item.start_time,
            end_time=item.end_time,
        )
        for item in events
    ]


async def live_score_stub(db: AsyncSession, event_id: int) -> LiveScoreStub | None:
    event = await db.get(Event, event_id)
    if event is None:
        return None

    return LiveScoreStub(
        event_id=event.id,
        home_team=event.home_team or "Home",
        away_team=event.away_team or "Away",
        home_score=2,
        away_score=1,
        status="Q3 08:21",
    )
