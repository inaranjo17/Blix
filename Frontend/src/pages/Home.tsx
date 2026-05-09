import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Navbar } from '../components/layout/Navbar'
import { TableCard } from '../components/ui/TableCard'
import { useTables } from '../hooks/useTables'
import { useAuth } from '../context/AuthContext'
import type { Table } from '../@types'

const CAPACITY_FILTERS = [
  { label: 'Todas', value: 0 },
  { label: '×2', value: 2 },
  { label: '×4', value: 4 },
  { label: '×6', value: 6 },
]

// Restaurantes colombianos reales del perímetro
const TOP_RESTAURANTS = [
  { name: 'Juan Valdez', emoji: '☕', color: '#6F4E37', textColor: 'white', desc: 'Café' },
  { name: 'Crepes & Waffles', emoji: '🥞', color: '#E8733A', textColor: 'white', desc: 'Crepes' },
  { name: 'El Corral', emoji: '🍔', color: '#C41E3A', textColor: 'white', desc: 'Burgers' },
  { name: 'Frisby', emoji: '🍗', color: '#D63B2F', textColor: 'white', desc: 'Pollo' },
]

const BOTTOM_RESTAURANTS = [
  { name: 'KFC', emoji: '🍗', color: '#C0392B', textColor: 'white', desc: 'Pollo' },
  { name: "McDonald's", emoji: '🍟', color: '#FFC107', textColor: '#111', desc: 'Burgers' },
  { name: 'Subway', emoji: '🥖', color: '#007B40', textColor: 'white', desc: 'Sándwiches' },
  { name: 'Punta Sal', emoji: '🐟', color: '#0277BD', textColor: 'white', desc: 'Mariscos' },
]

const LEFT_RESTAURANTS = [
  { name: 'Sushi Green', emoji: '🍣', color: '#2E7D32', textColor: 'white' },
  { name: 'La Brasa Roja', emoji: '🔥', color: '#BF360C', textColor: 'white' },
]

const RIGHT_RESTAURANTS = [
  { name: "Archie's", emoji: '🍕', color: '#C62828', textColor: 'white' },
  { name: 'Wok', emoji: '🍜', color: '#4527A0', textColor: 'white' },
]

