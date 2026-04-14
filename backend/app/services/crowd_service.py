import json

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.redis import get_redis
from app.core.websocket_manager import ws_manager
from app.models.alert import Alert
from app.models.crowd import CrowdSnapshot
from app.schemas.crowd import CrowdAlert, CrowdSnapshotCreate


async def create_crowd_snapshot(db: AsyncSession, payload: CrowdSnapshotCreate) -> CrowdSnapshot:
    snapshot = CrowdSnapshot(
        venue_id=payload.venue_id,
        zone_id=payload.zone_id,
        density_score=payload.density_score,
    )
    db.add(snapshot)
    await db.flush()

    redis = None
    try:
        redis = await get_redis()
    except Exception:
        redis = None

    update = {
        "type": "crowd_snapshot",
        "venue_id": snapshot.venue_id,
        "zone_id": snapshot.zone_id,
        "density_score": snapshot.density_score,
        "timestamp": snapshot.captured_at.isoformat() if snapshot.captured_at else None,
    }
    if redis is not None:
        await redis.publish(f"crowd:{snapshot.venue_id}", json.dumps(update))
    await ws_manager.broadcast(snapshot.venue_id, update)

    if snapshot.density_score >= settings.crowd_alert_density_threshold:
        alert = Alert(
            venue_id=snapshot.venue_id,
            zone_id=snapshot.zone_id,
            severity="high",
            title="Crowd Flow Threshold Breach",
            message=(
                f"Zone {snapshot.zone_id} crossed density threshold at "
                f"{snapshot.density_score:.2f}."
            ),
        )
        db.add(alert)
        alert_payload = CrowdAlert(
            venue_id=snapshot.venue_id,
            zone_id=snapshot.zone_id,
            severity="high",
            message=alert.message,
        )
        if redis is not None:
            await redis.publish(f"staff_alerts:{snapshot.venue_id}", alert_payload.model_dump_json())

    await db.commit()
    await db.refresh(snapshot)
    return snapshot


async def get_heatmap_points(db: AsyncSession, venue_id: int, limit: int = 200) -> list[CrowdSnapshot]:
    stmt = (
        select(CrowdSnapshot)
        .where(CrowdSnapshot.venue_id == venue_id)
        .order_by(CrowdSnapshot.captured_at.desc())
        .limit(limit)
    )
    result = await db.execute(stmt)
    return list(reversed(result.scalars().all()))
