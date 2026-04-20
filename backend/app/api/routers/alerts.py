from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_user
from app.db.session import get_db_session
from app.models.user import User
from app.services.alert_service import publish_alert

router = APIRouter(prefix="/api/alerts", tags=["alerts"])


class AlertPublishRequest(BaseModel):
    venue_id: int
    zone_id: int | None = None
    alert_type: str = Field(min_length=2, max_length=60)
    title: str = Field(min_length=3, max_length=120)
    message: str = Field(min_length=3, max_length=500)
    severity: str = Field(default="MEDIUM", max_length=20)


@router.post("/publish")
async def publish_alert_endpoint(
    payload: AlertPublishRequest,
    db: AsyncSession = Depends(get_db_session),
    _: User = Depends(get_current_user),
):
    alert = await publish_alert(
        db=db,
        venue_id=payload.venue_id,
        zone_id=payload.zone_id,
        alert_type=payload.alert_type,
        title=payload.title,
        message=payload.message,
        severity=payload.severity,
    )
    return {
        "id": alert.id,
        "venue_id": alert.venue_id,
        "zone_id": alert.zone_id,
        "title": alert.title,
        "severity": alert.severity,
        "message": alert.message,
    }
