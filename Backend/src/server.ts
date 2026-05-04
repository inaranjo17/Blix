import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createServer } from 'http'
import { Server } from 'socket.io'

dotenv.config()

const app = express()
const httpServer = createServer(app)

export const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST'],
  },
})

// Middlewares globales
app.use(cors({ origin: process.env.CLIENT_URL }))
app.use(express.json())

// Health check — prueba rápida para saber si el servidor vive
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() })
})

// Rutas
import authRoutes from './routes/auth.routes'
app.use('/api/auth', authRoutes)

// WebSocket
io.on('connection', (socket) => {
  console.log(`🔌 Cliente conectado: ${socket.id}`)
  socket.on('disconnect', () => {
    console.log(`❌ Cliente desconectado: ${socket.id}`)
  })
})

// Arrancar servidor
const PORT = process.env.PORT || 3000
httpServer.listen(PORT, () => {
  console.log(`🚀 Servidor BLIX corriendo en http://localhost:${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/health`)
})