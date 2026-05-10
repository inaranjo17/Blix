import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import axios from 'axios'

export function LoginPage() {
  const { login }   = useAuth()
  const navigate    = useNavigate()
  const [params]    = useSearchParams()
  // ← default a /mapa porque / ahora es la landing
  const redirect    = params.get('redirect') ?? '/mapa'

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
      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.error ?? 'Error al iniciar sesión'
          : 'Error inesperado'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-blix-bone flex font-sans">

      {/* Panel izquierdo — visual */}
      <div className="hidden lg:flex lg:w-1/2 bg-blix-charcoal flex-col
                      items-center justify-center p-12 relative overflow-hidden">

        <div className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(ellipse at 20% 20%, rgba(239,35,60,0.25) 0%, transparent 55%),
              radial-gradient(ellipse at 80% 80%, rgba(6,214,160,0.15) 0%, transparent 55%)`,
          }}
        />

        <div className="relative z-10 max-w-sm text-center">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="w-12 h-12 bg-blix-red rounded-2xl flex items-center
                            justify-center shadow-2xl">
              <svg width="24" height="24" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="1" width="6" height="6" rx="1.5" fill="white"/>
                <rect x="9" y="1" width="6" height="6" rx="1.5" fill="white"/>
                <rect x="1" y="9" width="6" height="6" rx="1.5" fill="white"/>
                <rect x="9" y="9" width="6" height="6" rx="1.5" fill="white" opacity="0.35"/>
              </svg>
            </div>
          </div>

          <h2 className="font-display text-white mb-3"
              style={{ fontSize: '2.4rem', fontWeight: 600, lineHeight: 1.1 }}>
            Reserva tu mesa <span className="italic text-blix-red">antes</span> de llegar
          </h2>

          <p className="text-white/50 text-sm leading-relaxed mb-10">
            Consulta el mapa en tiempo real y asegura tu lugar en la plazoleta
            con solo unos toques.
          </p>

          {/* Mini stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: '15', label: 'Mesas' },
              { value: '3',  label: 'Zonas' },
              { value: '<1s', label: 'Tiempo real' },
            ].map(s => (
              <div key={s.label}
                   className="bg-white/5 border border-white/10 rounded-2xl p-3">
                <div className="font-display text-white text-xl font-semibold">
                  {s.value}
                </div>
                <div className="text-white/40 text-xs mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Panel derecho — formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">

          {/* Logo mobile */}
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-blix-red rounded-lg flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="1" width="6" height="6" rx="1.5" fill="white"/>
                <rect x="9" y="1" width="6" height="6" rx="1.5" fill="white"/>
                <rect x="1" y="9" width="6" height="6" rx="1.5" fill="white"/>
              </svg>
            </div>
            <span className="font-sans font-black text-blix-carbon text-lg">BLIX</span>
          </Link>

          <h1 className="font-display text-blix-carbon mb-1"
              style={{ fontSize: '2rem', fontWeight: 600 }}>
            Bienvenido de nuevo
          </h1>
          <p className="text-ui-muted text-sm mb-8">
            Inicia sesión para reservar tu mesa
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-blix-carbon text-sm font-semibold mb-1.5">
                Correo electrónico
              </label>
              <input
                type="email" value={email} required
                onChange={e => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full border-2 border-ui-border bg-white text-blix-carbon
                           placeholder-ui-muted rounded-xl px-4 py-3 text-sm
                           focus:outline-none focus:border-blix-red transition-colors"
              />
            </div>

            <div>
              <label className="block text-blix-carbon text-sm font-semibold mb-1.5">
                Contraseña
              </label>
              <input
                type="password" value={password} required
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border-2 border-ui-border bg-white text-blix-carbon
                           placeholder-ui-muted rounded-xl px-4 py-3 text-sm
                           focus:outline-none focus:border-blix-red transition-colors"
              />
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-blix-red/20 text-blix-red
                              rounded-xl px-4 py-3 text-sm font-medium">
                {error}
              </div>
            )}

            <button
              type="submit" disabled={loading}
              className="w-full bg-blix-red text-white font-bold py-3.5 rounded-xl
                         hover:bg-blix-red-dark transition-all shadow-lg shadow-red-200
                         disabled:opacity-50 disabled:cursor-not-allowed text-sm mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10"
                      stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Ingresando...
                </span>
              ) : 'Iniciar sesión'}
            </button>
          </form>

          <p className="text-center text-ui-muted text-sm mt-6">
            ¿No tienes cuenta?{' '}
            <Link to="/register"
                  className="text-blix-red font-semibold hover:text-blix-red-dark transition">
              Regístrate gratis
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}