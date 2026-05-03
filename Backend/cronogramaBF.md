# 🟦 BLIX — Plan de desarrollo 5 días
### Backend + Frontend completo · Una sola persona

---

## 🛠️ PRIMERO: Configuración del ambiente de trabajo

> Haz todo esto ANTES del Día 1. Tarda aproximadamente 1–2 horas.
> No empieces a codear sin tener el ambiente completo.

---

### 1. Node.js

Descarga e instala Node.js **versión 20 LTS** (no la "Current"):
👉 https://nodejs.org/en

Verifica en terminal:
```bash
node --version   # debe decir v20.x.x
npm --version    # debe decir 10.x.x
```

---

### 2. Git

Si no lo tienes:
👉 https://git-scm.com/downloads

Configura tu identidad (una sola vez):
```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"
```

---

### 3. VS Code — Extensiones necesarias

Instala estas extensiones desde el panel de extensiones (Ctrl+Shift+X):

| Extensión | ID | Para qué |
|-----------|-----|---------|
| Prisma | `Prisma.prisma` | Syntax highlighting del schema |
| ESLint | `dbaeumer.vscode-eslint` | Errores en tiempo real |
| Tailwind CSS IntelliSense | `bradlc.vscode-tailwindcss` | Autocompletado de clases |
| Thunder Client | `rangav.vscode-thunder-client` | Probar endpoints REST desde VS Code |
| DotENV | `mikestead.dotenv` | Colorea los archivos .env |
| Error Lens | `usernamehh.errorlens` | Muestra errores inline en el código |
| Auto Rename Tag | `formulahendry.auto-rename-tag` | Renombra tags HTML/JSX en pareja |
| Path IntelliSense | `christian-kohler.path-intellisense` | Autocompletado de rutas |

Configuración recomendada de VS Code (`settings.json`):
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "biomejs.biome",
  "editor.tabSize": 2,
  "editor.wordWrap": "on",
  "emmet.includeLanguages": { "javascript": "javascriptreact" },
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

---

### 4. Neon.tech — Base de datos PostgreSQL gratuita

1. Ve a 👉 https://neon.tech y crea una cuenta (con GitHub es más rápido)
2. Crea un nuevo proyecto → nómbralo `blix`
3. En el dashboard, copia la **Connection String** que se ve así:
   ```
   postgresql://user:password@ep-xxx.us-east-1.aws.neon.tech/blix?sslmode=require
   ```
4. Guárdala — la necesitas para el `.env` del backend

---

### 5. DBeaver — Configuración con Neon

DBeaver es tu explorador visual de la base de datos. Así lo conectas:

1. Abre DBeaver → `Database → New Database Connection`
2. Selecciona **PostgreSQL** → Next
3. Completa los campos con los datos de Neon:

| Campo | Valor |
|-------|-------|
| Host | `ep-xxx.us-east-1.aws.neon.tech` (de tu connection string) |
| Port | `5432` |
| Database | `blix` |
| Username | el user de tu connection string |
| Password | el password de tu connection string |

4. En la pestaña **SSL** → marca `Use SSL` y en `SSL Mode` selecciona `require`
5. Click en **Test Connection** → debe decir "Connected"
6. Click en **Finish**

**Cómo usarás DBeaver cada día:**
- Panel izquierdo: ves todas las tablas creadas por Prisma
- Click derecho en tabla → `View Data` → ves todos los registros
- `SQL Editor` → puedes correr queries manuales para verificar datos
- Cuando hagas una reserva desde la app, aquí la ves en tiempo real

---

### 6. SendGrid — Correos transaccionales gratuitos

1. Ve a 👉 https://sendgrid.com → crea cuenta gratuita (100 emails/día gratis)
2. Completa la verificación de cuenta (puede pedir verificar un dominio o sender)
3. Ve a `Settings → API Keys → Create API Key`
4. Nombre: `blix-dev`, permisos: `Full Access`
5. Copia la API Key (empieza con `SG.`) — solo se muestra una vez
6. Ve a `Settings → Sender Authentication → Single Sender Verification`
7. Agrega tu correo personal como sender verificado
8. Guarda la API Key y el email — van al `.env`

---

### 7. Railway — Deploy del backend

Railway es donde correrá el servidor en producción.

1. Ve a 👉 https://railway.app → crea cuenta con GitHub
2. Por ahora solo crea la cuenta — desplegarás al final del Día 5
3. Instala el CLI para cuando lo necesites:
   ```bash
   npm install -g @railway/cli
   ```

---

### 8. Vercel — Deploy del frontend

1. Ve a 👉 https://vercel.com → crea cuenta con GitHub
2. Por ahora solo la cuenta — desplegarás al final del Día 5
3. Instala el CLI:
   ```bash
   npm install -g vercel
   ```

---

### 9. Inicializar el proyecto

Abre VS Code en la carpeta `Blix/` y configura los dos `package.json`.

**Backend — instala dependencias:**
```bash
cd Backend

# Dependencias de producción
npm install express prisma @prisma/client bcrypt jsonwebtoken
npm install @sendgrid/mail socket.io node-cron cors dotenv zod

# Dependencias de desarrollo
npm install -D typescript ts-node nodemon @types/express @types/node
npm install -D @types/bcrypt @types/jsonwebtoken @types/node-cron @types/cors
```

**Backend — `tsconfig.json`** (créalo en `Backend/`):
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**Backend — scripts en `package.json`:**
```json
{
  "scripts": {
    "dev": "nodemon --exec ts-node src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "prisma:migrate": "npx prisma migrate dev",
    "prisma:studio": "npx prisma studio",
    "prisma:generate": "npx prisma generate"
  }
}
```

**Frontend — instala dependencias:**
```bash
cd Frontend

# Si el proyecto aún no tiene Vite inicializado, corre:
npm create vite@latest . -- --template react-ts
# (el punto . instala en la carpeta actual)

# Luego instala las dependencias adicionales:
npm install react-router-dom axios socket.io-client zod
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

**Frontend — configura Tailwind en `tailwind.config.ts`:**
```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'state-free': '#22c55e',
        'state-reserved': '#facc15',
        'state-occupied': '#ef4444',
        'state-no-reservation': '#3b82f6',
        'state-conflict': '#f97316',
        'state-no-signal': '#9ca3af',
        'blix-dark': '#0f172a',
        'blix-blue': '#1e40af',
      }
    },
  },
  plugins: [],
}
export default config
```

**Backend — `.env`** (llena con tus datos reales):
```env
DATABASE_URL="postgresql://user:pass@host/blix?sslmode=require"
JWT_SECRET="una_clave_secreta_larga_y_random_aqui_minimo_32_chars"
SENDGRID_API_KEY="SG.xxxxxxxxxxxxxxxx"
SENDGRID_FROM_EMAIL="tu@email.com"
PORT=3000
CLIENT_URL="http://localhost:5173"
NODE_ENV="development"
```

**Frontend — `.env`:**
```env
VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
```

---

### 10. Verificación final del ambiente

Antes de empezar el Día 1, verifica que todo funciona:

```bash
# Terminal 1 — Backend
cd Backend
npm run dev
# Debe decir: "Server running on port 3000"