export function HomePage() {
  const { tables, loading, error } = useTables()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [capacityFilter, setCapacityFilter] = useState(0)

  const zones = [...new Set(tables.map(t => t.zone))].sort()
  const filtered = capacityFilter === 0 ? tables : tables.filter(t => t.capacity === capacityFilter)

  function handleTableClick(table: Table) {
    if (!user) {
      navigate('/login?redirect=/reserve/' + table.id)
      return
    }
    navigate(`/reserve/${table.id}`)
  }

  const freeCount  = tables.filter(t => t.state === 'FREE').length
  const totalCount = tables.length

  return (
    <div className="min-h-screen bg-blix-dark">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <div>
            <h1 className="text-white text-xl font-bold">
              Plazoleta de Comidas
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">
              {loading
                ? 'Cargando mapa...'
                : <span>
                    <span className="text-green-400 font-semibold">{freeCount}</span>
                    <span className="text-gray-500"> de {totalCount} mesas disponibles</span>
                    <span className="ml-2 inline-flex items-center gap-1 text-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
                      <span className="text-green-500">En vivo</span>
                    </span>
                  </span>
              }
            </p>
          </div>

          {/* Filtros */}
          <div className="flex gap-1.5">
            {CAPACITY_FILTERS.map(f => (
              <button
                key={f.value}
                onClick={() => setCapacityFilter(f.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all
                  ${capacityFilter === f.value
                    ? 'bg-blix-amber text-blix-dark shadow-lg shadow-amber-500/20'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'}`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Banner visitante */}
        {!user && (
          <div className="bg-gradient-to-r from-blix-blue/30 to-blix-amber/10
                          border border-blix-amber/20 rounded-2xl px-4 py-3 mb-5
                          flex items-center justify-between gap-3">
            <div>
              <p className="text-white text-sm font-semibold">¿Quieres reservar tu mesa?</p>
              <p className="text-gray-400 text-xs mt-0.5">Crea una cuenta gratis e inicia sesión</p>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="bg-blix-amber text-blix-dark text-xs font-bold px-4 py-2
                         rounded-lg hover:bg-blix-amber-light transition-all whitespace-nowrap
                         shadow-lg shadow-amber-500/20"
            >
              Iniciar sesión
            </button>
          </div>
        )}

        {/* Loading / Error */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blix-amber" />
            <p className="text-gray-500 text-sm">Cargando mapa en tiempo real...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl p-4 text-center text-sm">
            {error}
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════
            MAPA DE LA PLAZOLETA
        ═══════════════════════════════════════════════════════════ */}
        {!loading && !error && (
          <div className="bg-[#1e293b] rounded-3xl border border-white/5 overflow-hidden
                          shadow-2xl shadow-black/40">

            {/* Título del mall */}
            <div className="bg-[#0f172a] border-b border-white/5 px-6 py-3
                            flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-blix-amber" />
                <span className="text-white text-xs font-bold tracking-widest uppercase">
                  Centro Comercial · Piso 3 · Plazoleta de Comidas
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-gray-500">
                {[
                  { color: 'bg-green-500', label: 'Libre' },
                  { color: 'bg-yellow-400', label: 'Reservada' },
                  { color: 'bg-red-500', label: 'En uso' },
                  { color: 'bg-blue-500', label: 'Ocupada' },
                ].map(s => (
                  <div key={s.label} className="hidden sm:flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${s.color}`} />
                    <span>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contenido del mapa */}
            <div className="p-3 sm:p-5 overflow-x-auto">
              <div className="min-w-[680px]">

                {/* ── FILA SUPERIOR: servicios + restaurantes ── */}
                <div className="grid grid-cols-6 gap-2 mb-2">
                  {/* Baños Damas */}
                  <ServiceTile icon="🚻" label="Baños" sublabel="Damas" color="#1e3a5f" />

                  {/* Restaurantes superiores */}
                  {TOP_RESTAURANTS.map(r => (
                    <RestaurantTile key={r.name} {...r} />
                  ))}

                  {/* Ascensor */}
                  <ServiceTile icon="🛗" label="Ascensores" sublabel="Piso 1-4" color="#1a2e1a" />
                </div>

                {/* ── FILA MEDIA: laterales + zonas ── */}
                <div className="flex gap-2 mb-2">

                  {/* Restaurantes izquierda */}
                  <div className="flex flex-col gap-2 w-20 shrink-0">
                    {LEFT_RESTAURANTS.map(r => (
                      <div
                        key={r.name}
                        className="flex-1 rounded-xl flex flex-col items-center justify-center
                                   p-2 text-center min-h-[70px] restaurant-block"
                        style={{ backgroundColor: r.color + '22', border: `1px solid ${r.color}44` }}
                      >
                        <span className="text-xl mb-0.5">{r.emoji}</span>
                        <span className="text-xs font-bold leading-tight"
                          style={{ color: r.color }}>{r.name}</span>
                      </div>
                    ))}
                  </div>

                  {/* ── ÁREA CENTRAL: piso de la plazoleta ── */}
                  <div className="flex-1 floor-tile rounded-2xl border border-amber-200/30
                                  p-3 relative">

                    {/* Fuente decorativa central */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                                    w-14 h-14 rounded-full bg-blue-500/10 border-2 border-blue-400/20
                                    flex items-center justify-center pointer-events-none z-0
                                    opacity-40">
                      <span className="text-2xl">⛲</span>
                    </div>

                    {/* Zonas de mesas */}
                    <div className="relative z-10 flex gap-3">
                      {zones.map((zone, zi) => {
                        const zoneTables = filtered.filter(t => t.zone === zone)
                        const allZoneTables = tables.filter(t => t.zone === zone)
                        const zoneFree = allZoneTables.filter(t => t.state === 'FREE').length

                        return (
                          <div key={zone} className="flex-1">
                            {/* Header de zona */}
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-1.5">
                                <div className="w-5 h-5 rounded-md bg-blix-dark/80 text-white
                                                text-xs font-black flex items-center justify-center">
                                  {zone}
                                </div>
                                <span className="text-xs font-semibold text-gray-600">
                                  Zona {zone}
                                </span>
                              </div>
                              <span className="text-xs text-green-600 font-medium">
                                {zoneFree} libres
                              </span>
                            </div>

                            {/* Separador de zona */}
                            {zi < zones.length - 1 && (
                              <div className="absolute right-0 top-0 bottom-0 w-px
                                              bg-amber-300/30 pointer-events-none" />
                            )}

                            {/* Grid de mesas */}
                            {zoneTables.length > 0 ? (
                              <div className="grid grid-cols-2 gap-2">
                                {zoneTables.map(table => (
                                  <TableCard
                                    key={table.id}
                                    table={table}
                                    onClick={handleTableClick}
                                  />
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-4 text-gray-400 text-xs">
                                Sin mesas para este filtro
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>

                    {/* Sin resultados globales */}
                    {filtered.length === 0 && (
                      <div className="text-center py-8 text-gray-500 text-sm">
                        <p>No hay mesas de ese tamaño</p>
                        <button
                          onClick={() => setCapacityFilter(0)}
                          className="text-blix-amber text-xs mt-1 hover:underline"
                        >
                          Ver todas
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Restaurantes derecha */}
                  <div className="flex flex-col gap-2 w-20 shrink-0">
                    {RIGHT_RESTAURANTS.map(r => (
                      <div
                        key={r.name}
                        className="flex-1 rounded-xl flex flex-col items-center justify-center
                                   p-2 text-center min-h-[70px] restaurant-block"
                        style={{ backgroundColor: r.color + '22', border: `1px solid ${r.color}44` }}
                      >
                        <span className="text-xl mb-0.5">{r.emoji}</span>
                        <span className="text-xs font-bold leading-tight"
                          style={{ color: r.color }}>{r.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── FILA INFERIOR: restaurantes + servicios ── */}
                <div className="grid grid-cols-6 gap-2">
                  {/* Escaleras */}
                  <ServiceTile icon="🪜" label="Escaleras" sublabel="Eléctric." color="#2d1a3a" />

                  {/* Restaurantes inferiores */}
                  {BOTTOM_RESTAURANTS.map(r => (
                    <RestaurantTile key={r.name} {...r} />
                  ))}

                  {/* Baños Caballeros */}
                  <ServiceTile icon="🚻" label="Baños" sublabel="Caballer." color="#1e3a5f" />
                </div>

                {/* ── ENTRADA PRINCIPAL ── */}
                <div className="mt-3 flex items-center justify-center">
                  <div className="flex items-center gap-3 bg-[#0f172a] border border-white/5
                                  rounded-xl px-6 py-2">
                    <div className="flex gap-1">
                      <div className="w-4 h-4 bg-blix-amber/60 rounded-sm" />
                      <div className="w-4 h-4 bg-blix-amber/60 rounded-sm" />
                    </div>
                    <span className="text-gray-400 text-xs font-semibold tracking-widest uppercase">
                      Entrada Principal
                    </span>
                    <div className="flex gap-1">
                      <div className="w-4 h-4 bg-blix-amber/60 rounded-sm" />
                      <div className="w-4 h-4 bg-blix-amber/60 rounded-sm" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Sub-componentes del mapa ─────────────────────────────────────

function RestaurantTile({
  name, emoji, color, textColor, desc,
}: {
  name: string; emoji: string; color: string; textColor: string; desc?: string
}) {
  return (
    <div
      className="rounded-xl p-2 flex flex-col items-center justify-center text-center
                 restaurant-block cursor-default h-16"
      style={{
        backgroundColor: color + 'dd',
        border: `1px solid ${color}`,
      }}
    >
      <span className="text-lg leading-none mb-0.5">{emoji}</span>
      <span className="text-xs font-bold leading-tight" style={{ color: textColor }}>
        {name}
      </span>
      {desc && (
        <span className="text-xs leading-tight opacity-70" style={{ color: textColor }}>
          {desc}
        </span>
      )}
    </div>
  )
}

function ServiceTile({
  icon, label, sublabel, color,
}: {
  icon: string; label: string; sublabel: string; color: string
}) {
  return (
    <div
      className="rounded-xl p-2 flex flex-col items-center justify-center text-center h-16
                 border border-white/10"
      style={{ backgroundColor: color }}
    >
      <span className="text-lg leading-none mb-0.5">{icon}</span>
      <span className="text-xs font-bold text-white leading-tight">{label}</span>
      <span className="text-xs text-white/50 leading-tight">{sublabel}</span>
    </div>
  )
}