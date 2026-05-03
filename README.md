# 🟦 BLIX — Smart Table Reservation System

> **Networks I — Final Project**
> Team: Luna · Isa · Karen · Nicky
> Deadline: May 27, 2026 · Showroom: May 28, 2026

---

## 📌 What is BLIX?

BLIX is a smart real-time table management and reservation system designed for food courts in shopping malls. It combines IoT sensors, a web application, and automated notification logic to solve one of the most common friction points in shared public spaces: **not knowing which tables are actually available**.

Users can see a live map of every table's status, make reservations from their phone, check in with a QR code, and receive email notifications throughout the entire experience — all without installing an app.

---

## 🎯 Problem it solves

In a typical food court, people walk around with trays looking for a free table. There is no way to know in advance which tables are available, how long someone has been sitting, or whether a table with a bag on it is actually occupied or just temporarily left. BLIX makes all of that information visible, honest, and actionable.

---

## 👥 Team & Roles

| Member | Role & Responsibilities |
|--------|------------------------|
| **Luna** | Network Architecture · Cisco Packet Tracer Simulation · draw.io Diagram |
| **Isa** | Tech Lead · Backend · Database · REST API · Deploy |
| **Karen** | Frontend · Sweet Home 3D Floor Plan · Geographic Map · Deploy |
| **Nicky** | IoT Simulator · Equipment Datasheets · Word Document · YouTube Video |

---

## 🗂️ Project Structure

```
Blix/
├── Backend/                  # Node.js + TypeScript API server
│   ├── prisma/               # Database schema and migrations
│   ├── src/
│   │   ├── @types/           # TypeScript type definitions
│   │   ├── configs/          # DB, email, socket configuration
│   │   ├── controllers/      # Request handlers per resource
│   │   ├── helpers/          # Reusable logic helpers
│   │   ├── jobs/             # Automated cron jobs (state engine)
│   │   ├── middlewares/      # Auth, validation, error handling
│   │   ├── routes/           # API route definitions
│   │   ├── services/         # Business logic layer
│   │   ├── sockets/          # WebSocket real-time handlers
│   │   ├── utils/            # Utilities (code gen, tokens, etc.)
│   │   ├── validators/       # Request schema validation
│   │   └── server.ts         # App entry point
│   └── server.js             # Compiled entry (production)
│
└── Frontend/                 # React + TypeScript + Vite PWA
    └── src/
        ├── @types/           # TypeScript type definitions
        ├── api/              # Axios API client functions
        ├── assets/           # Images, icons, static files
        ├── components/
        │   ├── layout/       # Page shells, nav, wrappers
        │   └── ui/           # Reusable UI components
        ├── constants/        # State colors, durations, routes
        ├── context/          # Global state (auth, user role)
        ├── hooks/            # Custom React hooks
        ├── pages/            # Route-level page components
        ├── routes/           # React Router configuration
        ├── utils/            # Frontend utilities
        └── validators/       # Form validation schemas
```

---

## 🔄 System Flow Summary

### User types

| Type | Can see map | Can reserve | Check-in | Notifications |
|------|-------------|-------------|----------|---------------|
| Visitor (no account) | ✅ | ❌ | ❌ | ❌ |
| Registered user | ✅ | ✅ | ✅ | ✅ Email |
| Admin | ✅ | ✅ | ✅ | ✅ Email + Dashboard |

### Table states

| State | Color | Visible to public |
|-------|-------|-------------------|
| Free | 🟢 Green | ✅ |
| Reserved | 🟡 Yellow | ✅ |
| Legitimately occupied | 🔴 Red + timer | ✅ |
| Occupied without reservation | 🔵 Blue | ✅ |
| Conflict *(internal)* | 🟠 Orange | ❌ Admin only |
| No signal | ⚫ Gray | ✅ |

### Reservation lifecycle

```
User selects table → Chooses duration (30/45/60 min)
→ System validates slot → Generates code BLIX-A3-7294
→ Confirmation email → User arrives → Scans QR
→ Enters code → Check-in validated → Timer starts (public)
→ Email at 10 min and 5 min remaining
→ User extends from app (My Reservations) if slot is free
→ Time ends → sensor determines Free or Occupied-without-reservation
```

---

## 🤖 State Engine (IF-THEN Rules)

The backend runs 10 automated rules that drive all state transitions:

