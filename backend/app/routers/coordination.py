from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_user, require_roles
from app.db.session import get_db_session
from app.models.user import User, UserRole
from app.schemas.coordination import (
    AlertCreate,
    AlertResponse,
    DashboardStats,
    IncidentCreate,
    IncidentResponse,
)
from app.services.coordination_service import create_staff_alert, dashboard_stats, report_incident

router = APIRouter()


@router.post("/alerts", response_model=AlertResponse, status_code=status.HTTP_201_CREATED)
async def create_alert(
    payload: AlertCreate,
    _: User = Depends(require_roles(UserRole.staff, UserRole.admin)),
    db: AsyncSession = Depends(get_db_session),
):
    return await create_staff_alert(db, payload)


@router.post("/incidents", response_model=IncidentResponse, status_code=status.HTTP_201_CREATED)
async def create_incident(
    payload: IncidentCreate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session),
):
    return await report_incident(db, user.id, payload)


@router.get("/dashboard/{venue_id}", response_model=DashboardStats)
async def get_dashboard(
    venue_id: int,
    _: User = Depends(require_roles(UserRole.staff, UserRole.admin)),
    db: AsyncSession = Depends(get_db_session),
) -> DashboardStats:
    return await dashboard_stats(db, venue_id)
