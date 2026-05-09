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
          const msgs = Object.values(data.error).flat().join(' · ')
          setError(msgs as string)
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
      <div className="min-h-screen bg-blix-dark flex items-center justify-center p-6">
        <div className="w-full max-w-md text-center">
          <div className="w-20 h-20 bg-green-500/10 border border-green-500/20 rounded-full
                          flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-white text-2xl font-bold mb-2">¡Revisa tu correo!</h2>
          <p className="text-gray-400 text-sm mb-2">
            Enviamos un enlace de verificación a
          </p>
          <p className="text-blix-amber font-semibold mb-6">{email}</p>
          <p className="text-gray-500 text-xs mb-8">
            Haz clic en el enlace del correo para activar tu cuenta.
            Si no lo ves, revisa tu carpeta de spam.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="bg-blix-amber text-blix-dark font-bold px-8 py-3 rounded-xl
                       hover:bg-blix-amber-light transition-all shadow-lg shadow-amber-500/20"
          >
            Ir a iniciar sesión
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-blix-dark flex">

      {/* Panel izquierdo */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden
                      bg-gradient-to-br from-[#0c1f4a] via-blix-dark to-[#1a0a2e]
                      flex-col items-center justify-center p-12">

        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f59e0b' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10 text-center max-w-xs">
          <div className="text-6xl mb-6 animate-float">🏬</div>
          <h2 className="text-white text-3xl font-bold mb-3">
            Encuentra tu mesa perfecta
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-8">
            Únete a cientos de visitantes que ya reservan su mesa en el Centro Comercial
            antes de llegar, sin filas ni esperas.
          </p>

          <div className="space-y-3 text-left">
            {[
              { step: '1', title: 'Crea tu cuenta', desc: 'Gratis, en 30 segundos' },
              { step: '2', title: 'Elige tu mesa', desc: 'Ve el mapa en tiempo real' },
              { step: '3', title: 'Haz check-in', desc: 'Escanea el QR al llegar' },
            ].map(s => (
              <div key={s.step} className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-blix-amber/20 border border-blix-amber/30
                                flex items-center justify-center text-blix-amber text-sm font-bold shrink-0">
                  {s.step}
                </div>
                <div>
                  <div className="text-white text-sm font-semibold">{s.title}</div>
                  <div className="text-gray-500 text-xs">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 flex items-center gap-2 opacity-30">
          <div className="w-5 h-5 bg-blix-amber rounded-md" />
          <span className="text-white font-bold text-sm">BLIX</span>
        </div>
      </div>

      {/* Panel derecho — formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-sm py-8">

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

          <h1 className="text-white text-2xl font-bold mb-1">Crear cuenta</h1>
          <p className="text-gray-400 text-sm mb-7">
            Es gratis y solo toma un momento
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            {[
              { label: 'Nombre completo', type: 'text', value: name, onChange: setName, placeholder: 'María García' },
              { label: 'Correo electrónico', type: 'email', value: email, onChange: setEmail, placeholder: 'tu@email.com' },
              { label: 'Número de celular', type: 'tel', value: phone, onChange: setPhone, placeholder: '3001234567' },
            ].map(field => (
              <div key={field.label}>
                <label className="block text-gray-300 text-sm font-medium mb-1.5">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  value={field.value}
                  onChange={e => field.onChange(e.target.value)}
                  placeholder={field.placeholder}
                  required
                  className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-600
                             rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2
                             focus:ring-blix-amber/50 focus:border-blix-amber/50 transition"
                />
              </div>
            ))}

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-1.5">
                Contraseña
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
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
                         disabled:opacity-50 disabled:cursor-not-allowed text-sm mt-2"
            >
              {loading ? 'Creando cuenta...' : 'Crear cuenta gratis'}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-blix-amber hover:text-blix-amber-light font-semibold transition">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}