```
R1  sensor=presence + valid check-in + active reservation → LEGITIMATELY OCCUPIED (start timer)
R2  no presence + active reservation + <10min grace      → RESERVED (waiting)
R3  no presence + active reservation + ≥10min grace      → FREE + no-show email
R4a presence + no valid check-in + <3min                 → PENDING CONFIRM (internal, shows Yellow)
R4b presence + no valid check-in + ≥3min                 → CONFLICT → alert admin → reassign
R5  presence + no reservation + no check-in              → OCCUPIED WITHOUT RESERVATION
R6  extension requested + next slot free                  → extend timer +30min max
R7  extension requested + next slot reserved              → reject + email
R8  timer = 0 + sensor presence                          → OCCUPIED WITHOUT RESERVATION
R9  timer = 0 + no presence                              → FREE
R10 no sensor data + timeout >5min                       → NO SIGNAL → alert admin
```

---

## 📧 Email Notifications (via SendGrid — free tier)

| Trigger | Content |
|---------|---------|
| Reservation created | Code, table, time, check-in instructions |
| 30 min before | Reminder with code |
| 10 min before start | Check-in reminder |
| Check-in successful | Timer started confirmation |
| 10 min before end | "Go to app → My Reservations to extend" |
| 5 min before end | Final warning |
| Extension approved | New end time |
| Extension rejected | Reason (next slot taken) |
| No-show | Reservation cancelled automatically |
| Conflict + reassignment | New table and new code |
| No reassignment available | Priority registered for next slot |

> WhatsApp API was evaluated and rejected for this project due to cost ($0.0008–$0.0125 USD/message via Meta's official API). Listed as a future upgrade when the mall provides funding.

---

## 🛠️ Full Tech Stack

### Backend
| Tool | Purpose |
|------|---------|
| Node.js + TypeScript | Runtime and type safety |
| Express.js | HTTP server and routing |
| Prisma ORM | Database queries and migrations |
| PostgreSQL (Neon.tech) | Relational database — free tier |
| Socket.io | Real-time WebSocket events |
| node-cron | Scheduled jobs (state engine) |
| SendGrid | Transactional email |
| JWT | Authentication tokens |
| Biome | Linter + formatter |
| Vercel / Railway | Deploy |

### Frontend
| Tool | Purpose |
|------|---------|
| React + TypeScript | UI framework |
| Vite | Build tool and dev server |
| Tailwind CSS | Styling |
| React Router | Client-side routing |
| Axios | HTTP client |
| Socket.io-client | Real-time map updates |
| Zod | Form and API validation |
| Biome | Linter + formatter |
| Vercel | Deploy |

### IoT / Network
| Tool | Purpose |
|------|---------|
| PIR Sensors (per table) | Presence detection |
| Zigbee protocol | Sensor-to-gateway communication |
| IoT Gateway (per zone) | Aggregates sensor data |
| Cisco Packet Tracer | Network simulation |
| draw.io | Network architecture diagram |
| Sweet Home 3D | Floor plan (2D/3D) |

---

## 🌐 Network Architecture Summary

```
[PIR Sensors] ──Zigbee──► [IoT Gateway per zone]
                                    │
                              VLAN 10 (IoT)
                                    │
[Access Switch per zone] → [Core Switch] → [Router] → [Internet]
                                    │
                              VLAN 20 (Users)
                              VLAN 30 (Admin)
                                    │
                        [Blix Cloud Server]
                    ┌──────────┬────────────┐
                  Auth      Reservations  State Engine
                  API         DB           Jobs + Sockets
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v20+
- PostgreSQL database (or Neon.tech account)
- SendGrid account (free tier)
- VS Code + DBeaver

### Backend setup

```bash
cd Backend
npm install
cp .env.example .env        # Fill in DB_URL, JWT_SECRET, SENDGRID_KEY
npx prisma migrate dev      # Run migrations
npm run dev                 # Start dev server
```

### Frontend setup

```bash
cd Frontend
npm install
cp .env.example .env        # Fill in VITE_API_URL
npm run dev                 # Start Vite dev server
```

---

## 📅 Project Deliverables

| Deliverable | Responsible | Format |
|-------------|-------------|--------|
| Network diagram | Luna | draw.io (specialized software) |
| Floor plan 2D/3D | Karen | Sweet Home 3D |
| Geographic map | Karen | Google Maps / GIS tool |
| Equipment datasheets | Nicky | PDF / Word |
| PKT simulation | Luna | .pkt file |
| Word document | Nicky | TeamBlix_FinalProject.doc |
| Project ZIP | Isa | TeamBlix_FinalProject.zip |
| YouTube video (5 min) | Nicky | YouTube link |
| Showroom demo | All | Live — May 28, class time |

---

## 📁 Submission

- **Document:** `TeamBlix_FinalProject.doc`
- **Code ZIP:** `TeamBlix_FinalProject.zip`
- **Video:** YouTube (unlisted or public, 5 minutes max)
- **Deadline:** May 27, 2026 at 23:59
- **Showroom:** May 28, 2026 — class time