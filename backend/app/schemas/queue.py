from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.models.queue import QueueType


class QueueJoinRequest(BaseModel):
    ticket_id: int
    venue_id: int
    queue_type: QueueType
    resource_id: str


class QueueLeaveRequest(BaseModel):
    ticket_id: int


class QueueStatusResponse(BaseModel):
    ticket_id: int
    in_queue: bool
    queue_type: QueueType | None = None
    resource_id: str | None = None
    position: int | None = None
    estimated_wait_minutes: float | None = None
    joined_at: datetime | None = None


class QueueEntryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    ticket_id: int
    venue_id: int
    queue_type: QueueType
    resource_id: str
    joined_at: datetime
