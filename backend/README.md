# Relaxena Backend

Async FastAPI backend for venue operations intelligence with AI-powered assistance.

## Quick Start

### Prerequisites
- Python 3.11+
- Virtual environment (recommended)

### Setup & Run

```bash
# 1. Navigate to backend directory
cd backend

# 2. Copy environment template
cp .env.example .env

# 3. Create virtual environment
python -m venv .venv

# 4. Activate virtual environment
# On Windows:
.venv\Scripts\activate
# On macOS/Linux:
source .venv/bin/activate

# 5. Install dependencies
pip install -r requirements.txt

# 6. Initialize database
python -m alembic upgrade head

# 7. Start server
python -m uvicorn app.main:app --reload
```

**Server**: http://127.0.0.1:8000  
**API Docs**: http://127.0.0.1:8000/docs

---

## Architecture

- **FastAPI** async framework for real-time APIs
- **SQLAlchemy 2.0 async ORM** with SQLite default (PostgreSQL for production)
- **WebSockets** for live crowd, queue, and alert streams
- **Groq LLM** for AI-powered venue assistance (optional)
- **In-memory caching** with TTL support
- **No external dependencies**: no Redis, Celery, Docker, or Nginx required

---

## API Routes

### Authentication
- `POST /auth/register` — Create account
- `POST /auth/token` — Login (returns JWT)
- `GET /auth/me` — Current user info

### Venue Data
- `GET /api/venues/{id}/layout` — Zone layout + GeoJSON
- `GET /api/venues/{id}/conditions` — Weather + crowd score

### Crowd & Sensors
- `POST /api/sensors/update` — Report crowd density
- `GET /api/ai/predict?venue_id={id}` — Crowd prediction + narrative

### Queues
- `POST /api/queues/join` — Join virtual queue
- `WS /ws/queue/{user_id}` — Queue position updates

### Incidents & Alerts
- `POST /api/incidents` — Report incident
- `POST /api/alerts/publish` — Broadcast alert
- `WS /ws/alerts/{venue_id}` — Alert stream

### **NEW: AI Assistant (6 Features)**
- `POST /api/ai/chat` — Streaming chat with venue context (SSE)
- `GET /api/ai/tip?venue_id={id}` — Smart venue tip
- `GET /api/ai/predict?venue_id={id}` — Crowd prediction with Groq narrative
- `POST /api/ai/route` — Personalized route suggestion
- `POST /api/ai/triage-incident` — Auto-classify incident severity
- `POST /api/ai/event-summary` — Post-event markdown report

### WebSocket Channels
- `/ws/crowd/{venue_id}` — Real-time crowd updates
- `/ws/queue/{user_id}` — Queue position notifications
- `/ws/alerts/{venue_id}` — Safety and operational alerts

---

## AI Assistant Features

### 1. **Streaming Chat Assistant** 
`POST /api/ai/chat`

Stream responses with live venue context (density, wait times, weather).

```bash
curl -N -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "What zone has the shortest wait?",
    "venue_id": 1,
    "user_id": 1
  }' \
  http://localhost:8000/api/ai/chat
```

### 2. **Smart Venue Tips**
`GET /api/ai/tip?venue_id=1`

One-sentence actionable tip. Cached 2 minutes per venue.

```bash
curl -H "Authorization: Bearer <token>" \
  "http://localhost:8000/api/ai/tip?venue_id=1"
```

### 3. **Crowd Prediction with Narrative**
`GET /api/ai/predict?venue_id=1`

Heuristic predictions + AI-generated English explanation. Cached 5 minutes.

```bash
curl -H "Authorization: Bearer <token>" \
  "http://localhost:8000/api/ai/predict?venue_id=1"
```

### 4. **Personalized Route Suggestion**
`POST /api/ai/route`

Step-by-step navigation avoiding crowded zones.

```bash
curl -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "from_zone": 1,
    "to_zone": 5,
    "user_preferences": {"mobility": "normal", "food_pref": "vegetarian"},
    "venue_id": 1
  }' \
  http://localhost:8000/api/ai/route
```

### 5. **Incident Auto-Triage**
`POST /api/ai/triage-incident`

Auto-classify severity (1-10), category, and suggested steps.

```bash
curl -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Person fell near Section B",
    "venue_id": 1,
    "zone_id": 2
  }' \
  http://localhost:8000/api/ai/triage-incident
```

### 6. **Post-Event Summary**
`POST /api/ai/event-summary`

Markdown report with highlights, bottlenecks, improvements.

```bash
curl -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "venue_id": 1,
    "event_analytics": {
      "peak_density": 0.92,
      "peak_time": "2026-04-20T19:30:00Z",
      "total_incidents": 3,
      "avg_queue_wait": 12
    }
  }' \
  http://localhost:8000/api/ai/event-summary
```

---

## Database

**Default**: SQLite (`./relaxena.db`)  
**Production**: PostgreSQL

### Switch to PostgreSQL

Edit `.env`:
```
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/relaxena
```

Then run migrations:
```bash
python -m alembic upgrade head
```

### Create New Migration

```bash
python -m alembic revision --autogenerate -m "describe your change"
python -m alembic upgrade head
```

---

## Configuration

Copy `.env.example` to `.env` and customize:

```bash
cp .env.example .env
```

### Key Settings

| Setting | Required | Purpose |
|---------|----------|---------|
| `GROQ_API_KEY` | Optional | Groq LLM for AI features. Get from https://console.groq.com |
| `GROQ_MODEL` | No | Primary model (default: `llama3-70b-8192`) |
| `GROQ_FALLBACK_MODEL` | No | Fallback model (default: `mixtral-8x7b-32768`) |
| `OPENWEATHER_API_KEY` | Optional | Weather enrichment for venue conditions |
| `SPORTSDATA_API_KEY` | Optional | Live sports scores |
| `DATABASE_URL` | No | Leave blank for SQLite, or set PostgreSQL connection string |
| `SECRET_KEY` | Yes | Change for production |
| `JWT_SECRET_KEY` | Yes | Change for production |

---

## Testing

### Health Check
```bash
curl http://localhost:8000/health
```

### WebSocket Test (ping/pong)
```bash
# Using websocat or similar
websocat ws://localhost:8000/ws/crowd/1
# Send: ping
# Receive: pong
```

### Example: Create User & Login
```bash
# Register
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"SecurePass123"}'

# Login
curl -X POST http://localhost:8000/auth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=user@example.com&password=SecurePass123"
```

---

## Notes

- ✅ No Redis, Celery, Docker, or Nginx needed
- ✅ All external APIs (Groq, OpenWeather, SportsData) are optional
- ✅ Conversation history stored in-memory (lost on restart—add DB persistence for production)
- ✅ Rate limiting removed (can re-add per route if needed)
- ⚠️ For production: rotate secrets, enable HTTPS, whitelist CORS origins

