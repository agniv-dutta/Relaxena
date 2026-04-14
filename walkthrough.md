# Relaxena Frontend Walkthrough

I have successfully built the complete, responsive frontend for **Relaxena** using Next.js 14, TypeScript, and shadcn/ui. The design adheres strictly to the provided high-fidelity images, featuring a premium dark theme with glassmorphism and vibrant accent colors.

## Key Features Implemented

### 1. Dashboard (`/dashboard`)
- **EventBanner**: A cinematic live match display featuring team logos, current score, and a "LIVE" indicator.
- **CrowdDensityCard**: Real-time location tracking with a stylized density progress bar.
- **QuickActions**: A grid of tactile action buttons for rapid navigation.
- **Stadium Explorer**: A visual call-to-action for the interactive map.

### 2. Interactive Map (`/map`)
- **SVG Venue Map**: A custom-built, stylized SVG representation of the stadium with interactive zones.
- **Zone Overlays**: Color-coded zones (Green/Yellow/Red) that change based on live density data.
- **ZoneInfoPopover**: Dynamic popover showing exact density %, status badges, and suggested faster routes.

### 3. Smart Queue Manager (`/queue`)
- **ActiveQueueCard**: A prominent, gradient-rich card showing the user's current queue position and an estimated countdown.
- **Service Catalog**: A list of nearby points of interest (concessions, restrooms) with wait-time badges.
- **Filtering**: Quick tabs to filter between different types of services.

### 4. Navigation (`/navigate`)
- **DirectionList**: Step-by-step route guidance with a prominent "Next Step" card.
- **Avoid Crowds**: A persistent toggle that wires into the pathfinding logic.
- **Visual Path**: A stylized background SVG illustrating the suggested route away from congested zones.

### 5. Alerts Center (`/alerts`)
- **Notification Feed**: Real-time alerts categorized by type (Staff, Queue, Crowd, Info).
- **Severity Styling**: Distinct visual styles for critical surges vs. general info.
- **Actionable Alerts**: Support for "Go Now" and "See Alternate Route" buttons within notifications.

## Technical Foundation

- **Next.js 14 App Router**: Modern file-based routing and server/client component optimization.
- **AuthContext**: persistent JWT-based authentication with mock fallback for immediate testing.
- **API Client**: Axios instance with automated auth header injection and interceptors.
- **WebSockets**: Custom `useWebSocket` hook for real-time crowd and alert feeds.
- **Theming**: Strict adherence to the `Zinc-950` dark theme with `Blue-500` and `Pink-500` accents.

## How to Run

1. Navigate to the `frontend` directory.
2. Run `npm install` (if not already done).
3. Run `npm run dev`.
4. Access the dashboard at `http://localhost:3000`.

> [!TIP]
> Use the "BottomNav" on mobile devices to experience the full responsive layout. The floating glass effect is optimized for high-end mobile browsers.
