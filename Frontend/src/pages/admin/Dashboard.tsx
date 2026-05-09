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
      setConflicts(prev =>
        prev.includes(tableId) ? prev : [...prev, tableId]
      )
    })
    return () => { socket.off('table:conflict') }
  }, [socket])

  useEffect(() => {
    if (!token) return
    axios
      .get(`${BASE}/api/admin/metrics`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(r => setMetrics(r.data))
      .catch(console.error)
  }, [token])

  const zones    = [...new Set(tables.map(t => t.zone))].sort()
  const filtered = capacityFilter === 0
    ? tables
    : tables.filter(t => t.capacity === capacityFilter)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-6">

        {/* ── Header con botones ── */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-blix-dark">
            Panel de administración
          </h1>

          <div className="flex items-center gap-2">
            {/* Botón nuevo — Generar QR */}
            <button
              onClick={() => navigate('/admin/qr')}
              className="flex items-center gap-2 bg-blix-dark text-white
                         px-4 py-2 rounded-xl text-sm font-medium
                         hover:bg-gray-800 transition-all border border-gray-700"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 3.5a.5.5 0 11-1 0 .5.5 0 011 0zM6 7.5a.5.5 0 11-1 0 .5.5 0 011 0zm7 0a.5.5 0 11-1 0 .5.5 0 011 0z" />
              </svg>
              Generar QR
            </button>

            {/* Botón existente — Volver al mapa */}
            <button
              onClick={() => navigate('/')}
              className="text-sm text-gray-500 hover:text-gray-700 transition px-3 py-2"
            >
              ← Mapa público
            </button>
          </div>
        </div>

        {/* Métricas */}
        {metrics && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { label: 'Reservas hoy',  value: metrics.today.totalReservations, color: 'text-blix-blue' },
              { label: 'Activas ahora', value: metrics.today.activeNow,         color: 'text-green-600' },
              { label: 'No-shows hoy',  value: metrics.today.noShows,           color: 'text-yellow-600' },
              { label: 'Conflictos',    value: metrics.today.conflictsNow,      color: 'text-orange-600' },
            ].map(m => (
              <div key={m.label}
                   className="bg-white rounded-xl border border-gray-100 p-4 text-center">
                <div className={`text-3xl font-bold ${m.color}`}>{m.value}</div>
                <div className="text-xs text-gray-500 mt-1">{m.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Alertas de conflicto */}
        {conflicts.length > 0 && (
          <div className="bg-orange-50 border border-orange-300 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-orange-800 mb-2">
              ⚠️ Conflictos activos
            </h3>
            <div className="flex flex-wrap gap-2">
              {conflicts.map(tableId => (
                <span key={tableId}
                      className="bg-orange-200 text-orange-800 text-sm
                                 font-bold px-3 py-1 rounded-full">
                  Mesa {tableId}
                </span>
              ))}
            </div>
            <p className="text-xs text-orange-600 mt-2">
              Estas mesas tienen presencia no autorizada. El sistema intentó reasignar automáticamente.
            </p>
          </div>
        )}

        {/* Filtro */}
        <div className="flex gap-2 mb-4">
          {[0, 2, 4, 6].map(v => (
            <button
              key={v}
              onClick={() => setCapacityFilter(v)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition
                ${capacityFilter === v
                  ? 'bg-blix-blue text-white border-blix-blue'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-blix-blue'}`}
            >
              {v === 0 ? 'Todas' : `×${v}`}
            </button>
          ))}
        </div>

        {/* Mapa admin */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blix-blue" />
          </div>
        ) : (
          zones.map(zone => {
            const zoneTables = filtered.filter(t => t.zone === zone)
            if (zoneTables.length === 0) return null
            return (
              <div key={zone} className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 bg-blix-dark text-white rounded-full
                                  flex items-center justify-center text-sm font-bold">
                    {zone}
                  </div>
                  <h2 className="font-semibold text-gray-700">Zona {zone}</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {zoneTables.map(table => (
                    <TableCard
                      key={table.id}
                      table={table}
                      isAdmin={true}
                    />
                  ))}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}