from pydantic import BaseModel, ConfigDict, EmailStr

from app.models.user import UserRole


class NotificationPreferenceUpdate(BaseModel):
    push_enabled: bool = True
    sms_enabled: bool = False
    email_enabled: bool = True


class NotificationPreferenceResponse(NotificationPreferenceUpdate):
    model_config = ConfigDict(from_attributes=True)


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: EmailStr
    full_name: str
    role: UserRole
    ticket_id: int | None
    seat_label: str | None
