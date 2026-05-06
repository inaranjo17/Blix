import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { io, type Socket } from 'socket.io-client'

const SocketContext = createContext<Socket | null>(null)

export function SocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState(null as Socket | null)

  useEffect(() => {
    const s = io(import.meta.env.VITE_SOCKET_URL, {
      transports: ['websocket', 'polling'],
    })

    s.on('connect', () => {
      console.log('[Socket] Conectado:', s.id)
    })

    s.on('disconnect', () => {
      console.log('[Socket] Desconectado')
    })

    Promise.resolve().then(() => setSocket(s))

    return () => {
      s.disconnect()
    }
  }, [])

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}

export function useSocket() {
  return useContext(SocketContext)
}