# Terminal 2 — Frontend
cd Frontend
npm run dev
# Debe abrir: http://localhost:5173
```

Si ambos corren sin errores → **ambiente listo**.

---
---

# 📅 DÍA 1 — Fundación del backend
### Meta: servidor funcional + autenticación completa + base de datos lista

**Tiempo estimado: 6–8 horas**

---

## Bloque 1.1 — Schema de Prisma (1.5h)

Crea `Backend/prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String        @id @default(uuid())
  name          String
  email         String        @unique
  phone         String
  passwordHash  String
  verified      Boolean       @default(false)
  verifyToken   String?       @unique
  role          Role          @default(USER)
  createdAt     DateTime      @default(now())
  reservations  Reservation[]
}

model Table {
  id           String        @id         // "A1", "A2", "B1"...
  zone         String                    // "A", "B", "C"
  capacity     Int                       // 2, 4, 6
  state        TableState    @default(FREE)
  sensorActive Boolean       @default(true)
  lastSeen     DateTime?
  presenceSince DateTime?               // para calcular R4a/R4b
  reservations Reservation[]
}

model Reservation {
  id            String            @id @default(uuid())
  code          String            @unique   // "BLIX-A3-7294"
  userId        String
  tableId       String
  startTime     DateTime
  endTime       DateTime
  duration      Int
  status        ReservationStatus @default(PENDING)
  checkedInAt   DateTime?
  createdAt     DateTime          @default(now())
  user          User              @relation(fields: [userId], references: [id])
  table         Table             @relation(fields: [tableId], references: [id])
}

enum Role {
  USER
  ADMIN
}

enum TableState {
  FREE
  RESERVED
  PENDING_CONFIRM
  LEGITIMATELY_OCCUPIED
  OCCUPIED_NO_RESERVATION
  CONFLICT
  NO_SIGNAL
}

enum ReservationStatus {
  PENDING
  ACTIVE
  COMPLETED
  CANCELLED
  EXTENDED
}
```

Corre la migración:
```bash
npx prisma migrate dev --name init
npx prisma generate
```

Verifica en DBeaver: debes ver las tablas `User`, `Table`, `Reservation` creadas automáticamente.

**Seed de mesas** — crea `Backend/prisma/seed.ts`:
```typescript
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const zones = ['A', 'B', 'C']
  const capacities = [2, 4, 6, 2, 4]

  for (const zone of zones) {
    for (let i = 0; i < 5; i++) {
      await prisma.table.upsert({
        where: { id: `${zone}${i + 1}` },
        update: {},
        create: {
          id: `${zone}${i + 1}`,
          zone,
          capacity: capacities[i],
          state: 'FREE',
        },
      })
    }
  }
  console.log('✅ 15 tables seeded (zones A, B, C — 5 tables each)')
}

main().finally(() => prisma.$disconnect())
```

Agrega a `package.json`:
```json
"prisma": {
  "seed": "ts-node prisma/seed.ts"
}
```

Corre el seed:
```bash
npx prisma db seed
```

Verifica en DBeaver → tabla `Table` → debe tener 15 filas (A1–A5, B1–B5, C1–C5).

---

## Bloque 1.2 — Servidor base (1h)

`Backend/src/server.ts`:
```typescript
import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createServer } from 'http'
import { Server } from 'socket.io'

dotenv.config()

const app = express()
const httpServer = createServer(app)

export const io = new Server(httpServer, {
  cors: { origin: process.env.CLIENT_URL, methods: ['GET', 'POST'] }
})

app.use(cors({ origin: process.env.CLIENT_URL }))
app.use(express.json())

// Health check
app.get('/health', (_, res) => res.json({ status: 'ok', time: new Date() }))

// Routes (se agregan en días siguientes)

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id)
  socket.on('disconnect', () => console.log('Client disconnected:', socket.id))
})

const PORT = process.env.PORT || 3000
httpServer.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
```

`Backend/src/configs/db.ts`:
```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

✅ **Prueba del bloque:** corre `npm run dev` y visita `http://localhost:3000/health` en el navegador. Debe devolver `{"status":"ok","time":"..."}`.

---

## Bloque 1.3 — Utils (30min)

`Backend/src/utils/generateCode.ts`:
```typescript
// Genera BLIX-A3-7294
export function generateReservationCode(tableId: string): string {
  const random = Math.floor(1000 + Math.random() * 9000)
  return `BLIX-${tableId}-${random}`
}
```

`Backend/src/utils/generateToken.ts`:
```typescript
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

export function generateJWT(userId: string, role: string): string {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET!,
    { expiresIn: '7d' }
  )
}

export function generateVerifyToken(): string {
  return crypto.randomBytes(32).toString('hex')
}
```

`Backend/src/utils/timeUtils.ts`:
```typescript
// ¿El rango startTime–endTime choca con otra reserva existente?
export function hasTimeConflict(
  newStart: Date,
  newEnd: Date,
  existingStart: Date,
  existingEnd: Date
): boolean {
  return newStart < existingEnd && newEnd > existingStart
}

// Minutos restantes desde ahora hasta endTime
export function minutesRemaining(endTime: Date): number {
  return Math.floor((endTime.getTime() - Date.now()) / 60000)
}
```

---

## Bloque 1.4 — Autenticación completa (2.5h)

`Backend/src/validators/auth.validator.ts`:
```typescript
import { z } from 'zod'

export const registerSchema = z.object({
  name: z.string().min(2, 'Name too short'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(7, 'Phone too short'),
  password: z.string().min(6, 'Password min 6 characters'),
})

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})
```

`Backend/src/middlewares/validate.middleware.ts`:
```typescript
import { Request, Response, NextFunction } from 'express'
import { ZodSchema } from 'zod'

export const validate = (schema: ZodSchema) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      return res.status(400).json({ error: result.error.flatten().fieldErrors })
    }
    req.body = result.data
    next()
  }
```

`Backend/src/middlewares/auth.middleware.ts`:
```typescript
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'No token provided' })

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as any
    req.user = { userId: payload.userId, role: payload.role }
    next()
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' })
  }
}

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Admin access required' })
  }
  next()
}
```

`Backend/src/@types/express.d.ts`:
```typescript
declare namespace Express {
  interface Request {
    user?: {
      userId: string
      role: string
    }
  }
}
```

`Backend/src/services/auth.service.ts`:
```typescript
import bcrypt from 'bcrypt'
import { prisma } from '../configs/db'
import { generateJWT, generateVerifyToken } from '../utils/generateToken'

export async function registerUser(data: {
  name: string; email: string; phone: string; password: string
}) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } })
  if (existing) throw new Error('Email already registered')

  const passwordHash = await bcrypt.hash(data.password, 12)
  const verifyToken = generateVerifyToken()

  const user = await prisma.user.create({
    data: { ...data, passwordHash, verifyToken, password: undefined },
  })

  return { user, verifyToken }
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) throw new Error('Invalid credentials')
  if (!user.verified) throw new Error('Please verify your email first')

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) throw new Error('Invalid credentials')

  const token = generateJWT(user.id, user.role)
  return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } }
}

export async function verifyEmail(token: string) {
  const user = await prisma.user.findUnique({ where: { verifyToken: token } })
  if (!user) throw new Error('Invalid verification token')

  await prisma.user.update({
    where: { id: user.id },
    data: { verified: true, verifyToken: null },
  })
  return user
}
```

