<h1 align="center">Relaxena</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.11%2B-3776AB?logo=python&logoColor=white" alt="Python 3.11+" />
  <img src="https://img.shields.io/badge/FastAPI-Async-009688?logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Frontend-Next.js%2016-000000?logo=nextdotjs&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/Database-SQLite-003B57?logo=sqlite&logoColor=white" alt="SQLite" />
  <img src="https://img.shields.io/badge/AI-Groq%20LLM-007AFF?logo=openai&logoColor=white" alt="Groq LLM" />
</p>

Production-ready real-time venue operations platform with crowd intelligence, queue orchestration, alerting, and **AI-powered venue assistant** capabilities.

---

## 📋 Repository Structure

```
Relaxena/
├── backend/           # FastAPI async server
├── frontend/          # Next.js 16 React app
├── README.md          # This file
└── .gitignore
```

---

## 🚀 Quick Start (Local Development)

### **Backend** (Terminal 1)

```bash
# Navigate to backend
cd backend

# Copy environment template
cp .env.example .env

# Create virtual environment
python -m venv .venv

# Activate (Windows)
.venv\Scripts\activate
# Or macOS/Linux:
# source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Initialize database
python -m alembic upgrade head

# Start server
python -m uvicorn app.main:app --reload
```

**Backend ready at**: http://127.0.0.1:8000

---

### **Frontend** (Terminal 2)

```bash
# Navigate to frontend
cd frontend

# Copy environment template
cp .env.example .env.local

# Install dependencies
npm install

# Start dev server
npm run dev
```

**Frontend ready at**: http://localhost:3000

---

## 🎯 Features

### 1. **Crowd Intelligence**
- Real-time density snapshot ingestion
- Heuristic + AI-powered density prediction
- Threshold-based alerting (>0.85 density)
- WebSocket stream: `/ws/crowd/{venue_id}`

### 2. **Smart Queue Orchestration**
- Virtual queue join with live position tracking
- Dynamic ETA calculation
- Queue visibility via WebSocket: `/ws/queue/{user_id}`

### 3. **Incident & Alert Command**
- Staff incident reporting with AI auto-triage
- Alert broadcasting with WebSocket fan-out: `/ws/alerts/{venue_id}`
- Severity categorization and escalation

### 4. **Venue Operations Intelligence**
- Venue layout endpoint with GeoJSON zones
- Venue condition endpoint with weather enrichment
- Live sports score polling and caching

### 5. **Security & RBAC**
- OAuth2 + JWT authentication
- Role-based access: `attendee`, `staff`, `admin`
- Password hashing with bcrypt

### 6. **✨ AI-Powered Venue Assistant** (NEW — 6 Features)

#### 1️⃣ **Streaming Chat Assistant**
`POST /api/ai/chat`
- Real-time chat with enriched venue context
- Crowd densities, wait times, zone recommendations
- Server-Sent Events (SSE) streaming
- 10-message conversation history per user

#### 2️⃣ **Smart Venue Tips**
`GET /api/ai/tip?venue_id={id}`
- One-sentence actionable recommendation
- Based on crowded vs. low-wait zones
- Cached 2 minutes per venue

#### 3️⃣ **Crowd Prediction Narrative**
`GET /api/ai/predict?venue_id={id}`
- Heuristic density predictions + AI narrative
- 15-30-60 min trend explanations
- Cached 5 minutes

#### 4️⃣ **Personalized Route Suggestion**
`POST /api/ai/route`
- Step-by-step navigation
- Avoid high-density zones dynamically
- Respects user mobility/food preferences

#### 5️⃣ **Incident Auto-Triage**
`POST /api/ai/triage-incident`
- Auto-classify severity (1-10)
- Category: medical | crowd | technical | security
- Suggest immediate steps

#### 6️⃣ **Post-Event Summary**
`POST /api/ai/event-summary`
- Markdown report with highlights
- Identify bottlenecks & improvement areas
- Download-ready PDF export

---

## 🔌 Tech Stack

### Backend
- **Python 3.11+**
- **FastAPI** (async)
- **SQLAlchemy 2.0** async ORM
- **Groq LLM** for AI (optional — llama3-70b-8192)
- **WebSockets** (FastAPI native)
- **Alembic** (migrations)
- **Pydantic v2** (validation)
- **SQLite** (default) / **PostgreSQL** (production-ready)

### Frontend
- **Next.js 16** (React)
- **TypeScript**
- **Tailwind CSS** / **Shadcn UI**
- **React Query** (data fetching)
- **WebSocket** (real-time updates)

### Infrastructure
- ✅ **No Redis**, Celery, Docker, or Nginx required
- ✅ In-memory caching with TTL
- ✅ All external APIs optional (Groq, OpenWeather, SportsData)

---

## 📁 Key Folders

