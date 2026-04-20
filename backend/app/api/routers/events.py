from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db_session
from app.services.sports_service import get_live_score

router = APIRouter(prefix="/api/events", tags=["events"])


@router.get("/{event_id}/live-score")
async def live_score(event_id: int, db: AsyncSession = Depends(get_db_session)):
    payload = await get_live_score(db, event_id)
    if payload is None:
        raise HTTPException(status_code=404, detail="Event not found")
    return payload
