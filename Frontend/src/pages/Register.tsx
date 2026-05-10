import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '../api/auth.api'
import axios from 'axios'

export function RegisterPage() {
  const navigate = useNavigate()
  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [phone,    setPhone]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [success,  setSuccess]  = useState(false)
  const [loading,  setLoading]  = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await authApi.register({ name, email, phone, password })
      setSuccess(true)
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const data = err.response?.data
        if (data?.error && typeof data.error === 'object') {
          setError(Object.values(data.error).flat().join(' · ') as string)
        } else {
          setError(data?.error ?? 'Error al registrar')
        }
      } else {
        setError('Error inesperado')
      }
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-blix-bone flex items-center
                      justify-center p-6 font-sans">
        <div className="bg-white rounded-3xl border-2 border-ui-border
                        shadow-xl w-full max-w-md p-10 text-center">
          <div className="w-20 h-20 bg-state-free/10 border-2 border-state-free/30
                          rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-9 h-9" style={{ color: '#06D6A0' }}
                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="font-display text-blix-carbon mb-2"
              style={{ fontSize: '2rem', fontWeight: 600 }}>
            ¡Revisa tu correo!
          </h2>
          <p className="text-ui-muted text-sm mb-1">
            Enviamos un enlace de verificación a
          </p>
          <p className="text-blix-red font-semibold mb-6 text-sm">{email}</p>
          <p className="text-ui-muted text-xs mb-8 leading-relaxed">
            Haz clic en el enlace para activar tu cuenta.
            Si no lo ves, revisa spam.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="bg-blix-red text-white font-bold px-8 py-3 rounded-xl
                       hover:bg-blix-red-dark transition-all shadow-lg shadow-red-200"
          >
            Ir a iniciar sesión
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-blix-bone flex font-sans">

      {/* Panel izquierdo */}
      <div className="hidden lg:flex lg:w-1/2 bg-blix-charcoal flex-col
                      items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(ellipse at 80% 20%, rgba(239,35,60,0.2) 0%, transparent 55%),
              radial-gradient(ellipse at 20% 80%, rgba(6,214,160,0.12) 0%, transparent 55%)`,
          }}
        />
        <div className="relative z-10 max-w-sm">
          <div className="text-5xl mb-6 text-center">🍽️</div>
          <h2 className="font-display text-white text-center mb-4"
              style={{ fontSize: '2.2rem', fontWeight: 600, lineHeight: 1.1 }}>
            Tu mesa, tu momento
          </h2>
          <p className="text-white/50 text-sm text-center leading-relaxed mb-10">
            Únete y reserva tu mesa sin filas, sin esperas.
            Directo a comer.
          </p>
          <div className="space-y-4">
            {[
              { step: '1', title: 'Crea tu cuenta', sub: 'Gratis, 30 segundos' },
              { step: '2', title: 'Elige tu mesa', sub: 'Mapa en tiempo real' },
              { step: '3', title: 'Haz check-in', sub: 'Escanea el QR al llegar' },
            ].map(s => (
              <div key={s.step} className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-xl bg-blix-red/20 border border-blix-red/30
                                flex items-center justify-center font-display text-blix-red
                                font-semibold shrink-0" style={{ fontSize: '1.1rem' }}>
                  {s.step}
                </div>
                <div>
                  <div className="text-white text-sm font-semibold">{s.title}</div>
                  <div className="text-white/40 text-xs">{s.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Panel derecho */}
      <div className="w-full lg:w-1/2 flex items-center justify-center
                      p-6 overflow-y-auto">
        <div className="w-full max-w-sm py-8">

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
            Crear cuenta
          </h1>
          <p className="text-ui-muted text-sm mb-7">
            Gratis · Sin tarjeta de crédito
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            {[
              { label: 'Nombre completo', type: 'text',  val: name,  set: setName,  ph: 'María García' },
              { label: 'Correo electrónico', type: 'email', val: email, set: setEmail, ph: 'tu@email.com' },
              { label: 'Número de celular', type: 'tel',  val: phone, set: setPhone, ph: '3001234567' },
            ].map(f => (
              <div key={f.label}>
                <label className="block text-blix-carbon text-sm font-semibold mb-1.5">
                  {f.label}
                </label>
                <input
                  type={f.type} value={f.val} required
                  onChange={e => f.set(e.target.value)}
                  placeholder={f.ph}
                  className="w-full border-2 border-ui-border bg-white text-blix-carbon
                             placeholder-ui-muted rounded-xl px-4 py-3 text-sm
                             focus:outline-none focus:border-blix-red transition-colors"
                />
              </div>
            ))}

            <div>
              <label className="block text-blix-carbon text-sm font-semibold mb-1.5">
                Contraseña
              </label>
              <input
                type="password" value={password} required minLength={6}
                onChange={e => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
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
                         disabled:opacity-50 text-sm mt-2"
            >
              {loading ? 'Creando cuenta...' : 'Crear cuenta gratis'}
            </button>
          </form>

          <p className="text-center text-ui-muted text-sm mt-6">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login"
                  className="text-blix-red font-semibold hover:text-blix-red-dark transition">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}