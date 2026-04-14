from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.dependencies import get_current_user
from app.db.session import get_db_session
from app.models.user import NotificationPreference, User
from app.schemas.user import NotificationPreferenceResponse, NotificationPreferenceUpdate, UserResponse

router = APIRouter()


@router.get("/me", response_model=UserResponse)
async def my_profile(user: User = Depends(get_current_user)) -> User:
    return user


@router.get("/me/notifications", response_model=NotificationPreferenceResponse)
async def get_notification_preferences(
    user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db_session)
) -> NotificationPreference:
    pref = user.notification_preference
    if pref is None:
        pref = NotificationPreference(user_id=user.id)
        db.add(pref)
        await db.commit()
        await db.refresh(pref)
    return pref


@router.put("/me/notifications", response_model=NotificationPreferenceResponse)
async def update_notification_preferences(
    payload: NotificationPreferenceUpdate,
    user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db_session),
) -> NotificationPreference:
    pref = user.notification_preference
    if pref is None:
        pref = NotificationPreference(user_id=user.id)
        db.add(pref)

    pref.push_enabled = payload.push_enabled
    pref.sms_enabled = payload.sms_enabled
    pref.email_enabled = payload.email_enabled
    await db.commit()
    await db.refresh(pref)
    return pref
