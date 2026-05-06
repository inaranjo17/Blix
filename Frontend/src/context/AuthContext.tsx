import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react'
import { authApi } from '../api/auth.api'
import type { User } from '../@types'

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]     = useState(null as User | null)
  const [token, setToken]   = useState(null as string | null)
  const [loading, setLoading] = useState(true)

  // Al montar, intentar restaurar sesión desde sessionStorage
  useEffect(() => {
  async function restoreSession() {
    const saved = sessionStorage.getItem('blix_token')
    if (!saved) {
      setLoading(false)
      return
    }
    try {
      const userData = await authApi.me(saved)
      setToken(saved)
      setUser(userData)
    } catch {
      sessionStorage.removeItem('blix_token')
    } finally {
      setLoading(false)
    }
  }

  restoreSession()
}, [])

  async function login(email: string, password: string) {
    const data = await authApi.login(email, password)
    setToken(data.token)
    setUser(data.user)
    sessionStorage.setItem('blix_token', data.token)
  }

  function logout() {
    setToken(null)
    setUser(null)
    sessionStorage.removeItem('blix_token')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}