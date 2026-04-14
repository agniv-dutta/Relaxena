from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class AlertCreate(BaseModel):
    venue_id: int
    zone_id: int | None = None
    severity: str = Field(default="medium")
    title: str
    message: str


class AlertResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    venue_id: int
    zone_id: int | None
    severity: str
    title: str
    message: str
    created_at: datetime


class IncidentCreate(BaseModel):
    venue_id: int
    zone_id: int | None = None
    title: str
    description: str
    severity: str = "low"


class IncidentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    venue_id: int
    reported_by_user_id: int
    zone_id: int | None
    title: str
    description: str
    severity: str
    status: str
    escalated: bool
    reported_at: datetime


class DashboardStats(BaseModel):
    active_incidents: int
    critical_alerts_last_hour: int
    avg_density: float
    active_queue_entries: int
