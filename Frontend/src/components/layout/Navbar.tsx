import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export function Navbar() {
  const { user, logout } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()

  const mallName = sessionStorage.getItem('blix_mall') === 'diverplaza'
    ? 'Diverplaza'
    : null

  function handleLogout() {
    logout()
    navigate('/')
  }

  const isActive = (path: string) =>
    location.pathname === path ||
    location.pathname.startsWith(path + '/')

  return (
    <nav className="bg-white border-b border-ui-border sticky top-0 z-50
                    shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-15 flex items-center
                      justify-between py-3">

        {/* Izquierda — Logo + breadcrumb */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-blix-red rounded-lg flex items-center
                            justify-center shadow-md group-hover:bg-blix-red-dark transition">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="1" width="6" height="6" rx="1.5" fill="white"/>
                <rect x="9" y="1" width="6" height="6" rx="1.5" fill="white"/>
                <rect x="1" y="9" width="6" height="6" rx="1.5" fill="white"/>
                <rect x="9" y="9" width="6" height="6" rx="1.5" fill="white" opacity="0.35"/>
              </svg>
            </div>
            <span className="font-sans font-black text-blix-carbon text-lg
                             tracking-tight">
              BLIX
            </span>
          </Link>

          {mallName && (
            <>
              <svg className="w-3 h-3 text-ui-muted" fill="none"
                   stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                  strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-blix-carbon text-sm font-sans font-semibold
                               hidden sm:block">
                {mallName}
              </span>
            </>
          )}
        </div>

        {/* Derecha — Navegación */}
        <div className="flex items-center gap-1">
          {user ? (
            <>
              <Link
                to="/mis-reservas"
                className={`px-3 py-2 rounded-xl text-sm font-sans font-medium
                            transition-all
                  ${isActive('/mis-reservas')
                    ? 'bg-blix-red/10 text-blix-red'
                    : 'text-ui-muted hover:text-blix-carbon hover:bg-blix-bone'}`}
              >
                Mis reservas
              </Link>

              <Link
                to="/checkin"
                className={`px-3 py-2 rounded-xl text-sm font-sans font-medium
                            transition-all
                  ${isActive('/checkin')
                    ? 'bg-blix-red/10 text-blix-red'
                    : 'text-ui-muted hover:text-blix-carbon hover:bg-blix-bone'}`}
              >
                Check-in
              </Link>

              {user.role === 'ADMIN' && (
                <Link
                  to="/admin"
                  className="px-3 py-2 rounded-xl text-sm font-sans font-medium
                             bg-blix-carbon text-white hover:bg-blix-charcoal transition-all"
                >
                  Admin
                </Link>
              )}

              <div className="w-px h-4 bg-ui-border mx-1" />

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blix-red flex items-center
                                justify-center text-white text-xs font-sans font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-blix-carbon text-sm font-sans hidden sm:block">
                  {user.name.split(' ')[0]}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="ml-1 px-3 py-2 rounded-xl text-sm font-sans font-medium
                           text-ui-muted hover:text-blix-red hover:bg-red-50 transition-all"
              >
                Salir
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-3 py-2 rounded-xl text-sm font-sans font-medium
                           text-ui-muted hover:text-blix-carbon hover:bg-blix-bone transition-all"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 rounded-xl text-sm font-sans font-semibold
                           bg-blix-red text-white hover:bg-blix-red-dark
                           transition-all shadow-sm"
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