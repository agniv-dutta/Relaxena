import enum
from datetime import datetime

from sqlalchemy import DateTime, Enum, Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.sql import func

from app.db.base_class import Base


class QueueType(str, enum.Enum):
    concession = "concession"
    restroom = "restroom"
    entry_gate = "entry_gate"


class QueueEntry(Base):
    __tablename__ = "queue_entries"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    ticket_id: Mapped[int] = mapped_column(ForeignKey("tickets.id", ondelete="CASCADE"), index=True)
    venue_id: Mapped[int] = mapped_column(ForeignKey("venues.id", ondelete="CASCADE"), index=True)
    queue_type: Mapped[QueueType] = mapped_column(Enum(QueueType), index=True)
    resource_id: Mapped[str] = mapped_column(String(80), index=True)
    joined_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), index=True)


class WaitTimeLog(Base):
    __tablename__ = "wait_time_logs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    venue_id: Mapped[int] = mapped_column(ForeignKey("venues.id", ondelete="CASCADE"), index=True)
    queue_type: Mapped[QueueType] = mapped_column(Enum(QueueType), index=True)
    resource_id: Mapped[str] = mapped_column(String(80), index=True)
    avg_wait_minutes: Mapped[float] = mapped_column(Float)
    observed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), index=True)
