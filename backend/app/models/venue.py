from sqlalchemy import Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base_class import Base


class Venue(Base):
    __tablename__ = "venues"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(120), unique=True, index=True)
    city: Mapped[str] = mapped_column(String(120))
    capacity: Mapped[int] = mapped_column(Integer)
    weather_condition: Mapped[str | None] = mapped_column(String(80), nullable=True)
    crowd_weather_score: Mapped[float] = mapped_column(Float, default=0.0)

    floors: Mapped[list["Floor"]] = relationship(back_populates="venue", cascade="all, delete-orphan")
    zones: Mapped[list["Zone"]] = relationship(back_populates="venue", cascade="all, delete-orphan")
    gates: Mapped[list["Gate"]] = relationship(back_populates="venue", cascade="all, delete-orphan")
    sections: Mapped[list["Section"]] = relationship(back_populates="venue", cascade="all, delete-orphan")
    stands: Mapped[list["Stand"]] = relationship(back_populates="venue", cascade="all, delete-orphan")
    restrooms: Mapped[list["Restroom"]] = relationship(back_populates="venue", cascade="all, delete-orphan")


class Floor(Base):
    __tablename__ = "floors"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    venue_id: Mapped[int] = mapped_column(ForeignKey("venues.id", ondelete="CASCADE"), index=True)
    name: Mapped[str] = mapped_column(String(80), index=True)
    level: Mapped[int] = mapped_column(Integer, index=True)

    venue: Mapped[Venue] = relationship(back_populates="floors")
    zones: Mapped[list["Zone"]] = relationship(back_populates="floor", cascade="all, delete-orphan")


class Zone(Base):
    __tablename__ = "zones"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    venue_id: Mapped[int] = mapped_column(ForeignKey("venues.id", ondelete="CASCADE"), index=True)
    floor_id: Mapped[int | None] = mapped_column(ForeignKey("floors.id", ondelete="SET NULL"), nullable=True)
    name: Mapped[str] = mapped_column(String(100), index=True)
    capacity: Mapped[int] = mapped_column(Integer, default=1000)
    current_count: Mapped[int] = mapped_column(Integer, default=0)
    density_score: Mapped[float] = mapped_column(Float, default=0.0, index=True)
    polygon_geojson: Mapped[str | None] = mapped_column(Text, nullable=True)

    venue: Mapped[Venue] = relationship(back_populates="zones")
    floor: Mapped[Floor | None] = relationship(back_populates="zones")


class Gate(Base):
    __tablename__ = "gates"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    venue_id: Mapped[int] = mapped_column(ForeignKey("venues.id", ondelete="CASCADE"), index=True)
    zone_id: Mapped[int | None] = mapped_column(ForeignKey("zones.id", ondelete="SET NULL"), nullable=True)
    floor_id: Mapped[int | None] = mapped_column(ForeignKey("floors.id", ondelete="SET NULL"), nullable=True)
    name: Mapped[str] = mapped_column(String(80), index=True)
    status: Mapped[str] = mapped_column(String(20), default="open", index=True)

    venue: Mapped[Venue] = relationship(back_populates="gates")


class Section(Base):
    __tablename__ = "sections"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    venue_id: Mapped[int] = mapped_column(ForeignKey("venues.id", ondelete="CASCADE"), index=True)
    zone_id: Mapped[int | None] = mapped_column(ForeignKey("zones.id", ondelete="SET NULL"), nullable=True)
    floor_id: Mapped[int | None] = mapped_column(ForeignKey("floors.id", ondelete="SET NULL"), nullable=True)
    name: Mapped[str] = mapped_column(String(80), index=True)

    venue: Mapped[Venue] = relationship(back_populates="sections")


class Stand(Base):
    __tablename__ = "stands"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    venue_id: Mapped[int] = mapped_column(ForeignKey("venues.id", ondelete="CASCADE"), index=True)
    floor_id: Mapped[int | None] = mapped_column(ForeignKey("floors.id", ondelete="SET NULL"), nullable=True)
    zone_id: Mapped[int | None] = mapped_column(ForeignKey("zones.id", ondelete="SET NULL"), nullable=True)
    name: Mapped[str] = mapped_column(String(120), index=True)
    avg_service_time_seconds: Mapped[int] = mapped_column(Integer, default=90)

    venue: Mapped[Venue] = relationship(back_populates="stands")


class Restroom(Base):
    __tablename__ = "restrooms"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    venue_id: Mapped[int] = mapped_column(ForeignKey("venues.id", ondelete="CASCADE"), index=True)
    floor_id: Mapped[int | None] = mapped_column(ForeignKey("floors.id", ondelete="SET NULL"), nullable=True)
    zone_id: Mapped[int | None] = mapped_column(ForeignKey("zones.id", ondelete="SET NULL"), nullable=True)
    name: Mapped[str] = mapped_column(String(120), index=True)
    status: Mapped[str] = mapped_column(String(20), default="open", index=True)

    venue: Mapped[Venue] = relationship(back_populates="restrooms")
