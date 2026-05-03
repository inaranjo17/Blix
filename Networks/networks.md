# 🟦 BLIX — Network Architecture, Simulation & Equipment

> **Responsible:** Luna (Architecture · PKT · draw.io · Simulation) · Nicky (IoT Simulation · Datasheets · Word Doc · Video)
> **Tools:** Cisco Packet Tracer · draw.io · Sweet Home 3D · YouTube

---

## 📐 Network Architecture Overview

BLIX operates across three distinct network layers. Each layer has isolated traffic via VLANs to ensure security, performance, and manageability.

```
┌──────────────────────────────────────────────────────────────────┐
│                       PERCEPTION LAYER                           │
│                                                                  │
│  [PIR Sensor - Table A1] ──┐                                     │
│  [PIR Sensor - Table A2] ──┤                                     │
│  [PIR Sensor - Table A3] ──┼─Zigbee──► [IoT Gateway - Zone A]   │
│  [PIR Sensor - Table A4] ──┤                                     │
│  [PIR Sensor - Table A5] ──┘                                     │
│                                                                  │
│  (Same topology repeated for Zone B, Zone C, etc.)              │
└─────────────────────────────┬────────────────────────────────────┘
                              │ Ethernet (Cat6) · VLAN 10
┌─────────────────────────────▼────────────────────────────────────┐
│                        NETWORK LAYER                             │
│                                                                  │
│  [Access Switch Zone A] ──┐                                      │
│  [Access Switch Zone B] ──┤                                      │
│  [Access Switch Zone C] ──┼──► [Core Switch] ──► [Router]       │
│  [Access Switch Admin] ───┘                          │           │
│                                                    [Firewall]    │
│  VLAN 10: IoT Sensors (192.168.10.0/24)              │           │
│  VLAN 20: Users + App (192.168.20.0/24)          [Internet]      │
│  VLAN 30: Mall Admin  (192.168.30.0/24)              │           │
│                                                  [Cloud Server]  │
│  WiFi APs per zone → VLAN 20 (users)             [Blix Backend]  │
└──────────────────────────────────────────────────────────────────┘
                              │ HTTPS + WSS (WebSocket Secure)
┌─────────────────────────────▼────────────────────────────────────┐
│                     APPLICATION LAYER                            │
│                                                                  │
│  [Blix Cloud Server]                                             │
│    ├── REST API (Express)                                        │
│    ├── WebSocket Server (Socket.io)                              │
│    ├── State Engine (node-cron jobs)                             │
│    ├── Email Service (SendGrid)                                  │
│    └── Database (PostgreSQL - Neon.tech)                         │
│                                                                  │
│  [Clients on VLAN 20]                                            │
│    ├── PWA (user smartphones + PC browsers)                      │
│    ├── LED screens in food court (read-only map)                 │
│    └── Admin panel (mall management office)                      │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🌐 VLAN Design

| VLAN ID | Name | Subnet | Devices | Purpose |
|---------|------|--------|---------|---------|
| VLAN 10 | IoT | 192.168.10.0/24 | Zigbee gateways, sensors | Isolated sensor traffic |
| VLAN 20 | Users | 192.168.20.0/24 | WiFi APs, user devices, LED screens | Guest + app access |
| VLAN 30 | Admin | 192.168.30.0/24 | Admin PCs, server room | Management access |

> **Security note:** VLANs 10 and 30 have no direct access to each other. VLAN 10 can only send data to the cloud server through the router via NAT. Users on VLAN 20 cannot reach VLAN 10 devices.

---

## 📡 IoT Communication Protocol — Zigbee

### Why Zigbee over WiFi for sensors?

| Factor | Zigbee | WiFi |
|--------|--------|------|
| Power consumption | Very low (battery months/years) | High (needs constant power) |
| Range | 10–100m, mesh network | 50m direct |
| Network capacity | Up to 65,000 nodes | ~30 stable per AP |
| Cost per node | Low (~$5–15) | Higher |
| Protocol | Dedicated IoT protocol | General purpose |
| Interference | Less (2.4GHz, DSSS) | More (shared with WiFi) |

### Zigbee topology in BLIX

Each zone has one **Zigbee coordinator** (the IoT Gateway). Each PIR sensor is a **Zigbee end device**. The sensors form a **star topology per zone** with the gateway as the hub.

```
[Gateway Zone A - Coordinator]
    ├── [Sensor A1 - End device]
    ├── [Sensor A2 - End device]
    ├── [Sensor A3 - End device]
    ├── [Sensor A4 - End device]
    └── [Sensor A5 - End device]
