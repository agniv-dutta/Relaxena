# Relaxena Backend

Production-grade backend scaffold for a real-time physical event experience platform for large sporting venues.

## Stack

- Python 3.11+
- FastAPI (async)
- SQLAlchemy 2.0 async ORM
- SQLite (default, zero remote setup)
- Redis (pub/sub + cache/event streaming)
- Celery (background tasks)
- WebSockets (live crowd updates)
- Pydantic v2
- Alembic migrations
- Docker + docker-compose

## Modules Included

1. Crowd movement engine
- Real-time crowd snapshot ingestion
- Heatmap API
- Threshold-based crowd alerting
- WebSocket: `/ws/crowd/{venue_id}`

2. Smart queue management
- Join/leave virtual queues
- Position and ETA tracking
- Rebalancing recommendation endpoint

3. Real-time coordination
- Staff alerts via Redis pub/sub
- Incident reporting and escalation
- Admin dashboard summary stats

4. Attendee experience APIs
- Navigation suggestion to seat
- Low-wait concession recommendation
- Event schedule + live score stubs
- Notification preference management

5. Auth and users
- OAuth2 password flow
- JWT access tokens
- Role-based access control (`attendee`, `staff`, `admin`)

## Folder Layout

```
app/
  core/
  db/
  models/
  routers/
  schemas/
  services/
  tasks/
alembic/
scripts/
```

## Quick Start (Local)

1. Create env file:

```bash
cp .env.example .env
```

2. Create virtual environment and install dependencies:

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

3. Run API:

```bash
uvicorn app.main:app --reload
```

4. Run Celery worker (separate terminal):

```bash
celery -A app.core.celery_app.celery_app worker --loglevel=info
```

5. Seed demo data:

```bash
python -m scripts.seed_demo
```

## Docker

```bash
docker-compose up --build
```

Services:
- API: `http://localhost:8000`
- Redis: `localhost:6379`

## Migrations

Initial migration exists in `alembic/versions/20260414_0001_initial_schema.py`.

Run migrations:

```bash
alembic upgrade head
```

Create new migration:

```bash
alembic revision --autogenerate -m "describe change"
```

## Important Endpoints

### Auth
- `POST /auth/register`
- `POST /auth/token`
- `GET /auth/me`

### Crowd
- `POST /crowd/snapshot`
- `GET /crowd/heatmap/{venue_id}`
- `WS /ws/crowd/{venue_id}`

### Queue
- `POST /queue/join`
- `POST /queue/leave/{ticket_id}`
- `GET /queue/status/{ticket_id}`
- `GET /queue/rebalance/{venue_id}`

### Coordination
- `POST /coordination/alerts`
- `POST /coordination/incidents`
- `GET /coordination/dashboard/{venue_id}`

### Attendee
- `GET /attendee/navigation/seat`
- `GET /attendee/concession/recommendation/{venue_id}`
- `GET /attendee/events/{venue_id}/schedule`
- `GET /attendee/events/{event_id}/live-score`

### User Preferences
- `GET /users/me`
- `GET /users/me/notifications`
- `PUT /users/me/notifications`

## Notes

- SQLite is the default to avoid external DB setup.
- If you prefer MySQL later, update `sqlalchemy_database_uri` logic in `app/core/config.py` and set env vars for your MySQL DSN.
- For production, rotate `SECRET_KEY`, enforce TLS, and tune Celery/Redis settings.
