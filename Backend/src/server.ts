import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createServer } from 'http'
import { initSocket } from './configs/socket'

dotenv.config()

const app = express()
const httpServer = createServer(app)

// Inicializa Socket.io (debe ser antes de las rutas)
const io = initSocket(httpServer)

// Middlewares globales
app.use(cors({ origin: process.env.CLIENT_URL }))
app.use(express.json())

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() })
})

// ── Rutas ──────────────────────────────────────────
import authRoutes        from './routes/auth.routes'
import tableRoutes       from './routes/table.routes'
import reservationRoutes from './routes/reservation.routes'
import checkinRoutes     from './routes/checkin.routes'
import extensionRoutes   from './routes/extension.routes'
import sensorRoutes      from './routes/sensor.routes'
import adminRoutes       from './routes/admin.routes'


app.use('/api/auth',         authRoutes)
app.use('/api/tables',       tableRoutes)
app.use('/api/reservations', reservationRoutes)
app.use('/api/checkin',      checkinRoutes)
app.use('/api/reservations', extensionRoutes)  // /api/reservations/:id/extend
app.use('/api/sensor',       sensorRoutes)
app.use('/api/admin',        adminRoutes)

// WebSocket eventos
io.on('connection', (socket) => {
  console.log(`🔌 Cliente conectado: ${socket.id}`)

  // Admin se une a su sala privada
  socket.on('admin:join', () => {
    socket.join('admin-room')
    console.log(`👑 Admin unido a sala: ${socket.id}`)
  })

  socket.on('disconnect', () => {
    console.log(`❌ Cliente desconectado: ${socket.id}`)
  })
})

// Arrancar servidor
const PORT = process.env.PORT || 3000
httpServer.listen(PORT, () => {
  console.log(`🚀 Servidor BLIX en http://localhost:${PORT}`)
  console.log(`📊 Health: http://localhost:${PORT}/health`)
})