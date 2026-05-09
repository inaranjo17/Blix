import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
 
export function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
 
  function handleLogout() {
    logout()
    navigate('/')
  }
 
  const isActive = (path: string) => location.pathname === path
 
  return (
    <nav className="bg-blix-dark border-b border-white/5 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
 
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 bg-blix-amber rounded-lg flex items-center justify-center
                          shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="1" y="1" width="6" height="6" rx="1.5" fill="#0f172a"/>
              <rect x="9" y="1" width="6" height="6" rx="1.5" fill="#0f172a"/>
              <rect x="1" y="9" width="6" height="6" rx="1.5" fill="#0f172a"/>
              <rect x="9" y="9" width="6" height="6" rx="1.5" fill="#0f172a" opacity="0.4"/>
            </svg>
          </div>
          <span className="text-white font-bold text-lg tracking-tight">
            BLIX
          </span>
        </Link>
 
        {/* Navigation */}
        <div className="flex items-center gap-1">
          {user ? (
            <>
              <Link
                to="/mis-reservas"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                  ${isActive('/mis-reservas')
                    ? 'bg-white/10 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                Mis reservas
              </Link>
 
              <Link
                to="/checkin"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                  ${isActive('/checkin')
                    ? 'bg-white/10 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                Check-in
              </Link>
 
              {user.role === 'ADMIN' && (
                <Link
                  to="/admin"
                  className="px-3 py-1.5 rounded-lg text-sm font-medium
                             bg-amber-500/10 text-blix-amber hover:bg-amber-500/20 transition-all"
                >
                  ⚡ Admin
                </Link>
              )}
 
              <div className="w-px h-4 bg-white/10 mx-1" />
 
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blix-blue to-blue-400
                                flex items-center justify-center text-white text-xs font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-gray-400 text-sm hidden sm:block">
                  {user.name.split(' ')[0]}
                </span>
              </div>
 
              <button
                onClick={handleLogout}
                className="ml-1 px-3 py-1.5 rounded-lg text-sm font-medium
                           text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all"
              >
                Salir
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-3 py-1.5 rounded-lg text-sm font-medium
                           text-gray-400 hover:text-white hover:bg-white/5 transition-all"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                className="px-4 py-1.5 rounded-lg text-sm font-semibold
                           bg-blix-amber text-blix-dark hover:bg-blix-amber-light
                           transition-all shadow-lg shadow-amber-500/20"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
 