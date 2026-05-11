import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { reservationApi } from '../api/reservation.api'
import { Navbar } from '../components/layout/Navbar'
import { DURATIONS } from '../constants/durations'
import type { Duration } from '../constants/durations'
import type { ApiError } from '../@types'
import axios from 'axios'

type Alternative = { id: string; zone: string; capacity: number }

export function ReservePage() {
  const { tableId } = useParams<{ tableId: string }>()
  const { token }   = useAuth()
  const navigate    = useNavigate()

  const [duration,      setDuration]      = useState<Duration>(30)
  const [startTime,     setStartTime]     = useState('')
  const [loading,       setLoading]       = useState(false)
  const [error,         setError]         = useState('')
  const [alternatives,  setAlternatives]  = useState<Alternative[]>([])
  
  const [minDateTime] = useState<string>(() => {
    const d = new Date(Date.now() + 60_000)
    const pad = (n: number) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
  })

  async function handleSubmit() {
    if (!startTime) { setError('Selecciona una hora de inicio'); return }
    if (!token || !tableId) return
    setError(''); setAlternatives([]); setLoading(true)
    try {
      const r = await reservationApi.create(token, {
        tableId,
        startTime: new Date(startTime).toISOString(),
        duration,
      })
      navigate('/mis-reservas', { state: { successCode: r.code, tableId } })
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const d = err.response?.data as ApiError
        if (d?.alternatives?.length) {
          setAlternatives(d.alternatives)
          setError(d.error ?? 'Horario ocupado para esta mesa')
        } else {
          setError(d?.error ?? 'Error al crear la reserva')
        }
      } else { setError('Error inesperado') }
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-blix-bone font-sans">
      <Navbar />
      <div className="max-w-md mx-auto px-4 py-8">

        <button onClick={() => navigate('/mapa')}
          className="flex items-center gap-1.5 text-ui-muted hover:text-blix-red
                     text-sm font-medium mb-5 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M15 19l-7-7 7-7" />
          </svg>
          Volver al mapa
        </button>

        <div className="bg-white rounded-3xl border-2 border-ui-border shadow-lg p-6">

          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blix-carbon rounded-2xl flex items-center
                            justify-center">
              <span className="font-display text-white font-semibold text-lg">
                {tableId}
              </span>
            </div>
            <div>
              <h1 className="font-display text-blix-carbon"
                  style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                Reservar Mesa {tableId}
              </h1>
              <p className="text-ui-muted text-xs mt-0.5">
                Elige tu horario y duración
              </p>
            </div>
          </div>

          {/* Hora */}
          <div className="mb-5">
            <label className="block text-blix-carbon text-sm font-bold mb-1.5">
              Hora de inicio
            </label>
            <input type="datetime-local" value={startTime} min={minDateTime}
              onChange={e => setStartTime(e.target.value)}
              className="w-full border-2 border-ui-border bg-white text-blix-carbon
                         rounded-xl px-4 py-3 text-sm focus:outline-none
                         focus:border-blix-red transition-colors"/>
          </div>

          {/* Duración */}
          <div className="mb-6">
            <label className="block text-blix-carbon text-sm font-bold mb-2">
              Duración
            </label>
            <div className="grid grid-cols-3 gap-2">
              {DURATIONS.map(d => (
                <button key={d.value}
                  onClick={() => setDuration(d.value as Duration)}
                  className={`py-3 rounded-xl text-sm font-bold border-2 transition-all
                    ${duration === d.value
                      ? 'bg-blix-red text-white border-blix-red shadow-md shadow-red-200'
                      : 'bg-white text-blix-carbon border-ui-border hover:border-blix-red'}`}>
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-blix-red/20 text-blix-red
                            rounded-xl px-4 py-3 text-sm font-medium mb-4">
              {error}
            </div>
          )}

          {alternatives.length > 0 && (
            <div className="mb-5">
              <p className="text-sm font-bold text-blix-carbon mb-2">
                Mesas disponibles del mismo tamaño:
              </p>
              <div className="space-y-2">
                {alternatives.map(alt => (
                  <button key={alt.id}
                    onClick={() => { setAlternatives([]); setError(''); navigate(`/reserve/${alt.id}`) }}
                    className="w-full text-left border-2 bg-state-free/5
                               hover:bg-state-free/15 rounded-xl px-4 py-2.5 text-sm
                               font-medium transition-colors"
                    style={{ borderColor: '#06D6A0', color: '#2B2D42' }}>
                    Mesa {alt.id} — Zona {alt.zone} · ×{alt.capacity} personas
                  </button>
                ))}
              </div>
            </div>
          )}

          <button onClick={handleSubmit}
            disabled={loading || !startTime}
            className="w-full bg-blix-red text-white font-bold py-3.5 rounded-xl
                       hover:bg-blix-red-dark transition-all shadow-lg shadow-red-200
                       disabled:opacity-50 disabled:cursor-not-allowed text-sm">
            {loading ? 'Reservando...' : 'Confirmar reserva'}
          </button>

          <p className="text-xs text-ui-muted text-center mt-3">
            Recibirás el código de reserva por correo electrónico
          </p>
        </div>
      </div>
    </div>
  )
}