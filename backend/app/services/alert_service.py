import json
from datetime import UTC, datetime
from typing import Any

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.alert import Alert
from app.websockets.manager import ws_channel_manager


async def publish_alert(
    db: AsyncSession,
    venue_id: int,
    alert_type: str,
    title: str,
    message: str,
    severity: str = "MEDIUM",
    zone_id: int | None = None,
) -> Alert:
    alert = Alert(
        venue_id=venue_id,
        zone_id=zone_id,
        severity=severity.lower(),
        title=title,
        message=message,
    )
    db.add(alert)
    await db.commit()
    await db.refresh(alert)

    payload: dict[str, Any] = {
        "type": alert_type,
        "alert_id": alert.id,
        "venue_id": venue_id,
        "zone_id": zone_id,
        "severity": severity,
        "title": title,
        "message": message,
        "timestamp": datetime.now(UTC).isoformat(),
    }

    await ws_channel_manager.broadcast(f"alerts:{venue_id}", payload)
    return alert
