# Relaxena Frontend

React (Next.js 16) web application for venue operations intelligence and AI-powered venue assistant.

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup & Run

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Copy environment template
cp .env.example .env.local

# 3. Install dependencies
npm install

# 4. Start development server
npm run dev
```

**Frontend**: http://localhost:3000

---

## Environment Configuration

Copy `.env.example` to `.env.local` and customize:

```bash
cp .env.example .env.local
```

### Key Settings

| Setting | Default | Purpose |
|---------|---------|---------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | Backend API endpoint |
| `NEXT_PUBLIC_WS_URL` | `ws://localhost:8000` | WebSocket endpoint |
| `NEXT_PUBLIC_DEFAULT_VENUE_ID` | `1` | Default venue for UI |

### Example `.env.local` (Local Development)

```bash
# Backend API endpoints
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000

# Default venue
NEXT_PUBLIC_DEFAULT_VENUE_ID=1
```

### Example `.env.local` (Production)

```bash
# Production backend
NEXT_PUBLIC_API_URL=https://api.relaxena.com
NEXT_PUBLIC_WS_URL=wss://api.relaxena.com

# Default venue
NEXT_PUBLIC_DEFAULT_VENUE_ID=1
```

---

## Available Scripts

```bash
# Development server (hot reload)
npm run dev

# Production build
npm build

# Run production build locally
npm run start

# Run linter
npm run lint
```

---

## Architecture

### Pages

- `/` — Dashboard (crowd, queue, alerts overview)
- `/login` — Authentication
- `/venues` — Venue selection
- `/admin` — Staff control panel (incident reporting, alerts)

### Key Components

- **CrowdDisplay**: Real-time crowd density visualization
- **QueueManager**: Virtual queue position tracker
- **AlertPanel**: Live alert stream with color-coding
- **AIChat**: Streaming chat with venue assistant
- **RouteMap**: Interactive zone navigation with route suggestions

### State Management

- **React Context**: Authentication state, user preferences
- **React Query** (if configured): Server state caching
- **WebSocket**: Real-time updates (crowd, queue, alerts)

### WebSocket Channels

```javascript
// Connect to crowd updates
const crowdWs = new WebSocket('ws://localhost:8000/ws/crowd/1');

// Connect to queue updates
const queueWs = new WebSocket('ws://localhost:8000/ws/queue/1');

// Connect to alert stream
const alertsWs = new WebSocket('ws://localhost:8000/ws/alerts/1');
```

---

## Features

### 1. **Authentication**
- Login/Register flow
- JWT token storage
- Protected routes

### 2. **Crowd Monitoring Dashboard**
- Real-time density per zone
- Density trend graph (15-30-60 min)
- Alert threshold indicator

### 3. **Queue Management**
- Join virtual queue
- Live position tracking
- ETA countdown
- Queue history

### 4. **Alert Notification Center**
- Real-time alert stream
- Color-coded severity (red=critical, orange=warning)
- Action buttons (acknowledge, escalate)

### 5. **Staff Control Panel**
- Report incidents
- Broadcast alerts
- View active incidents
- Analytics dashboard

### 6. **✨ AI Venue Assistant** (NEW)

#### Feature 1: Chat Assistant
- Real-time venue context (crowds, wait times, weather)
- Streaming chat responses
- 10-message conversation history
- Venue-aware recommendations

#### Feature 2: Smart Tips
- One-sentence actionable advice
- Least-crowded zone recommendations
- Updated every 2 minutes

#### Feature 3: Crowd Prediction
- 15/30/60 minute density forecasts
- AI-generated narrative explanations
- Trend analysis

#### Feature 4: Personalized Route
- From/To zone navigation
- Avoid crowded paths dynamically
- Estimated walk time
- Accessibility options (mobility, food preferences)

#### Feature 5: Incident Auto-Triage
- Auto-categorize severity
- Suggested immediate steps
- Staff notification integration

#### Feature 6: Post-Event Summary
- Event highlights & metrics
- Identify bottlenecks
- Improvement recommendations
- PDF export-ready markdown

---

## UI Components

Built with:
- **React 19** for UI
- **Tailwind CSS 4** for styling
- **Shadcn UI** for component library
- **Lucide React** for icons
- **Framer Motion** for animations

---

## Testing

### Manual Testing

1. **Signup & Login**
   - Click "Sign Up"
   - Enter email: `test@example.com`
   - Enter password: `TestPass123`
   - Click "Create Account"
   - Verify dashboard loads

2. **Crowd Monitoring**
   - Navigate to dashboard
   - Observe crowd density per zone
   - Watch WebSocket updates in real-time

3. **AI Chat**
   - Open AI Chat panel
   - Type: "What zone has the shortest wait?"
   - Verify streaming response

4. **Incident Reporting** (Staff)
   - Login as staff account
   - Go to "Admin" panel
   - Click "Report Incident"
   - Auto-triage result should appear

---

## Troubleshooting

### Backend connection refused
- **Issue**: `ECONNREFUSED` when loading dashboard
- **Fix**: Ensure backend is running at `http://localhost:8000`
- **Command**: `cd backend && python -m uvicorn app.main:app --reload`

### WebSocket connection failed
- **Issue**: `WebSocket is closed`
- **Fix**: Check `NEXT_PUBLIC_WS_URL` in `.env.local` matches backend
- **Example**: `NEXT_PUBLIC_WS_URL=ws://localhost:8000`

### Styles not loading
- **Issue**: Page is unstyled
- **Fix**: Rebuild Tailwind
- **Command**: `npm run build`

### Authentication token expired
- **Issue**: Redirected to login unexpectedly
- **Fix**: Clear browser cookies and localStorage
- **Command**: `F12 > Console > localStorage.clear()`

---

## Deployment

### Vercel (Recommended for Next.js)

1. Connect GitHub repo to Vercel
2. Set environment variables in Vercel dashboard:
   ```
   NEXT_PUBLIC_API_URL=https://api.relaxena.com
   NEXT_PUBLIC_WS_URL=wss://api.relaxena.com
   NEXT_PUBLIC_DEFAULT_VENUE_ID=1
   ```
3. Deploy automatically on `main` branch push

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]
```

```bash
docker build -t relaxena-frontend .
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=http://backend:8000 \
  -e NEXT_PUBLIC_WS_URL=ws://backend:8000 \
  relaxena-frontend
```

### Production Build

```bash
# Build optimized production bundle
npm run build

# Test production build locally
npm run start
```

---

## Notes

- ✅ No additional setup required beyond Node.js + npm
- ✅ All data fetching via backend API
- ✅ WebSocket auto-reconnect on disconnect
- ✅ Conversation history persisted in localStorage
- ⚠️ For production: enable HTTPS/WSS, set proper CORS headers on backend
- ⚠️ AI features gracefully degrade if Groq API key missing on backend

---

## Documentation

- See `backend/README.md` for API endpoint details
- See root `README.md` for architecture overview and full setup
