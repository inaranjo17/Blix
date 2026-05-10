import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Navbar } from '../components/layout/Navbar'
import { TableCard } from '../components/ui/TableCard'
import { useTables } from '../hooks/useTables'
import { useAuth } from '../context/AuthContext'
import type { Table } from '../@types'

const CAPACITY_FILTERS = [
  { label: 'Todas', value: 0 },
  { label: '×2',    value: 2 },
  { label: '×4',    value: 4 },
  { label: '×6',    value: 6 },
]

const TOP_RESTAURANTS = [
  { name: 'Juan Valdez',      emoji: '☕', bg: '#6F4E37', text: 'white' },
  { name: 'Crepes & Waffles', emoji: '🥞', bg: '#E8733A', text: 'white' },
  { name: 'El Corral',        emoji: '🍔', bg: '#C41E3A', text: 'white' },
  { name: 'Frisby',           emoji: '🍗', bg: '#D63B2F', text: 'white' },
]

const BOTTOM_RESTAURANTS = [
  { name: 'KFC',         emoji: '🍗', bg: '#C0392B', text: 'white'  },
  { name: "McDonald's",  emoji: '🍟', bg: '#FFC107', text: '#111'   },
  { name: 'Subway',      emoji: '🥖', bg: '#007B40', text: 'white'  },
  { name: 'Punta Sal',   emoji: '🐟', bg: '#0277BD', text: 'white'  },
]

const LEFT_RESTAURANTS = [
  { name: 'Sushi Green',  emoji: '🍣', bg: '#2E7D32', text: 'white' },
  { name: 'La Brasa Roja',emoji: '🔥', bg: '#BF360C', text: 'white' },
]

const RIGHT_RESTAURANTS = [
  { name: "Archie's", emoji: '🍕', bg: '#C62828', text: 'white' },
  { name: 'Wok',      emoji: '🍜', bg: '#4527A0', text: 'white' },
]

const STATE_LEGEND = [
  { color: '#06D6A0', label: 'Libre'          },
  { color: '#FFB703', label: 'Reservada'       },
  { color: '#EF233C', label: 'En uso'          },
  { color: '#F77F00', label: 'Ocupada'         },
  { color: '#ADB5BD', label: 'Sin señal'       },
]

