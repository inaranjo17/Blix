import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useSocket } from '../../context/SocketContext'
import { useTables } from '../../hooks/useTables'
import { TableCard } from '../../components/ui/TableCard'
import { Navbar } from '../../components/layout/Navbar'
import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL

interface Metrics {
  today: {
    totalReservations: number
    noShows: number
    activeNow: number
    conflictsNow: number
  }
}

export function AdminDashboard() {
  const { token } = useAuth()
  const socket    = useSocket()
  const navigate  = useNavigate()
  const { tables, loading } = useTables()

  const [metrics,        setMetrics]        = useState<Metrics | null>(null)
  const [conflicts,      setConflicts]      = useState<string[]>([])
  const [capacityFilter, setCapacityFilter] = useState(0)

  useEffect(() => {
    if (!socket) return
    socket.emit('admin:join')
    socket.on('table:conflict', ({ tableId }: { tableId: string }) => {
      setConflicts(prev => prev.includes(tableId) ? prev : [...prev, tableId])
    })
    return () => { socket.off('table:conflict') }
  }, [socket])

  useEffect(() => {
    if (!token) return
    axios.get(`${BASE}/api/admin/metrics`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => setMetrics(r.data)).catch(console.error)
  }, [token])

  const zones    = [...new Set(tables.map(t => t.zone))].sort()
  const filtered = capacityFilter === 0
    ? tables
    : tables.filter(t => t.capacity === capacityFilter)

  const METRICS_CONFIG = [
    { label: 'Reservas hoy',  key: 'totalReservations',
      icon: '📅', accent: '#2B2D42' },
    { label: 'Activas ahora', key: 'activeNow',
      icon: '🟢', accent: '#06D6A0' },
    { label: 'No-shows hoy',  key: 'noShows',
      icon: '⚠️', accent: '#FFB703' },
    { label: 'Conflictos',    key: 'conflictsNow',
      icon: '🔴', accent: '#EF233C' },
  ]

  return (
    <div className="min-h-screen bg-blix-bone font-sans">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-blix-carbon"
                style={{ fontSize: '1.9rem', fontWeight: 600 }}>
              Panel Admin
            </h1>
            <p className="text-ui-muted text-sm mt-0.5">
              Diverplaza · Plazoleta Piso 3
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('/admin/qr')}
              className="flex items-center gap-2 bg-blix-carbon text-white
                         px-4 py-2.5 rounded-xl text-sm font-bold
                         hover:bg-blix-charcoal transition-all shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor"
                   viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 3.5a.5.5 0 11-1 0 .5.5 0 011 0zM6 7.5a.5.5 0 11-1 0 .5.5 0 011 0zm7 0a.5.5 0 11-1 0 .5.5 0 011 0z" />
              </svg>
              Generar QR
            </button>
            <button onClick={() => navigate('/mapa')}
              className="text-sm text-ui-muted hover:text-blix-red transition-colors
                         font-medium px-3 py-2">
              ← Mapa
            </button>
          </div>
        </div>

        {/* Métricas */}
        {metrics && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {METRICS_CONFIG.map(m => (
              <div key={m.label}
                   className="bg-white rounded-2xl border-2 border-ui-border p-4
                              text-center shadow-sm">
                <div className="text-2xl mb-1">{m.icon}</div>
                <div className="font-display font-semibold"
                     style={{ color: m.accent, fontSize: '2rem', lineHeight: 1 }}>
                  {metrics.today[m.key as keyof typeof metrics.today]}
                </div>
                <div className="text-xs text-ui-muted mt-1 font-medium">
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Alertas conflicto */}
        {conflicts.length > 0 && (
          <div className="bg-red-50 border-2 border-blix-red/30 rounded-2xl p-4 mb-6">
            <h3 className="font-sans font-bold text-blix-red mb-2 flex items-center gap-2">
              <span>⚠</span> Conflictos activos
            </h3>
            <div className="flex flex-wrap gap-2">
              {conflicts.map(id => (
                <span key={id}
                      className="bg-blix-red text-white text-sm font-bold
                                 px-3 py-1 rounded-full">
                  Mesa {id}
                </span>
              ))}
            </div>
            <p className="text-xs text-ui-muted mt-2">
              Presencia no autorizada detectada. El sistema intentó reasignar.
            </p>
          </div>
        )}

        {/* Filtro */}
        <div className="flex gap-1.5 mb-4">
          {[0, 2, 4, 6].map(v => (
            <button key={v} onClick={() => setCapacityFilter(v)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border-2 transition-all
                ${capacityFilter === v
                  ? 'bg-blix-red text-white border-blix-red'
                  : 'bg-white text-ui-muted border-ui-border hover:border-blix-red hover:text-blix-red'}`}>
              {v === 0 ? 'Todas' : `×${v}`}
            </button>
          ))}
        </div>

        {/* Mapa admin */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2
                            border-blix-red" />
          </div>
        ) : zones.map(zone => {
          const zt = filtered.filter(t => t.zone === zone)
          if (!zt.length) return null
          return (
            <div key={zone} className="mb-7">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-blix-carbon text-white rounded-xl
                                flex items-center justify-center font-display
                                font-semibold text-sm">
                  {zone}
                </div>
                <h2 className="font-sans font-bold text-blix-carbon">
                  Zona {zone}
                </h2>
                <span className="text-xs text-ui-muted">
                  {zt.length} mesas
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4
                              lg:grid-cols-5 gap-3">
                {zt.map(t => (
                  <TableCard key={t.id} table={t} isAdmin={true} />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}