from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class CrowdSnapshotCreate(BaseModel):
    venue_id: int
    zone_id: int
    density_score: float = Field(ge=0.0, le=1.0)


class CrowdSnapshotResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    venue_id: int
    zone_id: int
    density_score: float
    captured_at: datetime


class CrowdHeatmapPoint(BaseModel):
    zone_id: int
    density_score: float
    timestamp: datetime


class CrowdAlert(BaseModel):
    venue_id: int
    zone_id: int
    severity: str
    message: str
