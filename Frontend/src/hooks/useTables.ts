import { useState, useEffect } from 'react'
import { useSocket } from '../context/SocketContext'
import { tableApi } from '../api/table.api'
import type { Table } from '../@types'

export function useTables() {
  const [tables,  setTables]  = useState<Table[]>([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)
  const socket = useSocket()

  // Carga inicial — calcula timer para mesas ya ocupadas
  useEffect(() => {
    tableApi
      .getAll()
      .then(data => {
        const now = Date.now()

        // Para cada mesa LEGITIMATELY_OCCUPIED, calcular el timer
        // desde la reserva ACTIVE incluida en la respuesta del backend
        // Esto evita el 0:00 mientras llega el primer WebSocket timer_update
        const tablesWithTimer = data.map(table => {
          if (
            table.state === 'LEGITIMATELY_OCCUPIED' &&
            table.reservations &&
            table.reservations.length > 0
          ) {
            const activeRes = table.reservations.find(
              r => r.status === 'ACTIVE' || r.status === 'EXTENDED'
            )
            if (activeRes) {
              const remaining = Math.max(
                0,
                Math.floor((new Date(activeRes.endTime).getTime() - now) / 1000)
              )
              return { ...table, timer: remaining }
            }
          }
          return table
        })

        setTables(tablesWithTimer)
      })
      .catch(() => setError('No se pudo cargar el mapa'))
      .finally(() => setLoading(false))
  }, [])

  // Suscripción a eventos WebSocket en tiempo real
  useEffect(() => {
    if (!socket) return

    const onStateChanged = (data: {
      tableId: string
      newState: Table['state']
      timer?: number
    }) => {
      setTables(prev =>
        prev.map(t =>
          t.id === data.tableId
            ? { ...t, state: data.newState, timer: data.timer ?? t.timer }
            : t
        )
      )
    }

    const onTimerUpdate = (data: {
      tableId: string
      remainingSeconds: number
    }) => {
      setTables(prev =>
        prev.map(t =>
          t.id === data.tableId
            ? { ...t, timer: data.remainingSeconds }
            : t
        )
      )
    }

    socket.on('table:state_changed', onStateChanged)
    socket.on('table:timer_update',  onTimerUpdate)

    return () => {
      socket.off('table:state_changed', onStateChanged)
      socket.off('table:timer_update',  onTimerUpdate)
    }
  }, [socket])

  return { tables, loading, error }
}