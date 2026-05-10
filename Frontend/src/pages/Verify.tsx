import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL

export function VerifyPage() {
  const { token } = useParams<{ token: string }>()
  const navigate  = useNavigate()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    token ? 'loading' : 'error'
  )
  const called = useRef(false)

  useEffect(() => {
    if (!token) return
    if (called.current) return
    called.current = true
    axios.get(`${BASE}/api/auth/verify/${token}`)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'))
  }, [token])

  return (
    <div className="min-h-screen bg-blix-bone flex items-center
                    justify-center p-6 font-sans">
      <div className="bg-white rounded-3xl border-2 border-ui-border
                      shadow-xl w-full max-w-md p-10 text-center">

        {status === 'loading' && (
          <>
            <div className="animate-spin rounded-full h-14 w-14 border-b-2
                            border-blix-red mx-auto mb-6" />
            <h2 className="font-display text-blix-carbon mb-2"
                style={{ fontSize: '1.7rem', fontWeight: 600 }}>
              Verificando tu cuenta...
            </h2>
            <p className="text-ui-muted text-sm">Un momento</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-20 h-20 rounded-full flex items-center justify-center
                            mx-auto mb-6 border-4"
                 style={{ backgroundColor: '#06D6A0', borderColor: '#06D6A0' }}>
              <svg className="w-10 h-10 text-white" fill="none"
                   stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                  strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-display text-blix-carbon mb-2"
                style={{ fontSize: '2rem', fontWeight: 600 }}>
              ¡Cuenta verificada!
            </h2>
            <p className="text-ui-muted text-sm mb-7 leading-relaxed">
              Tu cuenta está lista. Ya puedes iniciar sesión y reservar tu mesa.
            </p>
            <button onClick={() => navigate('/login')}
              className="bg-blix-red text-white font-bold px-8 py-3 rounded-xl
                         hover:bg-blix-red-dark transition-all shadow-lg shadow-red-200">
              Iniciar sesión
            </button>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-20 h-20 bg-red-50 border-2 border-blix-red/20
                            rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-blix-red" fill="none"
                   stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                  strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="font-display text-blix-carbon mb-2"
                style={{ fontSize: '2rem', fontWeight: 600 }}>
              Enlace inválido
            </h2>
            <p className="text-ui-muted text-sm mb-7">
              El enlace de verificación es inválido o ya fue usado.
            </p>
            <button onClick={() => navigate('/register')}
              className="bg-blix-carbon text-white font-bold px-8 py-3 rounded-xl
                         hover:bg-blix-charcoal transition-all">
              Volver al registro
            </button>
          </>
        )}
      </div>
    </div>
  )
}