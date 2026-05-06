import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL

export function VerifyPage() {
  const { token } = useParams<{ token: string }>()
  const navigate  = useNavigate()

  // Si no hay token en la URL, arrancar directo en error
  // Esto evita el setState síncrono dentro del useEffect
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    token ? 'loading' : 'error'
  )

  const called = useRef(false)

  useEffect(() => {
    // Si no había token, el estado ya es 'error' desde la inicialización
    if (!token) return

    // Guardia para StrictMode — evita la doble llamada en desarrollo
    if (called.current) return
    called.current = true

    axios
      .get(`${BASE}/api/auth/verify/${token}`)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'))
  }, [token])

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blix-dark to-blix-blue
                      flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blix-dark to-blix-blue
                      flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 text-center max-w-md w-full">
          <div className="text-5xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Enlace inválido
          </h2>
          <p className="text-gray-500 mb-6">
            El enlace de verificación es inválido o ya fue usado.
          </p>
          <button
            onClick={() => navigate('/register')}
            className="bg-blix-blue text-white px-6 py-2.5 rounded-lg
                       font-medium hover:bg-blue-700 transition"
          >
            Volver al registro
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blix-dark to-blix-blue
                    flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 text-center max-w-md w-full">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          ¡Cuenta verificada!
        </h2>
        <p className="text-gray-500 mb-6">
          Tu cuenta está lista. Ya puedes iniciar sesión y reservar tu mesa.
        </p>
        <button
          onClick={() => navigate('/login')}
          className="bg-blix-blue text-white px-6 py-2.5 rounded-lg
                     font-medium hover:bg-blue-700 transition"
        >
          Iniciar sesión
        </button>
      </div>
    </div>
  )
}