# Relaxena Backend

Async FastAPI backend for venue operations intelligence.

## Quickstart

```bash
cp .env.example .env
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload
```

API available at `http://127.0.0.1:8000`

## Architecture

- **FastAPI** async framework for real-time APIs
- **SQLAlchemy 2.0 async ORM** with SQLite default (PostgreSQL for production)
- **WebSockets** for live crowd, queue, and alert streams
- **Groq LLM** for AI-powered venue assistance (optional)
- **In-memory caching** with TTL support

## API Routes

- Auth: `/auth/token`, `/auth/register`
- Venue data: `/api/venues/{id}/layout`, `/api/venues/{id}/conditions`
- Sensors: `/api/sensors/update`
- Incidents: `/api/incidents`
- Queues: `/api/queues/join`
- Alerts: `/api/alerts/publish`
- AI: `/api/ai/chat` (SSE), `/api/ai/predict`
- WebSockets: `/ws/crowd/{venue_id}`, `/ws/queue/{user_id}`, `/ws/alerts/{venue_id}`

## Database

Default uses SQLite (`./relaxena.db`).

To use PostgreSQL, set `DATABASE_URL` in `.env`:
```
DATABASE_URL=postgresql+asyncpg://user:pass@localhost:5432/relaxena
```

## Configuration

See `.env.example` for all available settings. Key ones:
- `GROQ_API_KEY` - for AI features (optional)
- `OPENWEATHER_API_KEY` - for weather enrichment (optional)
- `SPORTSDATA_API_KEY` - for live scores (optional)
