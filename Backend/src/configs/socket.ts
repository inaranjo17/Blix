import { Server } from 'socket.io'
import { Server as HttpServer } from 'http'

let io: Server

export function initSocket(httpServer: HttpServer): Server {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ['GET', 'POST'],
    },
  })
  return io
}

export function getIO(): Server {
  if (!io) throw new Error('Socket.io no ha sido inicializado')
  return io
}