from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db_session
from app.services.venue_service import get_venue_conditions, get_venue_layout

router = APIRouter(prefix="/api/venues", tags=["venues"])


@router.get("/{venue_id}/layout")
async def venue_layout(venue_id: int, db: AsyncSession = Depends(get_db_session)):
    layout = await get_venue_layout(db, venue_id)
    if layout is None:
        raise HTTPException(status_code=404, detail="Venue not found")
    return layout


@router.get("/{venue_id}/conditions")
async def venue_conditions(venue_id: int, db: AsyncSession = Depends(get_db_session)):
    payload = await get_venue_conditions(db, venue_id)
    if payload is None:
        raise HTTPException(status_code=404, detail="Venue not found")
    return payload
