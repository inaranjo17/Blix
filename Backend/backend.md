# 🟦 BLIX — Backend, Database & API

> **Responsible:** Isa — Tech Lead · Backend · Database · REST API · Deploy
> **Stack:** Node.js · TypeScript · Express · Prisma · PostgreSQL · Socket.io · SendGrid

---

## 📐 Architecture Overview

The backend follows a **layered architecture** where each folder has a single, clear responsibility. No layer skips another:

```
Request → Route → Middleware → Controller → Service → Prisma (DB)
                                                   ↕
                                              Jobs (cron)
                                              Sockets (WebSocket)
```

---

## 📁 Folder Structure & Responsibilities

```
Backend/
├── prisma/
│   ├── schema.prisma         # Database schema — single source of truth
│   └── migrations/           # Auto-generated migration history
│
├── src/
│   ├── @types/               # Global TypeScript type extensions
│   │   └── express.d.ts      # Extends req.user with JWT payload
│   │
│   ├── configs/              # Configuration modules
│   │   ├── db.ts             # Prisma client singleton
│   │   ├── email.ts          # SendGrid initialization
│   │   └── socket.ts         # Socket.io server setup
│   │
│   ├── controllers/          # Handle HTTP req/res — no business logic here
│   │   ├── auth.controller.ts
│   │   ├── reservation.controller.ts
│   │   ├── table.controller.ts
│   │   ├── checkin.controller.ts
│   │   ├── extension.controller.ts
│   │   └── admin.controller.ts
│   │
│   ├── helpers/              # Small pure functions used across layers
│   │   ├── codeGenerator.ts  # Generates BLIX-A3-7294 format codes
│   │   ├── dateHelpers.ts    # Time window calculations
│   │   └── zoneHelper.ts     # Nearest zone logic for reassignment
│   │
│   ├── jobs/                 # Automated background processes (node-cron)
│   │   ├── noShowWatcher.ts  # Detects reservations past 10min grace
│   │   ├── emailReminders.ts # Sends 30min, 10min, 5min emails
│   │   ├── stateEngine.ts    # Evaluates R1–R10 rules every N seconds
│   │   └── sensorTimeout.ts  # Detects R10: no sensor data > 5min
│   │
│   ├── middlewares/          # Express middleware chain
│   │   ├── auth.middleware.ts      # Verifies JWT, attaches req.user
│   │   ├── role.middleware.ts      # Role guard (admin / user / visitor)
│   │   ├── validate.middleware.ts  # Zod schema validation wrapper
│   │   └── error.middleware.ts     # Global error handler
│   │
│   ├── routes/               # Route definitions — map URL to controller
│   │   ├── auth.routes.ts
│   │   ├── reservation.routes.ts
│   │   ├── table.routes.ts
│   │   ├── checkin.routes.ts
│   │   ├── extension.routes.ts
│   │   └── admin.routes.ts
│   │
│   ├── services/             # Business logic — all rules live here
│   │   ├── auth.service.ts
│   │   ├── reservation.service.ts
│   │   ├── table.service.ts
│   │   ├── checkin.service.ts
│   │   ├── extension.service.ts
│   │   ├── email.service.ts        # Sends all transactional emails
│   │   ├── reassignment.service.ts # Finds nearest available table
│   │   └── sensor.service.ts       # Processes incoming sensor events
│   │
│   ├── sockets/              # Socket.io real-time event handlers
│   │   ├── tableEvents.ts    # Emits state changes to connected clients
│   │   └── sensorEvents.ts   # Receives simulated sensor input
│   │
│   ├── utils/                # Project-wide utility functions
│   │   ├── generateCode.ts   # BLIX-{ZONE}{TABLE}-{RANDOM4} generator
│   │   ├── generateToken.ts  # JWT and verification token generator
│   │   └── timeUtils.ts      # Duration math, slot conflict checks
│   │
│   ├── validators/           # Zod schemas for request validation
│   │   ├── auth.validator.ts
│   │   ├── reservation.validator.ts
│   │   └── checkin.validator.ts
│   │
│   └── server.ts             # App bootstrap: Express + Socket.io + cron
│
├── .env                      # Environment variables (never commit)
├── biome.json                # Linter + formatter config
├── package.json
├── server.js                 # Compiled entry point for production
└── vercel.json               # Deploy config
```

---

## 🗄️ Database Schema (Prisma)

### Tables / Models

```prisma
model User {
  id            String        @id @default(uuid())
  name          String
  email         String        @unique
  phone         String
  passwordHash  String
  verified      Boolean       @default(false)
  role          Role          @default(USER)
  createdAt     DateTime      @default(now())
  reservations  Reservation[]
}

model Table {
  id           String        @id  // e.g. "A3"
  zone         String        // "A", "B", "C"
  capacity     Int           // 2, 4, 6
  state        TableState    @default(FREE)
  sensorActive Boolean       @default(true)
  lastSeen     DateTime?     // last sensor ping
  reservations Reservation[]
}

model Reservation {
  id          String            @id @default(uuid())
  code        String            @unique  // BLIX-A3-7294
  userId      String
  tableId     String
  startTime   DateTime
  endTime     DateTime
  duration    Int               // 30, 45, 60 minutes
  status      ReservationStatus @default(PENDING)
  checkedInAt DateTime?
  createdAt   DateTime          @default(now())
  user        User              @relation(fields: [userId], references: [id])
  table       Table             @relation(fields: [tableId], references: [id])
}

enum Role {
  VISITOR
  USER
  ADMIN
}

enum TableState {
  FREE
  RESERVED
  PENDING_CONFIRM     // internal — shows as RESERVED publicly
  LEGITIMATELY_OCCUPIED
  OCCUPIED_NO_RESERVATION
  CONFLICT            // internal — shows as OCCUPIED publicly
  NO_SIGNAL
}

enum ReservationStatus {
  PENDING      // created, not yet checked in
  ACTIVE       // checked in, timer running
  COMPLETED    // time ended normally
  CANCELLED    // no-show or manual cancel
  EXTENDED     // time was extended
}
```