```

The gateway aggregates all sensor events and forwards them to the Blix server via HTTP POST over Ethernet (VLAN 10).

---

## 🖥️ Network Equipment

### Sensors

**PIR Motion Sensor — HC-SR501 (or equivalent)**

| Spec | Value |
|------|-------|
| Detection angle | 120° |
| Detection range | 3–7 meters (adjustable) |
| Supply voltage | 4.5V – 20V DC |
| Output | Digital HIGH/LOW |
| Communication | Connected to Zigbee module |
| Dimensions | 32 × 24 mm |

**Zigbee Module — CC2530 (or XBee Series 2)**

| Spec | Value |
|------|-------|
| Protocol | Zigbee 2004 / IEEE 802.15.4 |
| Frequency | 2.4 GHz |
| Transmission range | Up to 100m (outdoor), 30m indoor |
| Data rate | 250 kbps |
| Supply voltage | 2.0V – 3.6V |
| Current (TX) | ~34 mA |

---

### IoT Gateway per Zone

**Raspberry Pi 4 Model B** (used as Zigbee coordinator + gateway)

| Spec | Value |
|------|-------|
| Processor | ARM Cortex-A72 @ 1.8 GHz |
| RAM | 4 GB LPDDR4 |
| Connectivity | Gigabit Ethernet, WiFi, Bluetooth |
| USB | 2× USB 3.0, 2× USB 2.0 |
| Storage | MicroSD 32GB |
| OS | Raspberry Pi OS Lite |
| Role | Zigbee coordinator + HTTP forwarder to server |

> **Zigbee dongle:** ConBee II or Sonoff Zigbee 3.0 USB Dongle Plus — plugged into the Raspberry Pi USB port.

---

### Access Switches (per zone)

**Cisco Catalyst 2960-X Series** (or equivalent for simulation)

| Spec | Value |
|------|-------|
| Ports | 24× 10/100/1000 Ethernet |
| Uplink | 4× SFP+ (1G/10G) |
| VLAN support | IEEE 802.1Q |
| PoE | Yes — powers WiFi APs |
| Layer | L2 switch |
| Management | Cisco IOS, SSH, SNMP |

---

### Core Switch

**Cisco Catalyst 3750-X** (or equivalent)

| Spec | Value |
|------|-------|
| Ports | 48× Gigabit Ethernet |
| Uplink | 4× SFP+ 10G |
| Routing | L3 — inter-VLAN routing |
| Features | QoS, VLAN, STP, LACP |
| Role | Aggregates all access switches, routes between VLANs |

---

### Router / Firewall

**Cisco ISR 4321** (or equivalent)

| Spec | Value |
|------|-------|
| Throughput | Up to 100 Mbps |
| WAN ports | 2× GE RJ-45 |
| LAN ports | 2× GE RJ-45 |
| Features | NAT, ACL, VPN, IPS |
| Role | Connects mall to ISP, enforces VLAN policies |

---

### WiFi Access Points (VLAN 20 — Users)

**Cisco Aironet 2800 Series** (or Ubiquiti UniFi AP AC Pro)

| Spec | Value |
|------|-------|
| Standards | IEEE 802.11a/b/g/n/ac (WiFi 5) |
| Bands | Dual-band 2.4GHz + 5GHz |
| Max throughput | 1.7 Gbps |
| Coverage | ~50m radius |
| PoE | Yes (802.3at) |
| SSID | `BLIX-Guests` → VLAN 20 |

---

### LED Display Screens (Food court public displays)

**Samsung QM-B Series** (Commercial display)

| Spec | Value |
|------|-------|
| Connection | Ethernet + WiFi |
| Resolution | 1920×1080 |
| Software | Runs browser in kiosk mode → Blix read-only map |
| Power | 220V AC |
| Mounting | Wall-mounted per zone |

---

## 🔧 Cisco Packet Tracer Simulation

### What to simulate in PKT

Packet Tracer cannot simulate Zigbee or cloud APIs natively, but it can simulate the **full network infrastructure layer**. The simulation must demonstrate:

1. **VLAN configuration** — VLAN 10, 20, 30 with correct port assignments
2. **Inter-VLAN routing** — Core switch or router routing between VLANs
3. **IoT sensor → gateway → server communication** — Using PKT IoT devices as PIR sensor stand-ins
4. **DHCP** — Each VLAN gets its own DHCP pool
5. **ACL (Access Control Lists)** — VLAN 10 cannot reach VLAN 20 or 30 directly
6. **WiFi AP** — SSID `BLIX-Guests` on VLAN 20
7. **Ping tests** — Verify connectivity within VLANs and blocked cross-VLAN access

### PKT Device Mapping

| Real Device | PKT Equivalent |
|-------------|---------------|
| PIR Sensor | PKT IoT Motion Detector |
| Zigbee Gateway | PKT IoT Gateway / MCU board |
| Raspberry Pi | Generic server or end device |
| Cisco Catalyst 2960-X | Cisco 2960 switch |
| Cisco Catalyst 3750-X | Cisco 3560 multilayer switch |
| Cisco ISR 4321 | Cisco ISR 4331 router |
| WiFi AP | Cisco AP (PKT built-in) |
| Cloud server | Server-PT |
| User smartphone | Smartphone-PT on WiFi |
| LED screen | PC-PT on Ethernet |

### Simulation Scenarios to demonstrate

| Scenario | What to show |
|----------|-------------|
| Normal user flow | Smartphone (VLAN 20) → reaches server (internet) |
| Sensor event | IoT device (VLAN 10) → gateway → server |
| VLAN isolation | VLAN 10 device cannot ping VLAN 20 device |
| Admin access | Admin PC (VLAN 30) → can reach all internal resources |
| DHCP assignment | Each device gets correct IP from its VLAN pool |

### PKT IF-THEN Simulation (IoT Board)

PKT's IoT devices support simple JavaScript rules. Use the IoT board to simulate the sensor logic:

```javascript
// PKT IoT script — runs on motion detector
function main() {
  var motion = getCustomInput("motionDetected");
  if (motion === true) {
    customOutput("sensorEvent", "PRESENCE");
  } else {
    customOutput("sensorEvent", "NO_PRESENCE");
  }
}
```

---

## 🗺️ draw.io Network Diagram

The draw.io diagram is the **official architecture diagram** for the Word document and video. It is NOT done in Packet Tracer.

### What the diagram must include

- Physical and logical topology
- All three layers: Perception, Network, Application
- VLAN labels on every link
- Device icons (use draw.io's Cisco network shape library)
- Color coding per VLAN (VLAN 10 = orange, VLAN 20 = blue, VLAN 30 = green)
- Internet cloud symbol with connection to Blix server
- Blix server box with internal components labeled
- Client devices (phones, LED screens, admin PC)

### draw.io Cisco shapes

In draw.io: `Extras → Edit Diagram` or use the shape search panel. Search for:
- `Cisco Router`, `Cisco Switch`, `Cisco Firewall`
- `Server`, `Cloud`, `Wireless AP`
- `IoT Gateway`, `Sensor`

### Export formats

| Format | Use |
|--------|-----|
| PNG (300 DPI) | Word document + README |
| SVG | Scalable version for video |
| `.drawio` file | Submitted in project ZIP |

---

## 🤖 IoT Simulation (Additional Software)

Since Zigbee is not natively supported in PKT, a complementary simulation tool is used to demonstrate the sensor → gateway → server chain.

### Option A: Node-RED (recommended — free, browser-based)

Node-RED is a visual flow-based programming tool. It can simulate:
- A PIR sensor sending presence events (inject node with timer)
- Gateway logic (function node with IF-THEN rules R1–R10)
- HTTP POST to the Blix backend (`/api/sensor/event`)
- Dashboard showing live table states

**Install:**
```bash
npm install -g node-red
node-red
# Opens at http://localhost:1880
```

### Option B: Wokwi (browser-based circuit simulator)

Wokwi simulates real Arduino/ESP32 circuits in the browser. Use it to simulate:
- An HC-SR501 PIR sensor wired to an ESP32
- The ESP32 sending MQTT or HTTP events to the gateway

URL: https://wokwi.com — no installation needed.

### Option C: Tinkercad Circuits (Autodesk — free)

Simulates the physical electronics circuit: PIR sensor + microcontroller wiring. Good for the datasheet section to show the real wiring diagram.

---

## 📋 Word Document Structure (Nicky)

The Word document (`TeamBlix_FinalProject.doc`) must cover:

```
1. Project Overview
   1.1 Problem statement
   1.2 Proposed solution (BLIX)
   1.3 Team and roles

