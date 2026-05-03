# 🟦 BLIX — Frontend, Floor Plan & Geographic Map

> **Responsible:** Karen — Frontend · Sweet Home 3D · Geographic Map · Deploy
> **Stack:** React · TypeScript · Vite · Tailwind CSS · Socket.io-client · Vercel

---

## 📐 Architecture Overview

The frontend is a **Progressive Web App (PWA)** — no installation required. Users open the URL on any device and get full functionality. The app communicates with the backend via REST API (for actions) and WebSockets (for real-time map updates).

```
Browser / Mobile
      │
      ├── REST API (Axios)    → Backend Express server
      └── WebSocket (Socket.io-client) → Real-time table states
```

---

## 📁 Folder Structure & Responsibilities

```
Frontend/
├── public/
│   ├── manifest.json         # PWA manifest (name, icons, theme color)
│   └── icons/                # App icons for home screen install
│
├── src/
│   ├── @types/               # TypeScript global type definitions
│   │   ├── table.types.ts    # TableState enum, Table interface
│   │   ├── reservation.types.ts
│   │   └── user.types.ts
│   │
│   ├── api/                  # All HTTP calls — nothing else
│   │   ├── auth.api.ts       # register, login, verify, me
│   │   ├── table.api.ts      # getTables, getTable
│   │   ├── reservation.api.ts# create, list, cancel
│   │   ├── checkin.api.ts    # postCheckin
│   │   └── extension.api.ts  # requestExtension
│   │
│   ├── assets/               # Logos, images, SVG icons
│   │
│   ├── components/
│   │   ├── layout/           # Page-level wrappers
│   │   │   ├── AppLayout.tsx     # Main shell with nav
│   │   │   ├── AuthLayout.tsx    # Centered card for login/register
│   │   │   └── AdminLayout.tsx   # Admin panel shell with sidebar
│   │   │
│   │   └── ui/               # Reusable components (atomic)
│   │       ├── TableCard.tsx     # Single table on the map
│   │       ├── StatusBadge.tsx   # Color indicator per state
│   │       ├── Timer.tsx         # Live countdown for occupied tables
│   │       ├── MapGrid.tsx       # Renders the full food court layout
│   │       ├── FilterBar.tsx     # Filter by table size (×2, ×4, ×6)
│   │       ├── Modal.tsx         # Generic modal wrapper
│   │       ├── Button.tsx        # Styled button component
│   │       ├── Input.tsx         # Styled input component
│   │       └── Toast.tsx         # Success/error notifications
│   │
│   ├── constants/            # Fixed values used across the app
│   │   ├── tableStates.ts    # State → color + label mapping
│   │   ├── durations.ts      # [30, 45, 60] minutes options
│   │   └── routes.ts         # All frontend route strings
│   │
│   ├── context/              # Global state — React Context
│   │   ├── AuthContext.tsx   # user, token, login(), logout()
│   │   └── SocketContext.tsx # Socket.io connection, table events
│   │
│   ├── hooks/                # Custom React hooks
│   │   ├── useAuth.ts        # Consumes AuthContext
│   │   ├── useSocket.ts      # Consumes SocketContext
│   │   ├── useTables.ts      # Fetches + subscribes to table states
│   │   ├── useReservations.ts# User's reservations list
│   │   └── useTimer.ts       # Countdown logic per table
│   │
│   ├── pages/                # One file per route
│   │   ├── Home.tsx          # Map view (visitor + user)
│   │   ├── Login.tsx         # Login form
│   │   ├── Register.tsx      # Register form
│   │   ├── Verify.tsx        # Email verification landing
│   │   ├── Reserve.tsx       # Select time + confirm reservation
│   │   ├── CheckIn.tsx       # QR landing + code entry
│   │   ├── MyReservations.tsx# List of user's reservations + extend
│   │   └── admin/
│   │       ├── Dashboard.tsx # Admin overview
│   │       ├── Conflicts.tsx # Active conflicts list
│   │       └── Metrics.tsx   # Usage statistics
│   │
│   ├── routes/               # React Router v6 configuration
│   │   ├── AppRouter.tsx     # All route definitions
│   │   ├── ProtectedRoute.tsx# Redirects to login if no session
│   │   └── AdminRoute.tsx    # Redirects if not admin role
│   │
│   ├── utils/                # Frontend utility functions
│   │   ├── formatTime.ts     # "18 min remaining" formatting
│   │   └── getStateColor.ts  # State → Tailwind class mapping
│   │
│   ├── validators/           # Zod schemas for form validation
│   │   ├── auth.validator.ts
│   │   └── reservation.validator.ts
│   │
│   ├── app.tsx               # Root component, context providers
│   └── main.tsx              # ReactDOM.createRoot entry
│
├── index.html                # Vite HTML entry
├── tailwind.config.ts        # Theme config + custom colors
├── biome.json                # Linter + formatter
├── vite-env.d.ts             # Vite env type declarations
└── vercel.json               # Deploy config + SPA redirect rules
```

---

## 🎨 State → Color Mapping (`constants/tableStates.ts`)

This is the single source of truth for how each state looks in the UI.

| State constant | Color | Tailwind class | Label |
|---------------|-------|----------------|-------|
| `FREE` | 🟢 Green | `bg-green-500` | Free |
| `RESERVED` | 🟡 Yellow | `bg-yellow-400` | Reserved |
| `PENDING_CONFIRM` | 🟡 Yellow | `bg-yellow-400` | Reserved *(same as above — internal)* |
| `LEGITIMATELY_OCCUPIED` | 🔴 Red | `bg-red-500` | In use |
| `OCCUPIED_NO_RESERVATION` | 🔵 Blue | `bg-blue-500` | Occupied |
| `CONFLICT` | 🟠 Orange | `bg-orange-500` | *(Admin only — shows as Red publicly)* |
| `NO_SIGNAL` | ⚫ Gray | `bg-gray-400` | No signal |