---

## 🔌 REST API Reference

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | None | Register new user |
| POST | `/api/auth/login` | None | Login, returns JWT |
| GET | `/api/auth/verify/:token` | None | Email verification |
| GET | `/api/auth/me` | JWT | Get current user |

### Tables

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/tables` | None | All tables + current state |
| GET | `/api/tables/:id` | None | Single table detail |
| PATCH | `/api/tables/:id/state` | Admin | Manual state override |

### Reservations

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/reservations` | JWT | Create reservation |
| GET | `/api/reservations/my` | JWT | User's own reservations |
| DELETE | `/api/reservations/:id` | JWT | Cancel own reservation |
| GET | `/api/reservations` | Admin | All reservations |

### Check-in

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/checkin` | JWT | Validate QR + code → activate |

### Extension

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/reservations/:id/extend` | JWT | Request +30min extension |

### Sensor (IoT simulation)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/sensor/event` | Internal | Sensor presence event |

### Admin

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/admin/conflicts` | Admin | Active conflict list |
| GET | `/api/admin/metrics` | Admin | Usage statistics |
| POST | `/api/admin/reassign` | Admin | Manual reassignment |

---

## ⚡ WebSocket Events (Socket.io)

### Server → Client (emitted to all connected clients)

| Event | Payload | When |
|-------|---------|------|
| `table:state_changed` | `{ tableId, newState, timer? }` | Any state transition |
| `table:timer_update` | `{ tableId, remainingSeconds }` | Every 60s on active tables |
| `table:conflict` | `{ tableId }` | Admin room only |

### Client → Server

| Event | Payload | When |
|-------|---------|------|
| `sensor:presence` | `{ tableId, detected: boolean }` | IoT gateway sends this |
| `admin:join` | `{ token }` | Admin connects to admin room |

---

## 🤖 Automated Jobs (node-cron)

| Job | Schedule | Rule | Action |
|-----|----------|------|--------|
| `stateEngine` | Every 30s | R1–R9 | Evaluate all active table states |
| `noShowWatcher` | Every 60s | R3 | Cancel reservations past 10min grace |
| `emailReminders` | Every 60s | — | Send 30min, 10min, 5min emails |
| `sensorTimeout` | Every 60s | R10 | Flag tables with no sensor data >5min |

---

## 📧 Email Service (SendGrid)

All emails are sent through `email.service.ts`. Templates are plain HTML strings (no external template engine needed for a project of this scope).

### Email triggers

```typescript
sendConfirmationEmail(user, reservation)
sendReminderEmail(user, reservation, minutesBefore: 30 | 10)
sendCheckinConfirmEmail(user, reservation)
sendTimerWarningEmail(user, reservation, minutesLeft: 10 | 5)
sendExtensionApprovedEmail(user, reservation)
sendExtensionRejectedEmail(user, reservation)
sendNoShowEmail(user, reservation)
sendConflictReassignedEmail(user, oldTable, newTable, newCode)
sendConflictNoAlternativeEmail(user, reservation)
```

---

## 🔐 Authentication & Security

- Passwords hashed with **bcrypt** (salt rounds: 12)
- Sessions managed with **JWT** (expiry: 7 days)
- Email verification required before first reservation
- Role-based middleware guards all admin routes
- `.env` holds all secrets — never committed to git

### `.env` variables

```env
DATABASE_URL=postgresql://user:pass@host/blix
JWT_SECRET=your_jwt_secret_here
SENDGRID_API_KEY=SG.xxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@blix.app
PORT=3000
CLIENT_URL=https://blix.vercel.app
```

---

## 🚀 Local Setup

```bash
# 1. Install dependencies
cd Backend
npm install

# 2. Configure environment
cp .env.example .env
# Fill in DATABASE_URL, JWT_SECRET, SENDGRID_API_KEY

# 3. Run migrations
npx prisma migrate dev --name init

# 4. Open Prisma Studio (visual DB browser — use alongside DBeaver)
npx prisma studio

# 5. Start dev server
npm run dev
```

---

## 🗄️ DBeaver Setup

1. Open DBeaver → New Connection → PostgreSQL
2. Host: your Neon.tech host (from `DATABASE_URL`)
3. Database: `blix`
4. User + Password: from Neon.tech dashboard
5. Test connection → Finish

DBeaver lets you visually inspect tables, run queries, and verify state transitions during development without writing extra code.

---

## ☁️ Deploy (Railway)

Railway is recommended over Vercel for the backend because BLIX uses **WebSockets and cron jobs** — both require a persistent server process that Vercel's serverless functions cannot maintain.

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

Set environment variables in the Railway dashboard (same keys as `.env`).

---

## 🧪 Testing the State Engine Manually

Since there are no physical sensors in development, use the sensor simulation endpoint:

```bash
# Simulate presence detected at table A3
curl -X POST http://localhost:3000/api/sensor/event \
  -H "Content-Type: application/json" \
  -d '{ "tableId": "A3", "detected": true }'

# Simulate no presence
curl -X POST http://localhost:3000/api/sensor/event \
  -H "Content-Type: application/json" \
  -d '{ "tableId": "A3", "detected": false }'
```

Watch the WebSocket events in the browser console or Socket.io admin panel to verify state transitions fire correctly.