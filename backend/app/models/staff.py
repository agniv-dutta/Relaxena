from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func

from app.db.base_class import Base


class StaffMember(Base):
    __tablename__ = "staff_members"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), unique=True, index=True)
    staff_code: Mapped[str] = mapped_column(String(40), unique=True, index=True)
    designation: Mapped[str] = mapped_column(String(80), index=True)


class ShiftLog(Base):
    __tablename__ = "shift_logs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    staff_member_id: Mapped[int] = mapped_column(ForeignKey("staff_members.id", ondelete="CASCADE"), index=True)
    venue_id: Mapped[int] = mapped_column(ForeignKey("venues.id", ondelete="CASCADE"), index=True)
    started_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), index=True)
    ended_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="active", index=True)
