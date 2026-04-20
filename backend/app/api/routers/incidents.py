from fastapi import APIRouter, Depends, status
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_user
from app.db.session import get_db_session
from app.models.incident import Incident
from app.models.user import User

router = APIRouter(prefix="/api/incidents", tags=["incidents"])


class IncidentCreateRequest(BaseModel):
    venue_id: int
    zone_id: int | None = None
    title: str = Field(min_length=3, max_length=140)
    description: str = Field(min_length=5, max_length=5000)
    severity: str = Field(default="medium")


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_incident(
    payload: IncidentCreateRequest,
    db: AsyncSession = Depends(get_db_session),
    user: User = Depends(get_current_user),
):
    incident = Incident(
        venue_id=payload.venue_id,
        zone_id=payload.zone_id,
        title=payload.title,
        description=payload.description,
        severity=payload.severity.lower(),
        reported_by_user_id=user.id,
        escalated=payload.severity.lower() in {"high", "critical"},
    )
    db.add(incident)
    await db.commit()
    await db.refresh(incident)

    return {
        "id": incident.id,
        "venue_id": incident.venue_id,
        "zone_id": incident.zone_id,
        "title": incident.title,
        "severity": incident.severity,
        "status": incident.status,
        "message": "Incident logged.",
    }