`Backend/src/controllers/auth.controller.ts`:
```typescript
import { Request, Response } from 'express'
import * as authService from '../services/auth.service'
import { sendVerificationEmail } from '../services/email.service'

export async function register(req: Request, res: Response) {
  try {
    const { user, verifyToken } = await authService.registerUser(req.body)
    await sendVerificationEmail(user.email, user.name, verifyToken)
    res.status(201).json({ message: 'Registered! Check your email to verify your account.' })
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body
    const result = await authService.loginUser(email, password)
    res.json(result)
  } catch (err: any) {
    res.status(401).json({ error: err.message })
  }
}

export async function verify(req: Request, res: Response) {
  try {
    await authService.verifyEmail(req.params.token)
    res.json({ message: 'Email verified! You can now log in.' })
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
}

export async function me(req: Request, res: Response) {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.userId },
    select: { id: true, name: true, email: true, phone: true, role: true }
  })
  res.json(user)
}
```

`Backend/src/routes/auth.routes.ts`:
```typescript
import { Router } from 'express'
import * as ctrl from '../controllers/auth.controller'
import { validate } from '../middlewares/validate.middleware'
import { requireAuth } from '../middlewares/auth.middleware'
import { registerSchema, loginSchema } from '../validators/auth.validator'

const router = Router()

router.post('/register', validate(registerSchema), ctrl.register)
router.post('/login', validate(loginSchema), ctrl.login)
router.get('/verify/:token', ctrl.verify)
router.get('/me', requireAuth, ctrl.me)

export default router
```

Agrega la ruta al servidor en `server.ts`:
```typescript
import authRoutes from './routes/auth.routes'
app.use('/api/auth', authRoutes)
```

## Bloque 1.5 — Email service básico (1h)

`Backend/src/services/email.service.ts`:
```typescript
import sgMail from '@sendgrid/mail'
sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

const FROM = process.env.SENDGRID_FROM_EMAIL!

export async function sendVerificationEmail(to: string, name: string, token: string) {
  const link = `${process.env.CLIENT_URL}/verify/${token}`
  await sgMail.send({
    to, from: FROM,
    subject: 'BLIX — Verifica tu cuenta',
    html: `<h2>Hola ${name} 👋</h2>
           <p>Haz clic en el siguiente enlace para verificar tu cuenta:</p>
           <a href="${link}" style="background:#1e40af;color:white;padding:12px 24px;
           border-radius:6px;text-decoration:none;">Verificar cuenta</a>
           <p>Si no creaste esta cuenta, ignora este correo.</p>`
  })
}

export async function sendConfirmationEmail(
  to: string, name: string,
  code: string, tableId: string,
  startTime: Date, endTime: Date
) {
  await sgMail.send({
    to, from: FROM,
    subject: `BLIX — Reserva confirmada: Mesa ${tableId}`,
    html: `<h2>¡Reserva confirmada! 🎉</h2>
           <p>Hola ${name}, tu reserva está lista.</p>
           <table>
             <tr><td><b>Mesa:</b></td><td>${tableId}</td></tr>
             <tr><td><b>Código:</b></td><td><code>${code}</code></td></tr>
             <tr><td><b>Hora inicio:</b></td><td>${startTime.toLocaleTimeString()}</td></tr>
             <tr><td><b>Hora fin:</b></td><td>${endTime.toLocaleTimeString()}</td></tr>
           </table>
           <p><b>Al llegar:</b> escanea el QR en la mesa e ingresa tu código.</p>
           <p>Tienes <b>10 minutos de gracia</b> para hacer check-in.</p>`
  })
}

export async function sendReminderEmail(
  to: string, name: string, code: string,
  tableId: string, minutesBefore: 30 | 10
) {
  await sgMail.send({
    to, from: FROM,
    subject: `BLIX — Tu reserva empieza en ${minutesBefore} minutos`,
    html: `<h2>⏰ Recuerda tu reserva</h2>
           <p>Hola ${name}, tu reserva de la Mesa <b>${tableId}</b> empieza en 
           <b>${minutesBefore} minutos</b>.</p>
           <p>Código: <code>${code}</code></p>
           <p>Al llegar escanea el QR en la mesa y confirma tu llegada.</p>`
  })
}

export async function sendTimerWarningEmail(
  to: string, name: string, tableId: string, minutesLeft: 10 | 5
) {
  await sgMail.send({
    to, from: FROM,
    subject: `BLIX — Te quedan ${minutesLeft} minutos en Mesa ${tableId}`,
    html: `<h2>⏱️ Tiempo casi agotado</h2>
           <p>Hola ${name}, tu tiempo en la Mesa <b>${tableId}</b> termina en 
           <b>${minutesLeft} minutos</b>.</p>
           ${minutesLeft === 10
             ? `<p>Si deseas extender, ingresa a la app → <b>Mis reservas</b> y 
                toca el botón Extender (disponible si el siguiente bloque está libre).</p>`
             : `<p>Por favor comienza a liberar la mesa.</p>`
           }`
  })
}

export async function sendNoShowEmail(to: string, name: string, tableId: string) {
  await sgMail.send({
    to, from: FROM,
    subject: `BLIX — Tu reserva de Mesa ${tableId} fue cancelada`,
    html: `<h2>Reserva cancelada automáticamente</h2>
           <p>Hola ${name}, tu reserva de la Mesa <b>${tableId}</b> fue cancelada 
           porque no se detectó check-in dentro del tiempo de gracia (10 minutos).</p>
           <p>Puedes hacer una nueva reserva cuando quieras.</p>`
  })
}

export async function sendConflictReassignedEmail(
  to: string, name: string,
  oldTable: string, newTable: string, newCode: string
) {
  await sgMail.send({
    to, from: FROM,
    subject: `BLIX — Tu mesa fue reasignada → Mesa ${newTable}`,
    html: `<h2>⚠️ Tu mesa tenía un ocupante no autorizado</h2>
           <p>Hola ${name}, detectamos que alguien estaba usando tu Mesa 
           <b>${oldTable}</b> sin reserva válida.</p>
           <p>Te reasignamos la <b>Mesa ${newTable}</b>. Tu nuevo código es:</p>
           <h2><code>${newCode}</code></h2>
           <p>Dirígete a la Mesa ${newTable} y haz check-in con este código.</p>`
  })
}
```

---

## ✅ Pruebas del Día 1

Usa **Thunder Client** en VS Code (o Postman) para probar cada endpoint:

