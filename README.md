<h1 align="center">Relaxena</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.11%2B-3776AB?logo=python&logoColor=white" alt="Python 3.11+" />
  <img src="https://img.shields.io/badge/FastAPI-Async-009688?logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Frontend-Next.js%2016-000000?logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/Database-SQLite-003B57?logo=sqlite&logoColor=white" alt="SQLite" />
  <img src="https://img.shields.io/badge/AI-Groq%20LLM-007AFF?logo=openai&logoColor=white" alt="Groq LLM" />
</p>

Production-ready real-time venue operations platform with crowd intelligence, queue orchestration, alerting, and AI assistant capabilities.

## Repository Structure

- Root contains this README, `frontend/`, and `backend/`.
- Backend implementation is encapsulated under `backend/`.

Run all backend setup and runtime commands from inside `backend/`.

## Stack

- **Python 3.11+**
- **FastAPI** (async)
- **SQLAlchemy 2.0** async ORM with SQLite (PostgreSQL ready)
- **WebSockets** for real-time streams
- **Pydantic v2** validation
- **Alembic** migrations
- **Groq LLM** for AI features (optional)
- **httpx** for external API calls

## Features

1. **Crowd Intelligence**
   - Real-time crowd snapshot ingestion
   - Density trend prediction with heuristics
   - Threshold-based alerting
   - WebSocket stream for venue crowd channels

2. **Smart Queue Orchestration**
   - Virtual queue join with live position tracking
   - ETA generation and queue position updates
   - Queue visibility via WebSocket channels

3. **Incident & Alert Command Center
- Incident creation with async AI summary/action plan
- Alert publish endpoint with Redis + WebSocket fan-out
- Severity categorization and escalation fields

4. Venue operations intelligence
- Venue layout endpoint with GeoJSON zones
- Venue condition endpoint with weather signal enrichment
- Live sports score polling and cache

5. Security and roles
- OAuth2 password flow
- JWT access tokens
- Role-based access control (`attendee`, `staff`, `admin`)

6. Real-time channels
- `WS /ws/crowd/{venue_id}`
- `WS /ws/queue/{user_id}`
- `WS /ws/alerts/{venue_id}`

## Folder Layout

```
app/
  api/routers/
  core/
  db/
  models/
  routers/
  schemas/
  services/
  tasks/
alembic/
scripts/
postman/
nginx/
```

## Architecture Flow

1. Sensors and app clients send crowd/queue/incident events to FastAPI.
2. FastAPI persists state in SQLite/MySQL and pushes messages to Redis.
3. WebSocket manager broadcasts crowd, queue, and alert channels to clients.
4. Celery worker/beat process predictive and optimization jobs.
5. Nginx fronts the API in containerized deployments.

## Quick Start (Local SQLite)

1. Create env file:

```bash
cd backend
cp .env.example .env
```

2. Create virtual environment and install dependencies:

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

3. Run migrations:

```bash
alembic upgrade head
```

4. Start API:

```bash
uvicorn app.main:app --reload
```

5. Seed demo data (optional):

```bash
python -m scripts.seed_demo
```

6. Run frontend (in a separate terminal):

```bash
cd ..\frontend
cp .env.example .env.local
npm install
npm run dev
```

Open http://localhost:3000.

## Dummy Login Credentials

Use these seeded credentials for demo/testing:

- Email: admin@relaxena.com
- Password: Admin@12345

## Environment Configuration

Copy `.env.example` to `.env` and customize:

```bash
cp backend/.env.example backend/.env
```

Key settings:
- `GROQ_API_KEY` — Get from https://console.groq.com (optional for AI features)
- `OPENWEATHER_API_KEY` — Optional for weather enrichment
- `SPORTSDATA_API_KEY` — Optional for live sports scores
- `DATABASE_URL` — Leave blank for SQLite, or set to PostgreSQL for production

## Migrations

Migrations include:
- `20260414_0001_initial_schema.py`
- `20260414_0002_arenaflow_expansion.py`

Run migrations:

```bash
cd backend
alembic upgrade head
```

Create new migration:

```bash
alembic revision --autogenerate -m "describe change"
```

## Key API Endpoints

### Auth
- `POST /auth/register` — Sign up
- `POST /auth/token` — Log in
- `GET /auth/me` — Current user

### Venue Data
- `GET /api/venues/{venue_id}/layout` — Zone layout and capacity
- `GET /api/venues/{venue_id}/conditions` — Weather and crowd score

### Crowd & Sensors
- `POST /api/sensors/update` — Report crowd count changes
- `GET /api/ai/predict?venue_id={id}` — Density predictions

### Queues
- `POST /api/queues/join` — Join virtual queue
- `WS /ws/queue/{user_id}` — Queue position updates

### Incidents & Alerts
- `POST /api/incidents` — Report incident
- `POST /api/alerts/publish` — Broadcast alert
- `WS /ws/alerts/{venue_id}` — Alert stream

### AI Assistant
- `POST /api/ai/chat` — Server-sent events chat stream
- `GET /api/ai/predict?venue_id={id}` — Crowd prediction

### WebSocket Channels
- `/ws/crowd/{venue_id}` — Real-time crowd updates
- `/ws/queue/{user_id}` — Queue position notifications
- `/ws/alerts/{venue_id}` — Safety and operational alerts

## Notes

- SQLite is the default local database for development
- PostgreSQL ready via `DATABASE_URL` environment variable
- No external infrastructure required (no Redis, Docker, or Celery)
- All external API calls (Groq, OpenWeather, etc.) are optional
- For production: rotate secrets, enable HTTPS, customize CORS origins
