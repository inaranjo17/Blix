import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const MALLS = [
  {
    id:       'diverplaza',
    name:     'Diverplaza',
    slogan:   'La mejor experiencia gastronómica de la ciudad',
    address:  'Av. Calle 80 # 68B-05, Bogotá D.C.',
    zone:     'Localidad de Engativá',
    floor:    'Piso 3 — Plazoleta de Comidas',
    hours:    'Lunes a Domingo · 10:00 AM – 10:00 PM',
    tables:   15,
    zones:    3,
    restaurants: [
      'Juan Valdez', 'El Corral', 'Crepes & Waffles',
      'Frisby', 'KFC', 'McDonald\'s', 'Subway', 'Punta Sal',
    ],
    features: [
      { icon: '🅿️', label: 'Parqueadero gratuito 2h' },
      { icon: '♿', label: 'Acceso para discapacitados' },
      { icon: '📶', label: 'WiFi gratuito en plazoleta' },
      { icon: '🛗', label: 'Ascensores y escaleras' },
    ],
    open: true,
  },
]

export function LandingPage() {
  const navigate = useNavigate()
  const [hoveredMall, setHoveredMall] = useState<string | null>(null)

  function handleSelectMall(mallId: string) {
    sessionStorage.setItem('blix_mall', mallId)
    navigate('/mapa')
  }

  return (
    <div className="min-h-screen bg-blix-bone font-sans">

      {/* ── HERO ──────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-blix-charcoal min-h-[55vh]
                      flex flex-col items-center justify-center px-6 py-16">

        {/* Patrón de fondo */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 50%, #EF233C 0%, transparent 50%),
                              radial-gradient(circle at 75% 50%, #06D6A0 0%, transparent 50%)`,
          }}
        />
        <div className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative z-10 text-center max-w-2xl mx-auto">

          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-11 h-11 bg-blix-red rounded-xl flex items-center
                            justify-center shadow-2xl">
              <svg width="22" height="22" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="1" width="6" height="6" rx="1.5" fill="white"/>
                <rect x="9" y="1" width="6" height="6" rx="1.5" fill="white"/>
                <rect x="1" y="9" width="6" height="6" rx="1.5" fill="white"/>
                <rect x="9" y="9" width="6" height="6" rx="1.5" fill="white" opacity="0.35"/>
              </svg>
            </div>
            <span className="text-white font-sans font-black text-2xl tracking-tight">
              BLIX
            </span>
          </div>

          {/* Titular */}
          <h1 className="font-display text-white leading-tight mb-4"
              style={{ fontSize: 'clamp(2.2rem, 6vw, 4rem)', fontWeight: 600 }}>
            Tu mesa te espera,<br />
            <span className="italic text-blix-red" style={{ fontWeight: 400 }}>
              no la fila.
            </span>
          </h1>

          <p className="text-white/60 text-base font-sans max-w-md mx-auto leading-relaxed mb-10">
            Consulta la disponibilidad en tiempo real, reserva desde tu celular
            y llega directamente a tu mesa sin esperas.
          </p>

          {/* Indicador de flecha */}
          <div className="flex flex-col items-center gap-2 animate-bounce">
            <span className="text-white/40 text-xs uppercase tracking-widest font-sans">
              Selecciona tu centro comercial
            </span>
            <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* ── SELECCIÓN DE MALL ────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-4 py-12">

        <div className="text-center mb-8">
          <p className="text-ui-muted text-sm font-sans uppercase tracking-widest mb-2">
            Centros comerciales disponibles
          </p>
          <h2 className="font-display text-blix-carbon"
              style={{ fontSize: '1.9rem', fontWeight: 600 }}>
            ¿A dónde vas hoy?
          </h2>
        </div>

        <div className="space-y-4">
          {MALLS.map(mall => (
            <div
              key={mall.id}
              onMouseEnter={() => setHoveredMall(mall.id)}
              onMouseLeave={() => setHoveredMall(null)}
              className={`
                bg-white rounded-3xl border-2 overflow-hidden
                transition-all duration-300 cursor-pointer
                ${hoveredMall === mall.id
                  ? 'border-blix-red shadow-2xl shadow-red-100 -translate-y-1'
                  : 'border-ui-border shadow-sm'}
              `}
            >
              {/* Header de tarjeta */}
              <div className="bg-blix-carbon px-6 pt-6 pb-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {mall.open ? (
                        <span className="inline-flex items-center gap-1.5 bg-state-free/20
                                         text-state-free text-xs font-bold px-2.5 py-1 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-state-free animate-pulse" />
                          Abierto ahora
                        </span>
                      ) : (
                        <span className="bg-state-signal/20 text-state-signal text-xs
                                         font-bold px-2.5 py-1 rounded-full">
                          Cerrado
                        </span>
                      )}
                    </div>
                    <h3 className="font-display text-white mt-2"
                        style={{ fontSize: '2rem', fontWeight: 600, lineHeight: 1.1 }}>
                      {mall.name}
                    </h3>
                    <p className="text-white/50 text-sm font-sans mt-1 italic">
                      {mall.slogan}
                    </p>
                  </div>

                  {/* Resumen rápido */}
                  <div className="text-right shrink-0">
                    <div className="text-3xl font-display text-white font-semibold">
                      {mall.tables}
                    </div>
                    <div className="text-white/40 text-xs font-sans">mesas</div>
                    <div className="text-state-free text-xs font-sans mt-1">
                      {mall.zones} zonas
                    </div>
                  </div>
                </div>
              </div>

              {/* Cuerpo de tarjeta */}
              <div className="px-6 py-5">

                {/* Info del mall */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
                  {[
                    { icon: '📍', label: mall.address },
                    { icon: '🏢', label: mall.floor },
                    { icon: '🕙', label: mall.hours },
                    { icon: '🗺️', label: mall.zone },
                  ].map(item => (
                    <div key={item.label} className="flex items-start gap-2.5">
                      <span className="text-base mt-0.5">{item.icon}</span>
                      <span className="text-blix-carbon text-sm font-sans leading-snug">
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Amenidades */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {mall.features.map(f => (
                    <span key={f.label}
                          className="bg-blix-bone border border-ui-border text-blix-carbon
                                     text-xs font-sans px-3 py-1.5 rounded-full flex items-center gap-1.5">
                      <span>{f.icon}</span>
                      {f.label}
                    </span>
                  ))}
                </div>

                {/* Restaurantes */}
                <div className="mb-6">
                  <p className="text-ui-muted text-xs font-sans uppercase tracking-wide mb-2">
                    Restaurantes disponibles
                  </p>
                  <p className="text-blix-carbon text-sm font-sans leading-relaxed">
                    {mall.restaurants.slice(0, 6).join(' · ')}
                    {mall.restaurants.length > 6 && (
                      <span className="text-ui-muted"> · y más</span>
                    )}
                  </p>
                </div>

                {/* CTA */}
                <button
                  onClick={() => handleSelectMall(mall.id)}
                  className="w-full bg-blix-red text-white font-sans font-bold
                             py-4 rounded-2xl transition-all duration-200
                             hover:bg-blix-red-dark active:scale-98
                             shadow-lg shadow-red-200 text-base
                             flex items-center justify-center gap-3"
                >
                  <span>Ver mesas disponibles</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                      d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Próximamente */}
        <div className="mt-6 bg-white border-2 border-dashed border-ui-border
                        rounded-3xl p-6 text-center">
          <p className="text-ui-muted text-sm font-sans">
            🏗️ <span className="font-semibold text-blix-carbon">Más centros comerciales</span>
            {' '}— próximamente en BLIX
          </p>
        </div>
      </div>

      {/* ── FOOTER ──────────────────────────────────────────────── */}
      <footer className="border-t border-ui-border py-8 px-6">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row
                        items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blix-red rounded-lg flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="1" width="6" height="6" rx="1.5" fill="white"/>
                <rect x="9" y="1" width="6" height="6" rx="1.5" fill="white"/>
                <rect x="1" y="9" width="6" height="6" rx="1.5" fill="white"/>
                <rect x="9" y="9" width="6" height="6" rx="1.5" fill="white" opacity="0.35"/>
              </svg>
            </div>
            <span className="font-sans font-bold text-blix-carbon">BLIX</span>
          </div>
          <p className="text-ui-muted text-xs font-sans text-center">
            Reservas en tiempo real para plazoletas de comidas
          </p>
          <p className="text-ui-muted text-xs font-sans">
            © 2026 BLIX · Todos los derechos reservados
          </p>
        </div>
      </footer>
    </div>
  )
}