**Prueba 1 — Register:**
```
POST http://localhost:3000/api/auth/register
Body JSON:
{
  "name": "Test User",
  "email": "test@gmail.com",
  "phone": "3001234567",
  "password": "123456"
}
Esperado: 201 + mensaje de verificación
```

**Prueba 2 — Login sin verificar:**
```
POST http://localhost:3000/api/auth/login
Body: { "email": "test@gmail.com", "password": "123456" }
Esperado: 401 "Please verify your email first"
```

**Prueba 3 — Verificación:**
- Revisa tu correo, copia el token del link
```
GET http://localhost:3000/api/auth/verify/{TOKEN_DEL_CORREO}
Esperado: 200 "Email verified"
```

**Prueba 4 — Login verificado:**
```
POST http://localhost:3000/api/auth/login
Esperado: 200 + { token, user }
Guarda el token para las pruebas de mañana
```

**Prueba 5 — Me:**
```
GET http://localhost:3000/api/auth/me
Header: Authorization: Bearer {TOKEN}
Esperado: 200 + datos del usuario
```

**Prueba 6 — DBeaver:**
- Abre DBeaver → tabla `User` → `View Data`
- Debe aparecer el usuario con `verified = true`
- Confirma que `passwordHash` es un hash bcrypt (empieza con `$2b$`)

---
---

# 📅 DÍA 2 — API core del negocio
### Meta: endpoints de mesas, reservas, check-in, extensión y sensor funcionando

**Tiempo estimado: 7–8 horas**

---

## Bloque 2.1 — API de Mesas (1h)

`Backend/src/services/table.service.ts`:
```typescript
import { prisma } from '../configs/db'

export async function getAllTables() {
  return prisma.table.findMany({
    orderBy: [{ zone: 'asc' }, { id: 'asc' }],
    include: {
      reservations: {
        where: { status: { in: ['PENDING', 'ACTIVE'] } },
        select: { startTime: true, endTime: true, status: true, code: true }
      }
    }
  })
}

export async function getTableById(id: string) {
  return prisma.table.findUnique({ where: { id } })
}

export async function updateTableState(id: string, state: any, extra?: object) {
  return prisma.table.update({ where: { id }, data: { state, ...extra } })
}
```

`Backend/src/controllers/table.controller.ts`:
```typescript
import { Request, Response } from 'express'
import * as tableService from '../services/table.service'

export async function getTables(req: Request, res: Response) {
  const tables = await tableService.getAllTables()
  res.json(tables)
}

export async function getTable(req: Request, res: Response) {
  const table = await tableService.getTableById(req.params.id)
  if (!table) return res.status(404).json({ error: 'Table not found' })
  res.json(table)
}
```

`Backend/src/routes/table.routes.ts`:
```typescript
import { Router } from 'express'
import * as ctrl from '../controllers/table.controller'

const router = Router()
router.get('/', ctrl.getTables)
router.get('/:id', ctrl.getTable)
export default router
```

---

## Bloque 2.2 — API de Reservas (2h)

`Backend/src/validators/reservation.validator.ts`:
```typescript
import { z } from 'zod'

export const createReservationSchema = z.object({
  tableId: z.string().min(2),
  startTime: z.string().datetime(),
  duration: z.union([z.literal(30), z.literal(45), z.literal(60)]),
})
```

`Backend/src/services/reservation.service.ts`:
```typescript
import { prisma } from '../configs/db'
import { generateReservationCode } from '../utils/generateCode'
import { hasTimeConflict } from '../utils/timeUtils'
import { io } from '../server'

export async function createReservation(userId: string, data: {
  tableId: string; startTime: string; duration: 30 | 45 | 60
}) {
  const start = new Date(data.startTime)
  const end = new Date(start.getTime() + data.duration * 60000)

  // Verify table exists and is free
  const table = await prisma.table.findUnique({ where: { id: data.tableId } })
  if (!table) throw new Error('Table not found')
  if (table.state !== 'FREE') throw new Error('Table is not available')

  // Check no time conflicts with existing reservations
  const existing = await prisma.reservation.findMany({
    where: { tableId: data.tableId, status: { in: ['PENDING', 'ACTIVE'] } }
  })

  for (const r of existing) {
    if (hasTimeConflict(start, end, r.startTime, r.endTime)) {
      throw new Error('Time slot already reserved for this table')
    }
  }

  const code = generateReservationCode(data.tableId)
  const reservation = await prisma.reservation.create({
    data: {
      code, userId, tableId: data.tableId,
      startTime: start, endTime: end, duration: data.duration,
    },
    include: { table: true, user: true }
  })

  // Update table state + emit WebSocket
  await prisma.table.update({ where: { id: data.tableId }, data: { state: 'RESERVED' } })
  io.emit('table:state_changed', { tableId: data.tableId, newState: 'RESERVED' })

  return reservation
}

export async function getUserReservations(userId: string) {
  return prisma.reservation.findMany({
    where: { userId },
    include: { table: true },
    orderBy: { createdAt: 'desc' }
  })
}

export async function cancelReservation(reservationId: string, userId: string) {
  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId }
  })
  if (!reservation) throw new Error('Reservation not found')
  if (reservation.userId !== userId) throw new Error('Not your reservation')
  if (reservation.status === 'ACTIVE') throw new Error('Cannot cancel active reservation')

  await prisma.reservation.update({
    where: { id: reservationId },
    data: { status: 'CANCELLED' }
  })

  // Free the table if no other reservations
  await prisma.table.update({
    where: { id: reservation.tableId },
    data: { state: 'FREE' }
  })
  io.emit('table:state_changed', { tableId: reservation.tableId, newState: 'FREE' })
}
```

---

## Bloque 2.3 — Check-in (1.5h)

`Backend/src/services/checkin.service.ts`:
```typescript
import { prisma } from '../configs/db'
import { io } from '../server'

export async function processCheckin(userId: string, tableId: string, code: string) {
  const now = new Date()

  const reservation = await prisma.reservation.findFirst({
    where: {
      code,
      tableId,
      userId,
      status: 'PENDING',
      startTime: { lte: new Date(now.getTime() + 10 * 60000) }, // within grace
      endTime: { gt: now },
    },
    include: { table: true, user: true }
  })

  if (!reservation) {
    throw new Error('Invalid code, wrong table, or reservation not in active window')
  }

  // Activate reservation
  const updated = await prisma.reservation.update({
    where: { id: reservation.id },
    data: { status: 'ACTIVE', checkedInAt: now },
  })

  // Update table state
  await prisma.table.update({
    where: { id: tableId },
    data: {
      state: 'LEGITIMATELY_OCCUPIED',
      presenceSince: null, // clear pending confirm timer
    }
  })

  const remainingSeconds = Math.floor((reservation.endTime.getTime() - now.getTime()) / 1000)

  io.emit('table:state_changed', {
    tableId,
    newState: 'LEGITIMATELY_OCCUPIED',
    timer: remainingSeconds
  })

  return { reservation: updated, remainingSeconds }
}
```

---

## Bloque 2.4 — Extensión (1h)

