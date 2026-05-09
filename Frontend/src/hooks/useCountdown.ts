import { useState, useEffect, useRef } from 'react'

export function useCountdown(serverSeconds: number | undefined) {
  const [seconds, setSeconds] = useState<number>(serverSeconds ?? 0)

  // Dos refs separados: el valor pendiente y si HAY algo pendiente
  // syncPendingRef = true solo cuando el servidor manda un valor NUEVO
  // Se pone en false inmediatamente después de aplicarlo — evita la oscilación
  const syncValueRef   = useRef<number>(serverSeconds ?? 0)
  const syncPendingRef = useRef<boolean>(false)

  // Cuando serverSeconds cambia, marcar como pendiente
  useEffect(() => {
    if (serverSeconds !== undefined) {
      syncValueRef.current   = serverSeconds
      syncPendingRef.current = true  // "hay un valor nuevo del servidor"
    }
  }, [serverSeconds])

  // Un solo intervalo para toda la vida del componente
  useEffect(() => {
    const id = setInterval(() => {
      setSeconds(prev => {
        // ¿Hay un valor nuevo del servidor esperando?
        if (syncPendingRef.current) {
          syncPendingRef.current = false  // consumir el sync — no volver a aplicarlo
          return syncValueRef.current
        }
        // Countdown normal
        return Math.max(0, prev - 1)
      })
    }, 1000)

    return () => clearInterval(id)
  }, []) // Solo una vez — el intervalo corre toda la vida del componente

  return seconds
}