export function HomePage() {
  const { tables, loading, error } = useTables()
  const { user }  = useAuth()
  const navigate  = useNavigate()
  const [cap, setCap] = useState(0)

  const zones    = [...new Set(tables.map(t => t.zone))].sort()
  const filtered = cap === 0 ? tables : tables.filter(t => t.capacity === cap)
  const freeCount = tables.filter(t => t.state === 'FREE').length

  function handleClick(table: Table) {
    if (!user) {
      navigate('/login?redirect=/reserve/' + table.id)
      return
    }
    navigate(`/reserve/${table.id}`)
  }

  return (
    <div className="min-h-screen bg-blix-bone font-sans">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-5">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center
                        sm:justify-between gap-3 mb-4">
          <div>
            <h1 className="font-display text-blix-carbon"
                style={{ fontSize: '1.7rem', fontWeight: 600 }}>
              Plazoleta de Comidas
            </h1>
            <p className="text-ui-muted text-sm mt-0.5 flex items-center gap-2">
              {loading ? 'Cargando...' : (
                <>
                  <span className="font-semibold" style={{ color: '#06D6A0' }}>
                    {freeCount}
                  </span>
                  <span>de {tables.length} mesas libres</span>
                  <span className="inline-flex items-center gap-1 text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-state-free
                                     animate-pulse inline-block" />
                    <span style={{ color: '#06D6A0' }}>En vivo</span>
                  </span>
                </>
              )}
            </p>
          </div>

          {/* Filtros */}
          <div className="flex gap-1.5">
            {CAPACITY_FILTERS.map(f => (
              <button key={f.value} onClick={() => setCap(f.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all
                  ${cap === f.value
                    ? 'bg-blix-red text-white shadow-md shadow-red-200'
                    : 'bg-white border-2 border-ui-border text-ui-muted hover:border-blix-red hover:text-blix-red'}`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Banner visitante */}
        {!user && (
          <div className="bg-blix-carbon text-white rounded-2xl px-4 py-3 mb-4
                          flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-bold">¿Quieres reservar?</p>
              <p className="text-white/50 text-xs mt-0.5">
                Inicia sesión para reservar tu mesa
              </p>
            </div>
            <button onClick={() => navigate('/login')}
              className="bg-blix-red text-white text-xs font-bold px-4 py-2
                         rounded-xl hover:bg-blix-red-dark transition-all
                         whitespace-nowrap shadow-lg shadow-red-900/30">
              Iniciar sesión
            </button>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2
                            border-blix-red" />
            <p className="text-ui-muted text-sm">Cargando mapa...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-2 border-blix-red/20 text-blix-red
                          rounded-2xl p-4 text-center text-sm font-medium">
            {error}
          </div>
        )}

        {/* ══ MAPA DE LA PLAZOLETA ══════════════════════════════════ */}
        {!loading && !error && (
          <div className="bg-white rounded-3xl border-2 border-ui-border
                          overflow-hidden shadow-xl">

            {/* Título del mapa */}
            <div className="bg-blix-carbon px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-blix-red" />
                <span className="text-white text-xs font-bold tracking-widest uppercase
                                 font-sans">
                  Diverplaza · Piso 3 · Plazoleta
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-4">
                {STATE_LEGEND.map(s => (
                  <div key={s.label} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full"
                         style={{ backgroundColor: s.color }} />
                    <span className="text-white/50 text-xs font-sans">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 sm:p-4 overflow-x-auto">
              <div className="min-w-[660px]">

                {/* Fila superior */}
                <div className="grid grid-cols-6 gap-1.5 mb-1.5">
                  <ServiceTile icon="🚻" label="Baños" sub="♀ Damas" />
                  {TOP_RESTAURANTS.map(r => (
                    <RestaurantTile key={r.name} {...r} />
                  ))}
                  <ServiceTile icon="🛗" label="Ascensor" sub="Piso 1-4" />
                </div>

                {/* Fila media */}
                <div className="flex gap-1.5 mb-1.5">

                  {/* Izquierda */}
                  <div className="flex flex-col gap-1.5 w-[74px] shrink-0">
                    {LEFT_RESTAURANTS.map(r => (
                      <div key={r.name}
                           className="flex-1 rounded-xl flex flex-col items-center
                                      justify-center p-2 text-center min-h-[68px]
                                      restaurant-block"
                           style={{ backgroundColor: r.bg + '28',
                                    border: `1.5px solid ${r.bg}50` }}>
                        <span className="text-lg mb-0.5">{r.emoji}</span>
                        <span className="text-xs font-bold leading-tight"
                              style={{ color: r.bg }}>{r.name}</span>
                      </div>
                    ))}
                  </div>

                  {/* Área central — piso */}
                  <div className="flex-1 floor-tile rounded-2xl border-2
                                  border-amber-200/40 p-3 relative">

                    {/* Fuente central decorativa */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2
                                    -translate-y-1/2 w-12 h-12 rounded-full
                                    border-2 border-blix-carbon/10
                                    flex items-center justify-center
                                    pointer-events-none opacity-30 z-0">
                      <span className="text-xl">⛲</span>
                    </div>

                    {/* Zonas */}
                    <div className="relative z-10 flex gap-3">
                      {zones.map(zone => {
                        const zt  = filtered.filter(t => t.zone === zone)
                        const azt = tables.filter(t => t.zone === zone)
                        const zf  = azt.filter(t => t.state === 'FREE').length

                        return (
                          <div key={zone} className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-1.5">
                                <div className="w-5 h-5 rounded-lg bg-blix-carbon
                                                text-white text-xs font-black
                                                flex items-center justify-center">
                                  {zone}
                                </div>
                                <span className="text-xs font-sans font-semibold
                                                 text-ui-muted">
                                  Zona {zone}
                                </span>
                              </div>
                              <span className="text-xs font-sans font-semibold"
                                    style={{ color: '#06D6A0' }}>
                                {zf} libres
                              </span>
                            </div>

                            {zt.length > 0 ? (
                              <div className="grid grid-cols-2 gap-1.5">
                                {zt.map(t => (
                                  <TableCard key={t.id} table={t}
                                             onClick={handleClick} />
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-4 text-ui-muted
                                              text-xs">
                                Sin mesas
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>

                    {filtered.length === 0 && (
                      <div className="text-center py-8 text-ui-muted text-sm">
                        <p>No hay mesas de ese tamaño</p>
                        <button onClick={() => setCap(0)}
                          className="text-blix-red text-xs mt-1 hover:underline">
                          Ver todas
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Derecha */}
                  <div className="flex flex-col gap-1.5 w-[74px] shrink-0">
                    {RIGHT_RESTAURANTS.map(r => (
                      <div key={r.name}
                           className="flex-1 rounded-xl flex flex-col items-center
                                      justify-center p-2 text-center min-h-[68px]
                                      restaurant-block"
                           style={{ backgroundColor: r.bg + '28',
                                    border: `1.5px solid ${r.bg}50` }}>
                        <span className="text-lg mb-0.5">{r.emoji}</span>
                        <span className="text-xs font-bold leading-tight"
                              style={{ color: r.bg }}>{r.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fila inferior */}
                <div className="grid grid-cols-6 gap-1.5">
                  <ServiceTile icon="🪜" label="Escaleras" sub="Eléct." />
                  {BOTTOM_RESTAURANTS.map(r => (
                    <RestaurantTile key={r.name} {...r} />
                  ))}
                  <ServiceTile icon="🚻" label="Baños" sub="♂ Cab." />
                </div>

                {/* Entrada */}
                <div className="mt-2 flex justify-center">
                  <div className="flex items-center gap-3 bg-blix-bone border-2
                                  border-ui-border rounded-xl px-6 py-2">
                    <div className="flex gap-1">
                      <div className="w-4 h-4 bg-blix-carbon/30 rounded-sm" />
                      <div className="w-4 h-4 bg-blix-carbon/30 rounded-sm" />
                    </div>
                    <span className="text-blix-carbon text-xs font-sans font-bold
                                     tracking-widest uppercase">
                      Entrada Principal
                    </span>
                    <div className="flex gap-1">
                      <div className="w-4 h-4 bg-blix-carbon/30 rounded-sm" />
                      <div className="w-4 h-4 bg-blix-carbon/30 rounded-sm" />
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

function RestaurantTile({ name, emoji, bg, text }: {
  name: string; emoji: string; bg: string; text: string
}) {
  return (
    <div className="rounded-xl p-2 flex flex-col items-center justify-center
                    text-center restaurant-block cursor-default h-[60px]"
         style={{ backgroundColor: bg + 'ee', border: `1.5px solid ${bg}` }}>
      <span className="text-base leading-none mb-0.5">{emoji}</span>
      <span className="text-xs font-sans font-bold leading-tight"
            style={{ color: text }}>{name}</span>
    </div>
  )
}

function ServiceTile({ icon, label, sub }: {
  icon: string; label: string; sub: string
}) {
  return (
    <div className="rounded-xl p-2 flex flex-col items-center justify-center
                    text-center h-[60px] bg-blix-carbon/5 border-2 border-blix-carbon/10">
      <span className="text-base leading-none mb-0.5">{icon}</span>
      <span className="text-xs font-sans font-bold text-blix-carbon leading-tight">
        {label}
      </span>
      <span className="text-xs font-sans text-ui-muted leading-tight">{sub}</span>
    </div>
  )
}