`Backend/src/services/extension.service.ts`:
```typescript
import { prisma } from '../configs/db'
import { hasTimeConflict } from '../utils/timeUtils'
import { io } from '../server'

export async function requestExtension(reservationId: string, userId: string) {
  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId }
  })

  if (!reservation) throw new Error('Reservation not found')
  if (reservation.userId !== userId) throw new Error('Not your reservation')
  if (reservation.status !== 'ACTIVE') throw new Error('Reservation is not active')

  const extensionMinutes = 30
  const newEnd = new Date(reservation.endTime.getTime() + extensionMinutes * 60000)

  // Check if next slot is free
  const conflicts = await prisma.reservation.findMany({
    where: {
      tableId: reservation.tableId,
      id: { not: reservationId },
      status: { in: ['PENDING', 'ACTIVE'] }
    }
  })

  for (const c of conflicts) {
    if (hasTimeConflict(reservation.endTime, newEnd, c.startTime, c.endTime)) {
      throw new Error('NEXT_SLOT_TAKEN')
    }
  }

  const updated = await prisma.reservation.update({
    where: { id: reservationId },
    data: { endTime: newEnd, status: 'EXTENDED' }
  })

  const remainingSeconds = Math.floor((newEnd.getTime() - Date.now()) / 1000)
  io.emit('table:state_changed', {
    tableId: reservation.tableId,
    newState: 'LEGITIMATELY_OCCUPIED',
    timer: remainingSeconds
  })

  return updated
}
```

---

## Bloque 2.5 — Sensor simulation endpoint (30min)

`Backend/src/services/sensor.service.ts`:
```typescript
import { prisma } from '../configs/db'
import { updateTableState } from './table.service'
import { io } from '../server'

export async function processSensorEvent(tableId: string, detected: boolean) {
  const table = await prisma.table.findUnique({
    where: { id: tableId },
    include: {
      reservations: {
        where: { status: { in: ['PENDING', 'ACTIVE'] } },
        orderBy: { startTime: 'asc' }
      }
    }
  })
  if (!table) throw new Error('Table not found')

  // Update last seen
  await prisma.table.update({
    where: { id: tableId },
    data: { lastSeen: new Date() }
  })

  const activeReservation = table.reservations[0]

  if (detected && !activeReservation) {
    // R5: presence, no reservation → OCCUPIED_NO_RESERVATION
    await updateTableState(tableId, 'OCCUPIED_NO_RESERVATION')
    io.emit('table:state_changed', { tableId, newState: 'OCCUPIED_NO_RESERVATION' })
  }

  if (detected && activeReservation && activeReservation.status === 'PENDING') {
    // R4a: presence, reservation pending, start PENDING_CONFIRM timer
    const presenceSince = table.presenceSince ?? new Date()
    const secondsWaiting = (Date.now() - presenceSince.getTime()) / 1000

    if (secondsWaiting < 180) { // < 3 minutes
      await prisma.table.update({
        where: { id: tableId },
        data: { state: 'PENDING_CONFIRM', presenceSince: presenceSince }
      })
      // Public map still shows RESERVED (yellow) — handled in frontend
    } else {
      // R4b: > 3 minutes → CONFLICT
      await updateTableState(tableId, 'CONFLICT')
      io.emit('table:conflict', { tableId })
      // Reassignment handled in admin/jobs
    }
  }

  if (!detected && activeReservation?.status === 'ACTIVE') {
    // Timer ran out or user left early — handled by jobs
  }

  return { tableId, detected, currentState: table.state }
}
```

---

## ✅ Pruebas del Día 2

Guarda el JWT del Día 1. Usa Thunder Client con `Authorization: Bearer {token}`.

**Prueba 1 — Listar mesas:**
```
GET http://localhost:3000/api/tables
Esperado: array de 15 mesas, todas en FREE
```

**Prueba 2 — Crear reserva:**
```
POST http://localhost:3000/api/reservations
Auth: Bearer token
Body: {
  "tableId": "A1",
  "startTime": "2026-05-28T14:00:00.000Z",
  "duration": 30
}
Esperado: 201 + objeto de reserva con código BLIX-A1-XXXX
```
Verifica en DBeaver: la mesa A1 ahora tiene `state = RESERVED`.

**Prueba 3 — Conflicto de horario:**
```
POST http://localhost:3000/api/reservations
Body: { "tableId": "A1", "startTime": "2026-05-28T14:15:00.000Z", "duration": 30 }
Esperado: 400 "Time slot already reserved"
```

**Prueba 4 — Check-in:**
```
POST http://localhost:3000/api/checkin
Auth: Bearer token
Body: { "tableId": "A1", "code": "BLIX-A1-XXXX" }
Esperado: 200 + remainingSeconds
```
Verifica en DBeaver: mesa A1 → `state = LEGITIMATELY_OCCUPIED`, reserva → `status = ACTIVE`.

**Prueba 5 — Sensor event:**
```
POST http://localhost:3000/api/sensor/event
Body: { "tableId": "B1", "detected": true }
Esperado: 200, mesa B1 → OCCUPIED_NO_RESERVATION
```

**Prueba 6 — Extensión:**
```
POST http://localhost:3000/api/reservations/{ID}/extend
Auth: Bearer token
Esperado: 200 + nueva endTime +30min
```

---
---

# 📅 DÍA 3 — Motor de estados + WebSockets + Frontend base
### Meta: jobs automáticos corriendo, mapa en tiempo real, auth en frontend

**Tiempo estimado: 7–8 horas**

---

## Bloque 3.1 — Jobs automáticos (2.5h)

