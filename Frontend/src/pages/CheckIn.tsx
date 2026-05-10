import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { reservationApi } from '../api/reservation.api'
import { Navbar } from '../components/layout/Navbar'
import { useCountdown } from '../hooks/useCountdown'
import axios from 'axios'

export function CheckInPage() {
  const [params]   = useSearchParams()
  const mesaParam  = params.get('mesa') ?? ''
  const { token }  = useAuth()
  const navigate   = useNavigate()

  const [mesa,    setMesa]    = useState(mesaParam)
  const [code,    setCode]    = useState('')
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState('')
  const [success, setSuccess] = useState<{
    message: string; remainingSeconds: number
  } | null>(null)

  async function handleCheckin() {
    if (!mesa.trim() || !code.trim()) {
      setError('Completa la mesa y el código')
      return
    }
    if (!token) return
    setError(''); setLoading(true)
    try {
      const r = await reservationApi.checkin(token, {
        tableId: mesa.trim().toUpperCase(),
        code:    code.trim().toUpperCase(),
      })
      setSuccess(r)
    } catch (err: unknown) {
      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.error ?? 'Check-in fallido'
          : 'Error inesperado'
      )
    } finally { setLoading(false) }
  }

  if (success) {
    return <SuccessScreen mesa={mesa} remaining={success.remainingSeconds}
                          onMapa={() => navigate('/mapa')}
                          onReservas={() => navigate('/mis-reservas')} />
  }

  return (
    <div className="min-h-screen bg-blix-bone font-sans">
      <Navbar />
      <div className="max-w-md mx-auto px-4 py-8">

        {/* Header */}
        <div className="text-center mb-7">
          <div className="w-16 h-16 bg-blix-carbon rounded-2xl flex items-center
                          justify-center mx-auto mb-4 shadow-xl">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor"
                 viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h1 className="font-display text-blix-carbon"
              style={{ fontSize: '1.9rem', fontWeight: 600 }}>
            Confirmar llegada
          </h1>
          <p className="text-ui-muted text-sm mt-1">
            Ingresa tu código para activar la mesa
          </p>
        </div>

        <div className="bg-white rounded-3xl border-2 border-ui-border shadow-lg p-6">

          <div className="mb-4">
            <label className="block text-blix-carbon text-sm font-bold mb-1.5">
              Mesa
            </label>
            <input type="text" value={mesa}
              onChange={e => setMesa(e.target.value)}
              placeholder="Ej: A3" className="w-full border-2 border-ui-border bg-white
              text-blix-carbon placeholder-ui-muted rounded-xl px-4 py-3 text-sm uppercase
              focus:outline-none focus:border-blix-red transition-colors tracking-widest"/>
            {mesaParam && (
              <p className="text-xs mt-1 font-medium" style={{ color: '#06D6A0' }}>
                ✓ Mesa detectada desde el QR
              </p>
            )}
          </div>

          <div className="mb-6">
            <label className="block text-blix-carbon text-sm font-bold mb-1.5">
              Código de reserva
            </label>
            <input type="text" value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="BLIX-A3-7294"
              className="w-full border-2 border-ui-border bg-white text-blix-carbon
                         placeholder-ui-muted rounded-xl px-4 py-3 text-sm uppercase
                         font-mono tracking-widest focus:outline-none
                         focus:border-blix-red transition-colors"/>
            <p className="text-xs text-ui-muted mt-1">
              Encuéntralo en el correo de confirmación
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-blix-red/20 text-blix-red
                            rounded-xl px-4 py-3 text-sm font-medium mb-4">
              {error}
            </div>
          )}

          <button onClick={handleCheckin} disabled={loading}
            className="w-full bg-blix-red text-white font-bold py-3.5 rounded-xl
                       hover:bg-blix-red-dark transition-all shadow-lg shadow-red-200
                       disabled:opacity-50 text-sm">
            {loading ? 'Verificando...' : 'Confirmar llegada'}
          </button>
        </div>
      </div>
    </div>
  )
}

function SuccessScreen({ mesa, remaining, onMapa, onReservas }: {
  mesa: string; remaining: number
  onMapa: () => void; onReservas: () => void
}) {
  const [init] = useState(remaining)
  const secs   = useCountdown(init)
  const mins   = Math.floor(secs / 60)
  const s      = secs % 60

  return (
    <div className="min-h-screen bg-blix-bone font-sans">
      <Navbar />
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl border-2 border-ui-border
                        shadow-xl p-8 text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center
                          mx-auto mb-5 border-4"
               style={{ backgroundColor: '#06D6A0', borderColor: '#06D6A0' }}>
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor"
                 viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2 className="font-display text-blix-carbon mb-1"
              style={{ fontSize: '2rem', fontWeight: 600 }}>
            ¡Check-in exitoso!
          </h2>
          <p className="text-ui-muted text-sm mb-4">
            Mesa <strong className="text-blix-carbon">{mesa.toUpperCase()}</strong> activa
          </p>

          {/* Timer grande */}
          <div className="bg-blix-bone rounded-2xl p-5 mb-5 border-2 border-ui-border">
            <p className="text-ui-muted text-xs uppercase tracking-widest mb-1">
              Tiempo restante
            </p>
            <div className={`font-display font-semibold ${secs < 300 ? 'text-blix-red animate-pulse' : 'text-blix-carbon'}`}
                 style={{ fontSize: '3rem', lineHeight: 1 }}>
              {mins}:{s.toString().padStart(2, '0')}
            </div>
          </div>

          <p className="text-xs text-ui-muted mb-6 leading-relaxed">
            Recibirás un aviso por correo cuando queden 10 y 5 minutos.
            Puedes extender desde <strong>Mis reservas</strong>.
          </p>

          <div className="flex gap-2">
            <button onClick={onMapa}
              className="flex-1 border-2 border-ui-border text-blix-carbon
                         font-semibold py-3 rounded-xl hover:border-blix-red
                         hover:text-blix-red transition-all text-sm">
              Ver mapa
            </button>
            <button onClick={onReservas}
              className="flex-1 bg-blix-red text-white font-bold py-3 rounded-xl
                         hover:bg-blix-red-dark transition-all shadow-lg
                         shadow-red-200 text-sm">
              Mis reservas
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}