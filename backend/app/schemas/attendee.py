from datetime import datetime

from pydantic import BaseModel


class NavigationSuggestion(BaseModel):
    user_id: int
    destination: str
    route: list[str]
    estimated_minutes: int


class ConcessionSuggestion(BaseModel):
    venue_id: int
    recommended_resource_id: str
    estimated_wait_minutes: float


class EventScheduleItem(BaseModel):
    event_id: int
    name: str
    start_time: datetime
    end_time: datetime


class LiveScoreStub(BaseModel):
    event_id: int
    home_team: str
    away_team: str
    home_score: int
    away_score: int
    status: str