`Backend/src/jobs/stateEngine.ts`:
```typescript
import cron from 'node-cron'
import { prisma } from '../configs/db'
import { io } from '../server'
import * as emailService from '../services/email.service'

export function startStateEngine() {
  // Runs every 30 seconds
  cron.schedule('*/30 * * * * *', async () => {
    const now = new Date()

    // R3: No-show — reservation past 10min grace, no check-in
    const noShows = await prisma.reservation.findMany({
      where: {
        status: 'PENDING',
        startTime: { lt: new Date(now.getTime() - 10 * 60000) }
      },
      include: { user: true, table: true }
    })

    for (const r of noShows) {
      await prisma.reservation.update({ where: { id: r.id }, data: { status: 'CANCELLED' } })
      await prisma.table.update({ where: { id: r.tableId }, data: { state: 'FREE', presenceSince: null } })
      io.emit('table:state_changed', { tableId: r.tableId, newState: 'FREE' })
      await emailService.sendNoShowEmail(r.user.email, r.user.name, r.tableId)
      console.log(`[R3] No-show: cancelled reservation ${r.code} for table ${r.tableId}`)
    }

    // R8/R9: Completed reservations
    const expired = await prisma.reservation.findMany({
      where: {
        status: 'ACTIVE',
        endTime: { lt: now }
      },
      include: { table: true }
    })

    for (const r of expired) {
      await prisma.reservation.update({ where: { id: r.id }, data: { status: 'COMPLETED' } })

      // R8: sensor still present → OCCUPIED_NO_RESERVATION
      // R9: sensor gone → FREE
      // For now, default to FREE (sensor check done in sensor events)
      const table = await prisma.table.findUnique({ where: { id: r.tableId } })
      const newState = table?.sensorActive ? 'OCCUPIED_NO_RESERVATION' : 'FREE'

      await prisma.table.update({ where: { id: r.tableId }, data: { state: newState } })
      io.emit('table:state_changed', { tableId: r.tableId, newState })
      console.log(`[R8/R9] Expired: reservation ${r.code} → table ${r.tableId} = ${newState}`)
    }
  })

  console.log('✅ State engine started (every 30s)')
}

export function startEmailReminders() {
  // Runs every minute
  cron.schedule('* * * * *', async () => {
    const now = new Date()

    // 30 min reminder
    const thirtyMin = await prisma.reservation.findMany({
      where: {
        status: 'PENDING',
        startTime: {
          gte: new Date(now.getTime() + 29 * 60000),
          lte: new Date(now.getTime() + 31 * 60000),
        }
      },
      include: { user: true }
    })
    for (const r of thirtyMin) {
      await emailService.sendReminderEmail(r.user.email, r.user.name, r.code, r.tableId, 30)
    }

    // 10 min reminder before start
    const tenMinStart = await prisma.reservation.findMany({
      where: {
        status: 'PENDING',
        startTime: {
          gte: new Date(now.getTime() + 9 * 60000),
          lte: new Date(now.getTime() + 11 * 60000),
        }
      },
      include: { user: true }
    })
    for (const r of tenMinStart) {
      await emailService.sendReminderEmail(r.user.email, r.user.name, r.code, r.tableId, 10)
    }

    // 10 min warning before end
    const tenMinEnd = await prisma.reservation.findMany({
      where: {
        status: 'ACTIVE',
        endTime: {
          gte: new Date(now.getTime() + 9 * 60000),
          lte: new Date(now.getTime() + 11 * 60000),
        }
      },
      include: { user: true }
    })
    for (const r of tenMinEnd) {
      await emailService.sendTimerWarningEmail(r.user.email, r.user.name, r.tableId, 10)
    }

    // 5 min warning before end
    const fiveMinEnd = await prisma.reservation.findMany({
      where: {
        status: 'ACTIVE',
        endTime: {
          gte: new Date(now.getTime() + 4 * 60000),
          lte: new Date(now.getTime() + 6 * 60000),
        }
      },
      include: { user: true }
    })
    for (const r of fiveMinEnd) {
      await emailService.sendTimerWarningEmail(r.user.email, r.user.name, r.tableId, 5)
    }
  })

  console.log('✅ Email reminders started (every 1min)')
}
```

Inicia los jobs en `server.ts`:
```typescript
import { startStateEngine, startEmailReminders } from './jobs/stateEngine'
// After server starts:
startStateEngine()
startEmailReminders()
```

---

## Bloque 3.2 — WebSocket timer broadcast (30min)

`Backend/src/sockets/tableEvents.ts`:
```typescript
import { io } from '../server'
import { prisma } from '../configs/db'

// Broadcasts remaining time for all active reservations every 60 seconds
export function startTimerBroadcast() {
  setInterval(async () => {
    const activeReservations = await prisma.reservation.findMany({
      where: { status: 'ACTIVE' }
    })

    for (const r of activeReservations) {
      const remainingSeconds = Math.max(
        0,
        Math.floor((r.endTime.getTime() - Date.now()) / 1000)
      )
      io.emit('table:timer_update', {
        tableId: r.tableId,
        remainingSeconds
      })
    }
  }, 60000) // every 60 seconds

  console.log('✅ Timer broadcast started (every 60s)')
}
```

---

## Bloque 3.3 — Frontend: setup base (1h)

`Frontend/src/main.tsx`:
```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './app'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
```

`Frontend/src/context/AuthContext.tsx`:
```typescript
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authApi } from '../api/auth.api'

interface User { id: string; name: string; email: string; role: string }
interface AuthCtx {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthCtx>({} as AuthCtx)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const saved = sessionStorage.getItem('blix_token')
    if (saved) {
      setToken(saved)
      authApi.me(saved).then(setUser).finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  async function login(email: string, password: string) {
    const data = await authApi.login(email, password)
    setToken(data.token)
    setUser(data.user)
    sessionStorage.setItem('blix_token', data.token)
  }

  function logout() {
    setToken(null)
    setUser(null)
    sessionStorage.removeItem('blix_token')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
```

`Frontend/src/context/SocketContext.tsx`:
```typescript
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { io, Socket } from 'socket.io-client'

const SocketContext = createContext<Socket | null>(null)

export function SocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    const s = io(import.meta.env.VITE_SOCKET_URL)
    setSocket(s)
    return () => { s.disconnect() }
  }, [])

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
}

export const useSocket = () => useContext(SocketContext)
```

`Frontend/src/app.tsx`:
```typescript
import { AuthProvider } from './context/AuthContext'
import { SocketProvider } from './context/SocketContext'
import { AppRouter } from './routes/AppRouter'

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <AppRouter />
      </SocketProvider>
    </AuthProvider>
  )
}
```

---

## Bloque 3.4 — API client + Auth pages (2h)

`Frontend/src/api/auth.api.ts`:
```typescript
import axios from 'axios'
const BASE = import.meta.env.VITE_API_URL

export const authApi = {
  register: (data: any) => axios.post(`${BASE}/api/auth/register`, data).then(r => r.data),
  login: (email: string, password: string) =>
    axios.post(`${BASE}/api/auth/login`, { email, password }).then(r => r.data),
  me: (token: string) =>
    axios.get(`${BASE}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.data),
}
```

Construye las páginas `Login.tsx` y `Register.tsx` con formularios Tailwind — campos, validación con Zod en cliente, mensajes de error inline, estado de loading mientras el API responde.

---

## ✅ Pruebas del Día 3

**Prueba 1 — Jobs funcionando:**
- Crea una reserva con `startTime` = hace 15 minutos (no-show)
- Espera máximo 30 segundos
- Verifica en DBeaver: `status = CANCELLED`, mesa vuelve a `FREE`
- Verifica en la consola del servidor: mensaje `[R3] No-show: cancelled...`

**Prueba 2 — WebSocket en tiempo real:**
- Abre `http://localhost:5173` en el navegador
- Abre la consola del navegador (F12)
- Haz una reserva y un check-in via Thunder Client
- En la consola debes ver el evento `table:state_changed` llegando sin refresh

**Prueba 3 — Login en frontend:**
- Regístrate en el formulario
- Verifica el correo
- Inicia sesión
- Verifica que `sessionStorage` tiene `blix_token`

---
---

# 📅 DÍA 4 — Frontend completo
### Meta: todas las páginas construidas y conectadas al backend real

**Tiempo estimado: 8 horas**

---

## Bloque 4.1 — Mapa de mesas (2.5h)

Este es el componente más importante del proyecto. Debe verse profesional y actualizarse en tiempo real.

