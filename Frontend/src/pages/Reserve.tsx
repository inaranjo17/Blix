import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { reservationApi } from '../api/reservation.api'
import { Navbar } from '../components/layout/Navbar'
import { DURATIONS } from '../constants/durations'
import type { Duration } from '../constants/durations'
import type { ApiError } from '../@types'
import axios from 'axios'

// Tipo definido fuera del componente — evita el problema del genérico multilinea
type Alternative = {
  id: string
  zone: string
  capacity: number
}

export function ReservePage() {
  const { tableId } = useParams<{ tableId: string }>()
  const { token }   = useAuth()
  const navigate    = useNavigate()

  const [duration,      setDuration]      = useState<Duration>(30)
  const [startTime,     setStartTime]     = useState('')
  const [loading,       setLoading]       = useState(false)
  const [error,         setError]         = useState('')

  const [alternatives, setAlternatives] = useState<Alternative[]>([])

  // ✅ useState lazy initializer — Date.now() se ejecuta una sola vez al montar,
  // no en cada re-render. React 19 lo permite porque es un initializer, no render.
  const [minDateTime] = useState<string>(() =>
    new Date(Date.now() + 60_000).toISOString().slice(0, 16)
  )

  async function handleSubmit() {
    if (!startTime) {
      setError('Selecciona una hora de inicio')
      return
    }
    if (!token || !tableId) return

    setError('')
    setAlternatives([])
    setLoading(true)

    try {
      const reservation = await reservationApi.create(token, {
        tableId,
        startTime: new Date(startTime).toISOString(),
        duration,
      })
      navigate('/mis-reservas', {
        state: { successCode: reservation.code, tableId },
      })
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const data = err.response?.data as ApiError
        if (data?.alternatives && data.alternatives.length > 0) {
          setAlternatives(data.alternatives)
          // ✅ Corregido: data.error (no data.message — ApiError no tiene .message)
          setError(data.error ?? 'Horario ocupado para esta mesa')
        } else {
          setError(data?.error ?? 'Error al crear la reserva')
        }
      } else {
        setError('Error inesperado')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-md mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/')}
          className="text-blix-blue text-sm mb-4 hover:underline flex items-center gap-1"
        >
          ← Volver al mapa
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h1 className="text-xl font-bold text-blix-dark mb-1">
            Reservar Mesa {tableId}
          </h1>
          <p className="text-gray-500 text-sm mb-6">
            Elige cuándo y por cuánto tiempo necesitas la mesa.
          </p>

          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hora de inicio
            </label>
            <input
              type="datetime-local"
              value={startTime}
              min={minDateTime}
              onChange={e => setStartTime(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5
                         focus:outline-none focus:ring-2 focus:ring-blix-blue transition"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duración
            </label>
            <div className="grid grid-cols-3 gap-2">
              {DURATIONS.map(d => (
                <button
                  key={d.value}
                  onClick={() => setDuration(d.value as Duration)}
                  className={`
                    py-2.5 rounded-lg text-sm font-medium border transition
                    ${duration === d.value
                      ? 'bg-blix-blue text-white border-blix-blue'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-blix-blue'}
                  `}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700
                            rounded-lg px-4 py-3 text-sm mb-4">
              {error}
            </div>
          )}

          {alternatives.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Mesas disponibles del mismo tamaño:
              </p>
              <div className="space-y-2">
                {alternatives.map(alt => (
                  <button
                    key={alt.id}
                    onClick={() => {
                      setAlternatives([])
                      setError('')
                      navigate(`/reserve/${alt.id}`)
                    }}
                    className="w-full text-left border border-green-300 bg-green-50
                               hover:bg-green-100 text-green-800 rounded-lg px-4 py-2.5
                               text-sm transition"
                  >
                    Mesa {alt.id} — Zona {alt.zone} · ×{alt.capacity} personas
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading || !startTime}
            className="w-full bg-blix-blue text-white font-semibold py-2.5
                       rounded-lg hover:bg-blue-700 transition
                       disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Reservando...' : 'Confirmar reserva'}
          </button>

          <p className="text-xs text-gray-400 text-center mt-3">
            Recibirás un código de reserva por correo electrónico.
          </p>
        </div>
      </div>
    </div>
  )
}