---

## 📱 Pages & UX Flow

### Home (Map View) — everyone sees this

- Grid layout of all tables grouped by zone (A, B, C...)
- Each table shows: state color, capacity badge (×2/4/6), timer if occupied
- Filter bar at top: "All · ×2 · ×4 · ×6"
- Visitor sees banner: *"Log in or create an account to reserve a table."*
- Registered user sees: **Reserve** button on free tables
- Real-time updates via WebSocket — no refresh needed

### Reserve flow

1. User taps a free table → modal opens
2. Selects duration: 30 / 45 / 60 minutes
3. Confirmation screen shows: table, zone, time, generated code preview
4. Confirm → API call → success toast → email sent
5. Table turns yellow on the map instantly (WebSocket)

### Check-in flow (`/checkin?mesa=A3`)

- URL comes from scanning the physical QR on the table
- If session active → shows check-in form directly
- If no session → redirects to login, then back to `/checkin?mesa=A3`
- Form: *"Table A3 — Enter your reservation code:"*
- Input → validate → success → table turns red + timer starts

### My Reservations

- Lists all user's reservations (active, past, cancelled)
- Active reservation shows live timer
- **Extend button** appears automatically when the next time slot is free
- Extension request → API call → table timer updates live

### Admin Dashboard

- Full map with all states including 🟠 CONFLICT
- Conflict list with table ID, time detected, actions
- Manual reassignment option
- Metrics: daily reservations, no-show rate, peak hours

---

## 🔄 Real-time Updates (WebSocket)

The map must stay live without page refreshes. This is handled by `SocketContext.tsx`:

```typescript
// On connection
socket.on('table:state_changed', ({ tableId, newState, timer }) => {
  // Update the table in local state → re-renders TableCard automatically
})

socket.on('table:timer_update', ({ tableId, remainingSeconds }) => {
  // Updates the countdown on the specific table
})
```

`useTables.ts` combines the initial REST fetch with the WebSocket subscription so the map is always consistent.

---

## 🔐 Authentication Flow

**AuthContext** stores the JWT token in memory (not localStorage — more secure for this use case). On app load it checks for a token and fetches the current user.

```
app loads
  └── AuthContext initializes
        ├── token in memory? → GET /api/auth/me → set user
        └── no token → user is visitor
```

**ProtectedRoute** wraps all pages that require login:
```
/reserve → ProtectedRoute → if no user → /login?redirect=/reserve
/checkin?mesa=A3 → ProtectedRoute → if no user → /login?redirect=/checkin?mesa=A3
```

The `redirect` query param ensures the user lands back where they were after login.

---

## 🌍 Sweet Home 3D — Food Court Floor Plan

Sweet Home 3D is a free 2D/3D interior design tool used to produce the **physical infrastructure map** of the food court where BLIX is deployed.

### What to model

- Full food court floor area (to scale in meters)
- Table zones (Zone A, B, C...) with correct table placement
- Each table labeled with its ID (A1, A2... B1, B2...)
- QR code placeholder stickers on each table (represented as a small object)
- IoT gateway placement per zone (wall-mounted)
- Electrical outlets and network access points
- Main entrance, kitchen access, payment counters

### Deliverables from Sweet Home 3D

| Output | Format | Purpose |
|--------|--------|---------|
| 2D floor plan | PNG export | Word document + README |
| 3D render | JPG export | Word document + video |
| `.sh3d` file | Sweet Home 3D | Submitted in project ZIP |

### Export steps in Sweet Home 3D

1. `File → Export to SVG` for the 2D plan
2. `3D View → Export to OBJ or JPG` for the 3D render
3. Set scale: 1 cm = real measurement of the food court

---

## 🗺️ Geographic Map

The geographic map shows the **real-world location** of the shopping mall where BLIX would be deployed. It provides context for the network infrastructure (ISP entry point, building perimeter, etc.).

### Tool options (all free)

| Tool | Use |
|------|-----|
| Google Maps (screenshot + annotations) | Quick location map |
| Google My Maps | Custom pins, zone overlays, exportable |
| uMap (umap.openstreetmap.fr) | Open source, no account needed |
| QGIS | Full GIS software — more complex but impressive |

### What to show on the map

- Mall location pin with name
- Surrounding streets and reference points
- ISP / fiber entry point annotation
- Approximate coverage area of the WiFi network
- Building perimeter outline

### Deliverables

| Output | Format |
|--------|--------|
| Map screenshot with annotations | PNG |
| Link to Google My Maps (if used) | URL in document |
| Map image embedded in Word doc | Required |

---

## 🚀 Local Setup

```bash
cd Frontend
npm install

# Configure environment
cp .env.example .env
# VITE_API_URL=http://localhost:3000

npm run dev
# Opens at http://localhost:5173
```

---

## ☁️ Deploy (Vercel)

Vercel is ideal for the frontend — zero configuration for Vite + React.

```bash
npm install -g vercel
vercel login
vercel        # Follow prompts — auto-detects Vite
```

### `vercel.json` — Required for SPA routing

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

Without this, direct links like `/checkin?mesa=A3` return 404 on Vercel.

Set `VITE_API_URL` in Vercel dashboard → Settings → Environment Variables.

---

## 📦 Key Dependencies

```json
{
  "react": "^18",
  "react-dom": "^18",
  "react-router-dom": "^6",
  "typescript": "^5",
  "vite": "^5",
  "tailwindcss": "^3",
  "axios": "^1",
  "socket.io-client": "^4",
  "zod": "^3"
}
```