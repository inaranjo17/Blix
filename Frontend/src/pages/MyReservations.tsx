import { useState, useEffect, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { reservationApi } from '../api/reservation.api'
import { Navbar } from '../components/layout/Navbar'
import { formatTimer } from '../constants/tableStates'
import { useCountdown } from '../hooks/useCountdown'
import type { Reservation } from '../@types'
import axios from 'axios'

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  PENDING:   { label: 'Pendiente',  color: 'bg-yellow-100 text-yellow-800' },
  ACTIVE:    { label: 'Activa',     color: 'bg-green-100 text-green-800' },
  EXTENDED:  { label: 'Extendida',  color: 'bg-blue-100 text-blue-800' },
  COMPLETED: { label: 'Completada', color: 'bg-gray-100 text-gray-600' },
  CANCELLED: { label: 'Cancelada',  color: 'bg-red-100 text-red-700' },
}

// Tarjeta de reserva activa con countdown propio
// Así el botón de extender reacciona al tiempo real sin re-renderizar toda la página
function ActiveReservationCard({
  r,
  extLoading,
  onExtend,
}: {
  r: Reservation
  extLoading: string | null
  onExtend: (id: string) => void
}) {
  const [initialSeconds] = useState(() =>
    Math.max(
      0,
      Math.floor((new Date(r.endTime).getTime() - Date.now()) / 1000)
    )
  )
  const seconds = useCountdown(initialSeconds)

  // El botón solo aparece cuando quedan 10 minutos o menos (600 segundos)
  const canExtend = seconds > 0 && seconds <= 600

  return (
    <div className="bg-white border-2 border-green-300 rounded-xl p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-gray-800">
              Mesa {r.tableId}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium
              ${STATUS_LABELS[r.status]?.color}`}>
              {STATUS_LABELS[r.status]?.label}
            </span>
          </div>
          <p className="text-xs text-gray-500 font-mono">{r.code}</p>
          <p className="text-xs text-gray-500 mt-1">
            Fin: {new Date(r.endTime).toLocaleTimeString('es-CO', {
              hour: '2-digit', minute: '2-digit',
            })}
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs text-gray-400 mb-1">Tiempo restante</p>
          <span className={`font-mono font-bold ${seconds < 300 ? 'text-red-600' : 'text-blix-blue'}`}>
            {formatTimer(seconds)}
          </span>
        </div>
      </div>

      {canExtend ? (
        <button
          onClick={() => onExtend(r.id)}
          disabled={extLoading === r.id}
          className="mt-3 w-full bg-blix-blue text-white text-sm
                     font-medium py-2 rounded-lg hover:bg-blue-700
                     transition disabled:opacity-60"
        >
          {extLoading === r.id ? 'Extendiendo...' : '+ Extender 30 minutos'}
        </button>
      ) : (
        <p className="text-xs text-gray-400 text-center mt-3">
          La opción de extender aparece cuando queden 10 minutos o menos.
        </p>
      )}
    </div>
  )
}

export function MyReservationsPage() {
  const { token } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()

  const [reservations,  setReservations]  = useState<Reservation[]>([])
  const [loading,       setLoading]       = useState(true)
  const [extLoading,    setExtLoading]    = useState<string | null>(null)
  const [cancelLoading, setCancelLoading] = useState<string | null>(null)
  const [toast,         setToast]         = useState('')

  const successCode = (location.state as { successCode?: string })?.successCode

  const fetchReservations = useCallback(async () => {
    if (!token) return
    try {
      const data = await reservationApi.getMy(token)
      setReservations(data)
    } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => { fetchReservations() }, [fetchReservations])

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3500)
  }

  async function handleExtend(reservationId: string) {
    if (!token) return
    setExtLoading(reservationId)
    try {
      await reservationApi.extend(token, reservationId)
      showToast('✅ Reserva extendida +30 minutos')
      await fetchReservations()
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        showToast('❌ ' + (err.response?.data?.error ?? 'No se pudo extender'))
      }
    } finally {
      setExtLoading(null)
    }
  }

  async function handleCancel(reservationId: string) {
    if (!token) return
    setCancelLoading(reservationId)
    try {
      await reservationApi.cancel(token, reservationId)
      showToast('Reserva cancelada')
      await fetchReservations()
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        showToast('❌ ' + (err.response?.data?.error ?? 'No se pudo cancelar'))
      }
    } finally {
      setCancelLoading(null)
    }
  }

  const active  = reservations.filter(r => r.status === 'ACTIVE' || r.status === 'EXTENDED')
  const pending = reservations.filter(r => r.status === 'PENDING')
  const history = reservations.filter(r => r.status === 'COMPLETED' || r.status === 'CANCELLED')

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50
                        bg-gray-800 text-white text-sm px-5 py-2.5
                        rounded-full shadow-lg transition-all">
          {toast}
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-blix-dark mb-2">Mis reservas</h1>

        {successCode && (
          <div className="bg-green-50 border border-green-200 text-green-800
                          rounded-xl px-4 py-3 mb-5 text-sm">
            🎉 Reserva creada exitosamente. Código: <strong>{successCode}</strong>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blix-blue" />
          </div>
        ) : reservations.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg mb-3">No tienes reservas aún</p>
            <button
              onClick={() => navigate('/')}
              className="bg-blix-blue text-white px-5 py-2 rounded-lg
                         text-sm font-medium hover:bg-blue-700 transition"
            >
              Explorar mesas
            </button>
          </div>
        ) : (
          <div className="space-y-6">

            {active.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  En curso
                </h2>
                <div className="space-y-3">
                  {active.map(r => (
                    <ActiveReservationCard
                      key={r.id}
                      r={r}
                      extLoading={extLoading}
                      onExtend={handleExtend}
                    />
                  ))}
                </div>
              </section>
            )}

            {pending.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Próximas
                </h2>
                <div className="space-y-3">
                  {pending.map(r => (
                    <div key={r.id}
                         className="bg-white border border-yellow-200 rounded-xl p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-gray-800">
                              Mesa {r.tableId}
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded-full font-medium
                                            bg-yellow-100 text-yellow-800">
                              Pendiente
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 font-mono">{r.code}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(r.startTime).toLocaleString('es-CO', {
                              dateStyle: 'short', timeStyle: 'short',
                            })}
                            {' '}→{' '}
                            {new Date(r.endTime).toLocaleTimeString('es-CO', {
                              hour: '2-digit', minute: '2-digit',
                            })}
                          </p>
                        </div>
                        <button
                          onClick={() => handleCancel(r.id)}
                          disabled={cancelLoading === r.id}
                          className="text-xs text-red-600 hover:text-red-800
                                     font-medium transition disabled:opacity-50"
                        >
                          {cancelLoading === r.id ? '...' : 'Cancelar'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {history.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Historial
                </h2>
                <div className="space-y-2">
                  {history.map(r => (
                    <div key={r.id}
                         className="bg-white border border-gray-100 rounded-xl px-4 py-3
                                    flex items-center justify-between">
                      <div>
                        <span className="font-medium text-gray-700 text-sm">
                          Mesa {r.tableId}
                        </span>
                        <span className="text-xs text-gray-400 ml-2 font-mono">
                          {r.code}
                        </span>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                        ${STATUS_LABELS[r.status]?.color}`}>
                        {STATUS_LABELS[r.status]?.label}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

          </div>
        )}
      </div>
    </div>
  )
}