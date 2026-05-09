import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirect = searchParams.get('redirect') ?? '/'

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate(redirect, { replace: true })
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error ?? 'Error al iniciar sesión')
      } else {
        setError('Error inesperado')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-blix-dark flex">

      {/* Panel izquierdo — visual */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden
                      bg-gradient-to-br from-blix-dark via-[#1e2d5e] to-[#0c1f4a]
                      flex-col items-center justify-center p-12">

        {/* Patrón de fondo */}
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f59e0b' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Mini mapa decorativo */}
        <div className="relative z-10 w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-blix-amber/10 border border-blix-amber/20
                            rounded-full px-4 py-1.5 mb-4">
              <div className="w-2 h-2 rounded-full bg-blix-amber animate-pulse" />
              <span className="text-blix-amber text-xs font-semibold tracking-widest uppercase">
                En vivo
              </span>
            </div>
            <h2 className="text-white text-3xl font-bold mb-2">
              Plazoleta de comidas
            </h2>
            <p className="text-gray-400 text-sm">
              Ve la disponibilidad en tiempo real y reserva tu mesa en segundos.
            </p>
          </div>

          {/* Mini mapa decorativo */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
            <div className="grid grid-cols-5 gap-1.5 mb-2">
              {[
                { color: 'bg-green-500', pulse: true },
                { color: 'bg-yellow-400', pulse: false },
                { color: 'bg-green-500', pulse: true },
                { color: 'bg-red-500', pulse: false },
                { color: 'bg-green-500', pulse: true },
                { color: 'bg-green-500', pulse: true },
                { color: 'bg-blue-500', pulse: false },
                { color: 'bg-green-500', pulse: true },
                { color: 'bg-green-500', pulse: true },
                { color: 'bg-yellow-400', pulse: false },
                { color: 'bg-red-500', pulse: false },
                { color: 'bg-green-500', pulse: true },
                { color: 'bg-green-500', pulse: true },
                { color: 'bg-blue-500', pulse: false },
                { color: 'bg-green-500', pulse: true },
              ].map((t, i) => (
                <div
                  key={i}
                  className={`h-8 rounded-lg ${t.color} bg-opacity-80
                    ${t.pulse ? 'animate-pulse-soft' : ''}`}
                />
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500 px-1">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500" /> 10 libres
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500" /> 3 en uso
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-yellow-400" /> 2 reservadas
              </span>
            </div>
          </div>

          {/* Features */}
          <div className="mt-6 space-y-3">
            {[
              { icon: '⚡', text: 'Mapa en tiempo real sin recargar' },
              { icon: '📱', text: 'Check-in con QR al llegar a tu mesa' },
              { icon: '📧', text: 'Notificaciones automáticas por correo' },
            ].map(f => (
              <div key={f.text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blix-amber/10 flex items-center justify-center text-base">
                  {f.icon}
                </div>
                <span className="text-gray-300 text-sm">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* BLIX logo bottom */}
        <div className="absolute bottom-8 flex items-center gap-2 opacity-30">
          <div className="w-5 h-5 bg-blix-amber rounded-md" />
          <span className="text-white font-bold text-sm">BLIX</span>
        </div>
      </div>

      {/* Panel derecho — formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">

          {/* Logo mobile */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-blix-amber rounded-lg flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="1" width="6" height="6" rx="1.5" fill="#0f172a"/>
                <rect x="9" y="1" width="6" height="6" rx="1.5" fill="#0f172a"/>
                <rect x="1" y="9" width="6" height="6" rx="1.5" fill="#0f172a"/>
                <rect x="9" y="9" width="6" height="6" rx="1.5" fill="#0f172a" opacity="0.4"/>
              </svg>
            </div>
            <span className="text-white font-bold text-lg">BLIX</span>
          </div>

          <h1 className="text-white text-2xl font-bold mb-1">Bienvenido de nuevo</h1>
          <p className="text-gray-400 text-sm mb-7">
            Inicia sesión para reservar tu mesa
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1.5">
                Correo electrónico
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-600
                           rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2
                           focus:ring-blix-amber/50 focus:border-blix-amber/50 transition"
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1.5">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-600
                           rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2
                           focus:ring-blix-amber/50 focus:border-blix-amber/50 transition"
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400
                              rounded-xl px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blix-amber text-blix-dark font-bold py-3 rounded-xl
                         hover:bg-blix-amber-light transition-all shadow-lg shadow-amber-500/20
                         disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Ingresando...
                </span>
              ) : 'Iniciar sesión'}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-blix-amber hover:text-blix-amber-light font-semibold transition">
              Regístrate gratis
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}