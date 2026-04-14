from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db_session
from app.schemas.crowd import CrowdHeatmapPoint, CrowdSnapshotCreate, CrowdSnapshotResponse
from app.services.crowd_service import create_crowd_snapshot, get_heatmap_points

router = APIRouter()


@router.post("/snapshot", response_model=CrowdSnapshotResponse, status_code=status.HTTP_201_CREATED)
async def create_snapshot(payload: CrowdSnapshotCreate, db: AsyncSession = Depends(get_db_session)):
    return await create_crowd_snapshot(db, payload)


@router.get("/heatmap/{venue_id}", response_model=list[CrowdHeatmapPoint])
async def crowd_heatmap(
    venue_id: int,
    limit: int = Query(default=200, ge=1, le=1000),
    db: AsyncSession = Depends(get_db_session),
) -> list[CrowdHeatmapPoint]:
    snapshots = await get_heatmap_points(db, venue_id=venue_id, limit=limit)
    return [
        CrowdHeatmapPoint(
            zone_id=item.zone_id,
            density_score=item.density_score,
            timestamp=item.captured_at,
        )
        for item in snapshots
    ]
