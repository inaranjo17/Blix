import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { reservationApi } from '../api/reservation.api'
import { Navbar } from '../components/layout/Navbar'
import axios from 'axios'

export function CheckInPage() {
  const [searchParams] = useSearchParams()
  const mesaParam  = searchParams.get('mesa') ?? ''
  const { token }  = useAuth()
  const navigate   = useNavigate()

  const [mesa,    setMesa]    = useState(mesaParam)
  const [code,    setCode]    = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [success, setSuccess] = useState<{
    message: string
    remainingSeconds: number
  } | null>(null)

  async function handleCheckin() {
    if (!mesa.trim() || !code.trim()) {
      setError('Completa la mesa y el código')
      return
    }
    if (!token) return

    setError('')
    setLoading(true)

    try {
      const result = await reservationApi.checkin(token, {
        tableId: mesa.trim().toUpperCase(),
        code: code.trim().toUpperCase(),
      })
      setSuccess(result)
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error ?? 'Check-in fallido')
      } else {
        setError('Error inesperado')
      }
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    const minutes = Math.floor(success.remainingSeconds / 60)
    const secs    = success.remainingSeconds % 60

    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-md mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              ¡Check-in exitoso!
            </h2>
            <p className="text-gray-500 mb-2">
              Mesa <strong>{mesa.toUpperCase()}</strong> activa.
            </p>
            <div className="text-3xl font-mono font-bold text-blix-blue mb-6">
              {minutes}:{secs.toString().padStart(2, '0')} restantes
            </div>
            <p className="text-sm text-gray-400 mb-6">
              Recibirás avisos por correo cuando queden 10 y 5 minutos.
              Puedes extender desde <strong>Mis reservas</strong>.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/')}
                className="flex-1 border border-gray-300 text-gray-700 py-2.5
                           rounded-lg hover:bg-gray-50 transition text-sm font-medium"
              >
                Ver mapa
              </button>
              <button
                onClick={() => navigate('/mis-reservas')}
                className="flex-1 bg-blix-blue text-white py-2.5 rounded-lg
                           hover:bg-blue-700 transition text-sm font-medium"
              >
                Mis reservas
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-md mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">📱</div>
            <h1 className="text-xl font-bold text-blix-dark">Check-in</h1>
            <p className="text-gray-500 text-sm mt-1">
              Confirma tu llegada ingresando el código de tu reserva.
            </p>
          </div>

          {/* Mesa */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Número de mesa
            </label>
            <input
              type="text"
              value={mesa}
              onChange={e => setMesa(e.target.value)}
              placeholder="Ej: A3"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5
                         focus:outline-none focus:ring-2 focus:ring-blix-blue
                         transition uppercase"
            />
            {mesaParam && (
              <p className="text-xs text-green-600 mt-1">
                ✓ Mesa detectada desde el QR
              </p>
            )}
          </div>

          {/* Código */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Código de reserva
            </label>
            <input
              type="text"
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="Ej: BLIX-A3-7294"
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5
                         focus:outline-none focus:ring-2 focus:ring-blix-blue
                         transition uppercase font-mono"
            />
            <p className="text-xs text-gray-400 mt-1">
              Encuéntralo en el correo de confirmación.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700
                            rounded-lg px-4 py-3 text-sm mb-4">
              {error}
            </div>
          )}

          <button
            onClick={handleCheckin}
            disabled={loading}
            className="w-full bg-blix-blue text-white font-semibold py-2.5
                       rounded-lg hover:bg-blue-700 transition
                       disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Verificando...' : 'Confirmar llegada'}
          </button>
        </div>
      </div>
    </div>
  )
}