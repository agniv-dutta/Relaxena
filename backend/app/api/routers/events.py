from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db_session
from app.services.sports_service import get_live_score

router = APIRouter(prefix="/api/events", tags=["events"])


@router.get("/{event_id}/live-score")
async def live_score(event_id: int, db: AsyncSession = Depends(get_db_session)):
    payload = await get_live_score(db, event_id)
    if payload is None:
        # Keep frontend polling stable even when demo event rows are not seeded yet.
        return {
            "event_id": event_id,
            "home_team": "Relaxena FC",
            "away_team": "United",
            "home_score": 0,
            "away_score": 0,
            "period": "Pre-match",
            "top_events": [],
            "updated_at": None,
        }
    return payload
