import { useState, useEffect, useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { reservationApi } from '../api/reservation.api'
import { Navbar } from '../components/layout/Navbar'
import { formatTimer } from '../constants/tableStates'
import { useCountdown } from '../hooks/useCountdown'
import type { Reservation } from '../@types'
import axios from 'axios'

const STATUS_STYLE: Record<string, { label: string; cls: string }> = {
  PENDING:   { label: 'Pendiente',  cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  ACTIVE:    { label: 'Activa',     cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  EXTENDED:  { label: 'Extendida',  cls: 'bg-blue-50 text-blue-700 border-blue-200' },
  COMPLETED: { label: 'Completada', cls: 'bg-gray-50 text-gray-500 border-gray-200' },
  CANCELLED: { label: 'Cancelada',  cls: 'bg-red-50 text-red-600 border-red-200' },
}

function ActiveCard({
  r, extLoading, onExtend,
}: {
  r: Reservation; extLoading: string | null; onExtend: (id: string) => void
}) {
  const [init] = useState(() =>
    Math.max(0, Math.floor((new Date(r.endTime).getTime() - Date.now()) / 1000))
  )
  const secs      = useCountdown(init)
  const canExtend = secs > 0 && secs <= 600

  return (
    <div className="bg-white rounded-2xl border-2 p-5 shadow-sm"
         style={{ borderColor: '#06D6A0' }}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-9 h-9 bg-blix-carbon rounded-xl flex items-center
                            justify-center">
              <span className="font-display text-white font-semibold text-sm">
                {r.tableId}
              </span>
            </div>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border
              ${STATUS_STYLE[r.status]?.cls}`}>
              {STATUS_STYLE[r.status]?.label}
            </span>
          </div>
          <p className="text-xs text-ui-muted font-mono mt-1">{r.code}</p>
          <p className="text-xs text-ui-muted mt-0.5">
            Hasta las {new Date(r.endTime).toLocaleTimeString('es-CO', {
              hour: '2-digit', minute: '2-digit'
            })}
          </p>
        </div>

        <div className="text-right shrink-0">
          <p className="text-xs text-ui-muted mb-1">Tiempo restante</p>
          <span className={`font-display font-semibold ${secs < 300 ? 'text-blix-red animate-pulse' : 'text-blix-carbon'}`}
                style={{ fontSize: '1.6rem', lineHeight: 1 }}>
            {formatTimer(secs)}
          </span>
        </div>
      </div>

      {canExtend ? (
        <button onClick={() => onExtend(r.id)} disabled={extLoading === r.id}
          className="mt-4 w-full bg-blix-carbon text-white font-bold text-sm
                     py-2.5 rounded-xl hover:bg-blix-charcoal transition-all
                     disabled:opacity-50">
          {extLoading === r.id ? 'Extendiendo...' : '+ Extender 30 minutos'}
        </button>
      ) : (
        <p className="text-xs text-ui-muted text-center mt-3">
          La opción de extender aparece cuando queden 10 min o menos
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

  const fetch = useCallback(async () => {
    if (!token) return
    try {
      const d = await reservationApi.getMy(token)
      setReservations(d)
    } finally { setLoading(false) }
  }, [token])

  useEffect(() => { fetch() }, [fetch])

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3500)
  }

  async function handleExtend(id: string) {
    if (!token) return
    setExtLoading(id)
    try {
      await reservationApi.extend(token, id)
      showToast('✓ Reserva extendida +30 minutos')
      await fetch()
    } catch (err: unknown) {
      showToast('✗ ' + (axios.isAxiosError(err)
        ? err.response?.data?.error ?? 'No se pudo extender'
        : 'Error'))
    } finally { setExtLoading(null) }
  }

  async function handleCancel(id: string) {
    if (!token) return
    setCancelLoading(id)
    try {
      await reservationApi.cancel(token, id)
      showToast('Reserva cancelada')
      await fetch()
    } catch (err: unknown) {
      showToast('✗ ' + (axios.isAxiosError(err)
        ? err.response?.data?.error ?? 'No se pudo cancelar'
        : 'Error'))
    } finally { setCancelLoading(null) }
  }

  const active  = reservations.filter(r => r.status === 'ACTIVE' || r.status === 'EXTENDED')
  const pending = reservations.filter(r => r.status === 'PENDING')
  const history = reservations.filter(r => r.status === 'COMPLETED' || r.status === 'CANCELLED')

  return (
    <div className="min-h-screen bg-blix-bone font-sans">
      <Navbar />

      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-blix-carbon
                        text-white text-sm font-medium px-5 py-2.5 rounded-full
                        shadow-xl transition-all font-sans">
          {toast}
        </div>
      )}

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-blix-carbon"
              style={{ fontSize: '1.9rem', fontWeight: 600 }}>
            Mis reservas
          </h1>
          <button onClick={() => navigate('/mapa')}
            className="text-sm text-ui-muted hover:text-blix-red transition-colors font-medium">
            ← Mapa
          </button>
        </div>

        {successCode && (
          <div className="bg-emerald-50 border-2 border-emerald-200 text-emerald-800
                          rounded-2xl px-4 py-3 mb-5 text-sm font-medium">
            🎉 ¡Reserva creada! Código: <strong className="font-mono">{successCode}</strong>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2
                            border-blix-red" />
          </div>
        ) : reservations.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-ui-border/50 rounded-full
                            flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-ui-muted" fill="none"
                   stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-blix-carbon font-display text-xl mb-1">
              Sin reservas aún
            </p>
            <p className="text-ui-muted text-sm mb-5">
              Explora el mapa y reserva tu mesa
            </p>
            <button onClick={() => navigate('/mapa')}
              className="bg-blix-red text-white font-bold px-6 py-2.5 rounded-xl
                         hover:bg-blix-red-dark transition-all shadow-lg shadow-red-200 text-sm">
              Explorar mesas
            </button>
          </div>
        ) : (
          <div className="space-y-6">

            {active.length > 0 && (
              <section>
                <h2 className="text-xs font-sans font-bold text-ui-muted uppercase
                               tracking-widest mb-3">
                  En curso
                </h2>
                <div className="space-y-3">
                  {active.map(r => (
                    <ActiveCard key={r.id} r={r}
                                extLoading={extLoading} onExtend={handleExtend} />
                  ))}
                </div>
              </section>
            )}

            {pending.length > 0 && (
              <section>
                <h2 className="text-xs font-sans font-bold text-ui-muted uppercase
                               tracking-widest mb-3">
                  Próximas
                </h2>
                <div className="space-y-3">
                  {pending.map(r => (
                    <div key={r.id} className="bg-white rounded-2xl border-2
                                               border-amber-200 p-4 shadow-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-8 h-8 bg-blix-carbon rounded-xl
                                            flex items-center justify-center">
                              <span className="font-display text-white text-xs font-semibold">
                                {r.tableId}
                              </span>
                            </div>
                            <span className={`text-xs font-bold px-2 py-0.5
                                            rounded-full border ${STATUS_STYLE.PENDING.cls}`}>
                              Pendiente
                            </span>
                          </div>
                          <p className="text-xs text-ui-muted font-mono">{r.code}</p>
                          <p className="text-xs text-ui-muted mt-0.5">
                            {new Date(r.startTime).toLocaleString('es-CO', {
                              dateStyle: 'short', timeStyle: 'short'
                            })} → {new Date(r.endTime).toLocaleTimeString('es-CO', {
                              hour: '2-digit', minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <button onClick={() => handleCancel(r.id)}
                          disabled={cancelLoading === r.id}
                          className="text-xs text-ui-muted hover:text-blix-red
                                     font-semibold transition-colors disabled:opacity-50">
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
                <h2 className="text-xs font-sans font-bold text-ui-muted uppercase
                               tracking-widest mb-3">
                  Historial
                </h2>
                <div className="space-y-2">
                  {history.map(r => (
                    <div key={r.id} className="bg-white rounded-xl border-2
                                               border-ui-border px-4 py-3
                                               flex items-center justify-between">
                      <div>
                        <span className="font-sans font-semibold text-blix-carbon text-sm">
                          Mesa {r.tableId}
                        </span>
                        <span className="text-xs text-ui-muted ml-2 font-mono">
                          {r.code}
                        </span>
                      </div>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full
                                        border ${STATUS_STYLE[r.status]?.cls}`}>
                        {STATUS_STYLE[r.status]?.label}
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