`Frontend/src/hooks/useTables.ts`:
```typescript
import { useState, useEffect } from 'react'
import { useSocket } from '../context/SocketContext'
import { tableApi } from '../api/table.api'

export function useTables() {
  const [tables, setTables] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const socket = useSocket()

  useEffect(() => {
    tableApi.getAll().then(setTables).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!socket) return

    socket.on('table:state_changed', ({ tableId, newState, timer }) => {
      setTables(prev => prev.map(t =>
        t.id === tableId ? { ...t, state: newState, timer } : t
      ))
    })

    socket.on('table:timer_update', ({ tableId, remainingSeconds }) => {
      setTables(prev => prev.map(t =>
        t.id === tableId ? { ...t, timer: remainingSeconds } : t
      ))
    })

    return () => {
      socket.off('table:state_changed')
      socket.off('table:timer_update')
    }
  }, [socket])

  return { tables, loading }
}
```

`Frontend/src/constants/tableStates.ts`:
```typescript
export const STATE_CONFIG = {
  FREE:                    { color: 'bg-green-500',  label: 'Libre',         publicState: 'FREE' },
  RESERVED:                { color: 'bg-yellow-400', label: 'Reservada',     publicState: 'RESERVED' },
  PENDING_CONFIRM:         { color: 'bg-yellow-400', label: 'Reservada',     publicState: 'RESERVED' },
  LEGITIMATELY_OCCUPIED:   { color: 'bg-red-500',    label: 'En uso',        publicState: 'LEGITIMATELY_OCCUPIED' },
  OCCUPIED_NO_RESERVATION: { color: 'bg-blue-500',   label: 'Ocupada',       publicState: 'OCCUPIED_NO_RESERVATION' },
  CONFLICT:                { color: 'bg-red-500',    label: 'En uso',        publicState: 'LEGITIMATELY_OCCUPIED' }, // shows as red publicly
  NO_SIGNAL:               { color: 'bg-gray-400',   label: 'Sin señal',     publicState: 'NO_SIGNAL' },
} as const

export const ADMIN_STATE_CONFIG = {
  ...STATE_CONFIG,
  CONFLICT: { color: 'bg-orange-500', label: '⚠️ Conflicto', publicState: 'CONFLICT' },
}

export function formatTimer(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}
```

`Frontend/src/components/ui/TableCard.tsx`:
```typescript
import { STATE_CONFIG, formatTimer } from '../../constants/tableStates'

interface Props {
  table: any
  isAdmin?: boolean
  onSelect?: (table: any) => void
}

export function TableCard({ table, isAdmin, onSelect }: Props) {
  const config = STATE_CONFIG[table.state as keyof typeof STATE_CONFIG]
  const isFree = table.state === 'FREE'

  return (
    <div
      onClick={() => isFree && onSelect?.(table)}
      className={`
        relative rounded-xl p-4 transition-all duration-300
        ${config.color} bg-opacity-20 border-2
        ${isFree ? 'border-green-500 cursor-pointer hover:scale-105 hover:shadow-lg' : 'border-gray-200 cursor-default'}
      `}
    >
      {/* Table ID */}
      <div className="text-lg font-bold text-gray-800">{table.id}</div>

      {/* Capacity badge */}
      <div className="text-xs text-gray-600 mb-2">×{table.capacity}</div>

      {/* State indicator */}
      <div className={`w-3 h-3 rounded-full ${config.color} absolute top-3 right-3`} />

      {/* State label */}
      <div className="text-xs font-medium text-gray-700">{config.label}</div>

      {/* Timer — only on LEGITIMATELY_OCCUPIED */}
      {table.state === 'LEGITIMATELY_OCCUPIED' && table.timer && (
        <div className="text-sm font-mono font-bold text-red-700 mt-1">
          {formatTimer(table.timer)}
        </div>
      )}
    </div>
  )
}
```

`Frontend/src/pages/Home.tsx` — mapa completo con filtro por capacidad, agrupado por zonas, banner para visitantes, botón de reserva para usuarios autenticados. Esta página es la que más tiempo toma — dedícale al menos 2 horas para que quede bien.

---

## Bloque 4.2 — Flujo de reserva (1.5h)

`Frontend/src/pages/Reserve.tsx`:
- Recibe `tableId` como parámetro de URL
- Muestra info de la mesa seleccionada
- Selector de hora de inicio (time input) y duración (30/45/60 botones)
- Pantalla de confirmación con todos los datos antes de confirmar
- Al confirmar → POST `/api/reservations` → toast de éxito → redirige a Mis reservas

---

## Bloque 4.3 — Check-in (1h)

`Frontend/src/pages/CheckIn.tsx`:
- Lee `?mesa=A3` de la URL (`useSearchParams`)
- Si no hay sesión → redirige a login con `?redirect=/checkin?mesa=A3`
- Muestra: "Mesa A3 — Ingresa tu código de reserva"
- Input del código → POST `/api/checkin` → éxito → mesa se actualiza en tiempo real en el mapa
- Maneja errores: código incorrecto, mesa equivocada, fuera de horario

---

## Bloque 4.4 — Mis Reservas (1h)

`Frontend/src/pages/MyReservations.tsx`:
- Lista todas las reservas del usuario
- Reserva ACTIVE: muestra timer en vivo + botón "Extender +30min" (si el next slot es libre)
- Reserva PENDING: muestra código + botón de cancelar
- Reservas COMPLETED / CANCELLED: historial
- Al extender → POST `/api/reservations/:id/extend` → actualiza timer en tiempo real

---

## Bloque 4.5 — Admin dashboard (1h)

`Frontend/src/pages/admin/Dashboard.tsx`:
- Mapa igual al Home pero con estado CONFLICT visible en naranja
- Panel lateral con lista de conflictos activos
- Botón de reasignación manual por conflicto
- Estadísticas básicas: reservas hoy, no-shows, mesas más usadas

---

## ✅ Pruebas del Día 4

**Prueba completa de flujo de usuario:**
1. Abrir la app como visitante → ver mapa, intentar reservar → ver banner de login
2. Registrarse → recibir correo → verificar
3. Iniciar sesión → seleccionar mesa libre → reservar
4. Verificar que la mesa cambia a amarillo en tiempo real en el mapa (otro tab)
5. Simular llegada: ir a `/checkin?mesa=A1` → ingresar código → ver mesa roja con timer
6. Abrir Mis Reservas → ver timer live → probar extender
7. Esperar que el timer llegue a 0 → ver que mesa cambia de estado sola

**Prueba en móvil:**
- Abre `http://192.168.x.x:5173` desde el celular (mismo WiFi)
- Verifica que el mapa se ve bien en pantalla pequeña
- Prueba el flujo de check-in desde el celular (simulando escanear QR)

---
---

# 📅 DÍA 5 — Integración, pruebas, deploy y pulido
### Meta: todo integrado, testeado, desplegado y documentado

**Tiempo estimado: 6–8 horas**

---

## Bloque 5.1 — Pruebas de integración completas (2h)