```
backend/
  app/
    api/routers/          # API endpoints (auth, venues, ai, etc.)
    services/             # Business logic (ai_service, crowd_service, etc.)
    core/                 # Config, cache, websocket manager
    models/               # SQLAlchemy ORM models
    schemas/              # Pydantic request/response models
    db/                   # Database session
  alembic/                # Schema migrations
  requirements.txt        # Python dependencies
  .env.example           # Environment template

frontend/
  app/                    # Next.js pages & layouts
  components/             # React components
  lib/                    # Utilities & API client
  hooks/                  # React hooks
  context/                # React context state
  package.json           # Node dependencies
  .env.example           # Environment template
```

---

## 🌍 Environment Configuration

### Backend (`.env`)

```bash
# Required
APP_NAME=Relaxena
SECRET_KEY=change-in-production
JWT_SECRET_KEY=change-in-production

# Optional: AI Features
GROQ_API_KEY=your-groq-api-key        # Get from https://console.groq.com
GROQ_MODEL=llama3-70b-8192            # Primary model
GROQ_FALLBACK_MODEL=mixtral-8x7b-32768 # Fallback

# Optional: External APIs
OPENWEATHER_API_KEY=
SPORTSDATA_API_KEY=

# Optional: Database (leave empty for SQLite)
DATABASE_URL=

# Optional: Frontend
CORS_ORIGINS=http://localhost:3000
```

### Frontend (`.env.local`)

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
```

---

## 🔐 Demo Credentials

If you seed the database:

```bash
cd backend
python -m scripts.seed_demo
```

Use these to test:
- **Email**: admin@relaxena.com
- **Password**: Admin@12345

---

## 📊 API Examples

### 1. Register & Login

```bash
# Register
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123"
  }'

# Login (returns access_token)
curl -X POST http://localhost:8000/auth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=user@example.com&password=SecurePass123"
```

### 2. AI Chat Stream

```bash
TOKEN="<your-jwt-token>"

curl -N -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Where should I go to avoid crowds?",
    "venue_id": 1,
    "user_id": 1
  }' \
  http://localhost:8000/api/ai/chat
```

### 3. Get Smart Tip

```bash
TOKEN="<your-jwt-token>"

curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8000/api/ai/tip?venue_id=1"
```

### 4. Crowd Prediction with Narrative

```bash
TOKEN="<your-jwt-token>"

curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8000/api/ai/predict?venue_id=1"
```

### 5. Auto-Triage Incident

```bash
TOKEN="<your-jwt-token>"

curl -X POST http://localhost:8000/api/ai/triage-incident \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Person fell near entrance",
    "venue_id": 1,
    "zone_id": 2
  }'
```

---

## 🗄️ Database Migrations

### Initialize (Fresh DB)

```bash
cd backend
python -m alembic upgrade head
```

### Create New Migration

```bash
python -m alembic revision --autogenerate -m "describe change"
python -m alembic upgrade head
```

### Switch to PostgreSQL

Edit `backend/.env`:
```
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/relaxena
```

Then run:
```bash
python -m alembic upgrade head
```

---

## 🧪 Testing

### Health Check

```bash
curl http://localhost:8000/health
```

### API Documentation

```
http://localhost:8000/docs              # Swagger UI
http://localhost:8000/redoc             # ReDoc
```

### WebSocket Test (Crowd Channel)

```bash
# Using websocat (https://github.com/vi/websocat)
websocat ws://localhost:8000/ws/crowd/1

# Send: ping
# Receive: pong
```

---

## 📝 Notes

- ✅ **No external services needed** for local dev (SQLite, in-memory cache)
- ✅ **Optional Groq API key** for AI features (heuristics work without it)
- ✅ **Conversation history** is in-memory (add DB persistence for production)
- ✅ **WebSocket ping/pong** keeps connections alive (30s timeout)
- ⚠️ **For production**: rotate SECRET_KEY, enable HTTPS, whitelist CORS origins

---

## 📚 Documentation

- Backend API: See `backend/README.md` for detailed endpoints, schema, and configuration
- Frontend: See `frontend/.env.example` for env vars

---

## 🎓 Architecture

1. User opens frontend (Next.js) at http://localhost:3000
2. Frontend authenticates with backend JWT
3. Backend persists data in SQLite/PostgreSQL
4. Real-time updates via WebSockets (`/ws/crowd/`, `/ws/queue/`, `/ws/alerts/`)
5. AI requests use Groq LLM (optional, fallback to heuristics)
6. In-memory cache stores tips, predictions, event summaries

---

## 💡 Key Highlights

| Feature | Status | Notes |
|---------|--------|-------|
| **Crowd Intelligence** | ✅ Live | Real-time density + AI prediction |
| **Queue Orchestration** | ✅ Live | Virtual queue with ETA |
| **AI Assistant** | ✅ NEW | 6 features (chat, tips, routing, triage, summary) |
| **WebSocket Streams** | ✅ Live | Crowd, queue, alerts channels |
| **RBAC** | ✅ Live | Attendee, staff, admin roles |
| **Migrations** | ✅ Live | Alembic schema versioning |
| **Local SQLite** | ✅ Default | PostgreSQL ready via env var |
| **Docker** | ❌ Not required | Works locally with just Python + Node |
| **Redis/Celery** | ❌ Removed | Replaced with in-memory + asyncio |

---

**Ready to go!** 🚀