2. Network Architecture [20pts]
   2.1 Topology description
   2.2 draw.io diagram (full page, high res)
   2.3 VLAN design table
   2.4 Communication protocols

3. Physical Infrastructure [20pts]
   3.1 Sweet Home 3D floor plan (2D)
   3.2 Sweet Home 3D render (3D)
   3.3 Geographic map with annotations
   3.4 Zone layout description

4. Equipment [20pts]
   4.1 PIR sensor datasheet summary
   4.2 Zigbee module datasheet summary
   4.3 IoT Gateway (Raspberry Pi) specs
   4.4 Cisco switches and router specs
   4.5 WiFi AP specs
   4.6 Vendor, model, unit cost table

5. Simulation [20pts]
   5.1 Cisco Packet Tracer topology screenshot
   5.2 PKT VLAN configuration proof
   5.3 PKT ping test results (connectivity + isolation)
   5.4 IoT simulation tool (Node-RED or Wokwi) screenshots
   5.5 State engine IF-THEN rules (from system design)

6. Conclusions
   6.1 What BLIX solves
   6.2 Scalability considerations
   6.3 Future improvements (WhatsApp, AI demand prediction)

Appendix A: Full system flow (from BLIX v4 spec)
Appendix B: API endpoint reference
Appendix C: PKT configuration commands
```

---

## 🎬 YouTube Video Guide (Nicky — 5 minutes)

### Suggested structure

| Minute | Content |
|--------|---------|
| 0:00–0:30 | Team intro, project name, problem statement |
| 0:30–1:30 | draw.io network diagram walkthrough |
| 1:30–2:30 | Cisco Packet Tracer demo (VLANs, pings, IoT events) |
| 2:30–3:30 | Sweet Home 3D floor plan + geographic map |
| 3:30–4:30 | Live BLIX demo (reserve, check-in, map update) |
| 4:30–5:00 | Conclusions + team credits |

### Recording tips

- Use OBS Studio (free) to record screen + voiceover
- Record PKT simulation with activity running (pings, IoT events firing)
- Show the Blix web app live on a phone and desktop side by side if possible
- Upload as unlisted on YouTube and paste URL in the Word doc

---

## 📦 Project ZIP Contents (`TeamBlix_FinalProject.zip`)

```
TeamBlix_FinalProject/
├── Code/
│   ├── Backend/        ← Full backend source
│   └── Frontend/       ← Full frontend source
├── Diagrams/
│   ├── network_diagram.drawio
│   ├── network_diagram.png
│   └── floor_plan.sh3d
├── Maps/
│   └── geographic_map.png
├── Simulation/
│   └── blix_simulation.pkt
├── Datasheets/
│   ├── PIR_HC-SR501.pdf
│   ├── Zigbee_CC2530.pdf
│   └── RaspberryPi4.pdf
└── TeamBlix_FinalProject.doc
```