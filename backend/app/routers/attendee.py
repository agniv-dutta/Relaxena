from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_user
from app.db.session import get_db_session
from app.models.user import User
from app.schemas.attendee import (
    ConcessionSuggestion,
    EventScheduleItem,
    LiveScoreStub,
    NavigationSuggestion,
)
from app.services.attendee_service import (
    event_schedule,
    live_score_stub,
    nearest_low_wait_concession,
    suggest_path_to_seat,
)

router = APIRouter()


@router.get("/navigation/seat", response_model=NavigationSuggestion)
async def navigation_to_seat(
    user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db_session)
) -> NavigationSuggestion:
    return await suggest_path_to_seat(db, user.id)


@router.get("/concession/recommendation/{venue_id}", response_model=ConcessionSuggestion)
async def concession_recommendation(
    venue_id: int,
    _: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session),
) -> ConcessionSuggestion:
    return await nearest_low_wait_concession(db, venue_id)


@router.get("/events/{venue_id}/schedule", response_model=list[EventScheduleItem])
async def get_schedule(venue_id: int, db: AsyncSession = Depends(get_db_session)) -> list[EventScheduleItem]:
    return await event_schedule(db, venue_id)


@router.get("/events/{event_id}/live-score", response_model=LiveScoreStub)
async def live_score(event_id: int, db: AsyncSession = Depends(get_db_session)) -> LiveScoreStub:
    score = await live_score_stub(db, event_id)
    if score is None:
        raise HTTPException(status_code=404, detail="Event not found")
    return score