Antes de desplegar, ejecuta todos estos escenarios manualmente. Documenta el resultado de cada uno.

### Escenario A — Flujo feliz completo
```
1. Usuario nuevo se registra
2. Verifica correo (llega el email?)
3. Inicia sesión
4. Ve el mapa con 15 mesas en verde
5. Filtra por ×4 → solo mesas de 4 personas resaltadas
6. Selecciona mesa B2 → elige 45 minutos → confirma
7. ¿Llegó el correo de confirmación con el código?
8. Mesa B2 cambia a amarillo en el mapa (en otro tab sin refresh)
9. Simulación de llegada: va a /checkin?mesa=B2 → ingresa código
10. ¿Check-in exitoso? Mesa pasa a rojo con timer?
11. ¿Llegó correo de check-in confirmado?
12. Espera hasta que queden ~10 min → ¿llegó email de advertencia?
13. Va a Mis Reservas → toca Extender → ¿timer se actualiza?
14. Timer llega a 0 → mesa vuelve a FREE automáticamente
```

### Escenario B — No-show
```
1. Crea reserva con startTime = hace 2 minutos (ajusta la hora)
2. No hagas check-in
3. Espera máximo 30 segundos (el job corre cada 30s)
4. ¿Mesa vuelve a FREE?
5. ¿Llegó email de no-show?
6. DBeaver: reserva tiene status = CANCELLED?
```

### Escenario C — Conflicto de horario
```
1. Usuario A reserva mesa C1 de 3pm a 3:30pm
2. Usuario B intenta reservar mesa C1 de 3:15pm a 3:45pm
3. ¿El sistema rechaza con error de conflicto?
4. ¿El sistema sugiere mesas alternativas del mismo tamaño?
```

### Escenario D — Sin sesión → check-in → redirect
```
1. Cierra sesión
2. Visita /checkin?mesa=A3
3. ¿Redirige a login?
4. Inicia sesión
5. ¿Vuelve a /checkin?mesa=A3 automáticamente?
```

### Escenario E — Extensión rechazada
```
1. Usuario A: mesa A1, 2:00–2:30
2. Usuario B: mesa A1, 2:30–3:00 (reserva el siguiente bloque)
3. Usuario A hace check-in
4. Usuario A intenta extender → ¿sistema lo rechaza?
5. ¿Llega email de extensión rechazada?
```

---

## Bloque 5.2 — PWA config (30min)

`Frontend/public/manifest.json`:
```json
{
  "name": "BLIX — Reserva tu mesa",
  "short_name": "BLIX",
  "description": "Sistema inteligente de gestión de mesas en tiempo real",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0f172a",
  "theme_color": "#1e40af",
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

En `Frontend/index.html`, agrega en `<head>`:
```html
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#1e40af">
<meta name="apple-mobile-web-app-capable" content="yes">
```

---

## Bloque 5.3 — Deploy backend (Railway) (1h)

```bash
cd Backend

# Build TypeScript
npm run build

# Login Railway
railway login

# Init project
railway init
# Nombre: blix-backend

# Set environment variables
railway variables set DATABASE_URL="tu_connection_string_neon"
railway variables set JWT_SECRET="tu_jwt_secret"
railway variables set SENDGRID_API_KEY="SG.xxx"
railway variables set SENDGRID_FROM_EMAIL="tu@email.com"
railway variables set NODE_ENV="production"
railway variables set CLIENT_URL="https://tu-app.vercel.app"

# Deploy
railway up
```

Copia la URL que Railway te da (ej: `https://blix-backend.up.railway.app`).

---

## Bloque 5.4 — Deploy frontend (Vercel) (30min)

```bash
cd Frontend

# Actualiza .env con la URL real del backend
echo "VITE_API_URL=https://blix-backend.up.railway.app" > .env.production
echo "VITE_SOCKET_URL=https://blix-backend.up.railway.app" >> .env.production

# Deploy
vercel

# Responde las preguntas:
# Project name: blix
# Root directory: ./ (o Frontend/ si corres desde Blix/)
# Build command: npm run build
# Output directory: dist
```

Vercel te da una URL tipo `https://blix.vercel.app`.

Actualiza en Railway: `CLIENT_URL = https://blix.vercel.app`

---

## Bloque 5.5 — Pruebas en producción (30min)

Con ambas URLs reales, repite el **Escenario A** completo pero en producción:
- App en `https://blix.vercel.app`
- API en `https://blix-backend.up.railway.app/health`
- Verifica que los WebSockets funcionan (el mapa se actualiza sin refresh)
- Verifica que los correos llegan (revisa spam)
- Prueba desde el celular: ¿se ve bien? ¿funciona el check-in?

---

## Bloque 5.6 — Pulido final (1h)

Lista de cosas a revisar antes de entregar:

**Backend:**
- [ ] Todos los endpoints devuelven mensajes de error claros
- [ ] Ningún endpoint deja información sensible en la respuesta (passwordHash, verifyToken)
- [ ] Los jobs imprimen logs en consola para poder seguir qué hacen
- [ ] `.env.example` creado con todas las variables (sin valores reales)

**Frontend:**
- [ ] Todos los formularios tienen validación visible
- [ ] Los estados de loading están implementados (botones disabled, spinners)
- [ ] Los mensajes de error del API se muestran al usuario
- [ ] El mapa es responsive (se ve bien en móvil)
- [ ] El filtro por tamaño funciona correctamente
- [ ] Las rutas protegidas redirigen a login correctamente
- [ ] La página de verificación (`/verify/:token`) funciona en producción

**General:**
- [ ] `readme.md` actualizado con URL de producción
- [ ] Código sin `console.log` de debug innecesarios
- [ ] `.gitignore` correcto (node_modules, .env, dist ignorados)

---

## 📊 Resumen del cronograma

| Día | Enfoque | Entregable del día |
|-----|---------|-------------------|
| **1** | Schema + Auth + Email | Registro, login, verificación funcionando |
| **2** | Mesas + Reservas + Check-in + Sensor | API core completa y probada |
| **3** | Jobs + WebSockets + Frontend base | Motor de estados + mapa en tiempo real |
| **4** | Frontend completo | Todas las páginas conectadas al backend real |
| **5** | Integración + Tests + Deploy | App en producción, todos los escenarios probados |

---

## 🚨 Reglas de trabajo

1. **No pases al día siguiente sin que las pruebas del día actual pasen.** Un bug de Día 1 que se arrastra al Día 4 se vuelve tres veces más difícil de encontrar.
2. **DBeaver siempre abierto.** Cada vez que hagas una acción en la app, verifica en DBeaver que la base de datos cambió como esperabas.
3. **Dos terminales siempre abiertas:** una para el backend (`npm run dev`), una para el frontend (`npm run dev`).
4. **Thunder Client para el backend, navegador para el frontend.** No intentes probar el backend desde el frontend hasta que el backend pase todas las pruebas de Thunder Client.
5. **Commit al final de cada bloque.** `git add . && git commit -m "Day 1: auth complete"`. Si algo se rompe, tienes punto de retorno.