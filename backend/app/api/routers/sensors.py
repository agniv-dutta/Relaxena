from datetime import UTC, datetime

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db_session
from app.models.crowd import CrowdSnapshot
from app.models.venue import Zone
from app.websockets.manager import ws_channel_manager

router = APIRouter(prefix="/api/sensors", tags=["sensors"])


class SensorUpdateRequest(BaseModel):
    zone_id: int = Field(..., ge=1)
    count_delta: int = Field(..., ge=-500, le=500)


@router.post("/update")
async def sensor_update(payload: SensorUpdateRequest, db: AsyncSession = Depends(get_db_session)):
    zone = await db.get(Zone, payload.zone_id)
    if zone is None:
        raise HTTPException(status_code=404, detail="Zone not found")

    zone.current_count = max(0, zone.current_count + payload.count_delta)
    zone.density_score = round(min(1.0, zone.current_count / max(zone.capacity, 1)), 3)

    snapshot = CrowdSnapshot(
        venue_id=zone.venue_id,
        zone_id=zone.id,
        density_score=zone.density_score,
    )
    db.add(snapshot)
    await db.commit()

    message = {
        "type": "crowd_snapshot",
        "venue_id": zone.venue_id,
        "zone_id": zone.id,
        "count": zone.current_count,
        "density_score": zone.density_score,
        "timestamp": datetime.now(UTC).isoformat(),
    }
    await ws_channel_manager.broadcast(f"crowd:{zone.venue_id}", message)

    return message
