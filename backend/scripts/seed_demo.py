import asyncio
from datetime import datetime, timedelta, timezone

from sqlalchemy import select

from app.core.security import hash_password
from app.db.session import AsyncSessionLocal, init_db_if_enabled
from app.models.event import Event
from app.models.queue import QueueType, WaitTimeLog
from app.models.ticket import Ticket
from app.models.user import NotificationPreference, User, UserRole
from app.models.venue import Gate, Section, Venue, Zone


async def seed() -> None:
    await init_db_if_enabled()

    async with AsyncSessionLocal() as session:
        exists = await session.execute(select(Venue).where(Venue.name == "Relaxena Arena"))
        if exists.scalar_one_or_none() is not None:
            print("Seed data already exists.")
            return

        venue = Venue(name="Relaxena Arena", city="Bengaluru", capacity=50000)
        session.add(venue)
        await session.flush()

        zone_north = Zone(venue_id=venue.id, name="North Concourse")
        zone_south = Zone(venue_id=venue.id, name="South Concourse")
        session.add_all([zone_north, zone_south])
        await session.flush()

        session.add_all(
            [
                Gate(venue_id=venue.id, zone_id=zone_north.id, name="Gate A"),
                Gate(venue_id=venue.id, zone_id=zone_south.id, name="Gate B"),
                Section(venue_id=venue.id, zone_id=zone_north.id, name="N-101"),
                Section(venue_id=venue.id, zone_id=zone_south.id, name="S-201"),
            ]
        )

        event = Event(
            venue_id=venue.id,
            name="Championship Final",
            start_time=datetime.now(timezone.utc) + timedelta(days=2),
            end_time=datetime.now(timezone.utc) + timedelta(days=2, hours=3),
            home_team="Relaxena FC",
            away_team="City Rivals",
        )
        session.add(event)
        await session.flush()

        ticket = Ticket(event_id=event.id, seat_label="N-101-22", qr_code="QR-RELAXENA-0001")
        session.add(ticket)
        await session.flush()

        admin = User(
            email="admin@relaxena.com",
            full_name="Venue Admin",
            hashed_password=hash_password("Admin@12345"),
            role=UserRole.admin,
            ticket_id=ticket.id,
            seat_label="N-101-22",
        )
        session.add(admin)
        await session.flush()

        session.add(NotificationPreference(user_id=admin.id, push_enabled=True, sms_enabled=False, email_enabled=True))

        session.add_all(
            [
                WaitTimeLog(
                    venue_id=venue.id,
                    queue_type=QueueType.concession,
                    resource_id="concession-a",
                    avg_wait_minutes=4.5,
                ),
                WaitTimeLog(
                    venue_id=venue.id,
                    queue_type=QueueType.concession,
                    resource_id="concession-b",
                    avg_wait_minutes=7.0,
                ),
            ]
        )

        await session.commit()
        print("Seed data inserted successfully.")


if __name__ == "__main__":
    asyncio.run(seed())
