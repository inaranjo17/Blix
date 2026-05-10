import { useRef } from 'react'
import { QRCode } from 'react-qr-code'
import { useNavigate } from 'react-router-dom'

// Las 15 mesas del sistema
const TABLES = [
  { id: 'A1', zone: 'A', capacity: 2 },
  { id: 'A2', zone: 'A', capacity: 4 },
  { id: 'A3', zone: 'A', capacity: 6 },
  { id: 'A4', zone: 'A', capacity: 2 },
  { id: 'A5', zone: 'A', capacity: 4 },
  { id: 'B1', zone: 'B', capacity: 2 },
  { id: 'B2', zone: 'B', capacity: 4 },
  { id: 'B3', zone: 'B', capacity: 6 },
  { id: 'B4', zone: 'B', capacity: 2 },
  { id: 'B5', zone: 'B', capacity: 4 },
  { id: 'C1', zone: 'C', capacity: 2 },
  { id: 'C2', zone: 'C', capacity: 4 },
  { id: 'C3', zone: 'C', capacity: 6 },
  { id: 'C4', zone: 'C', capacity: 2 },
  { id: 'C5', zone: 'C', capacity: 4 },
]

export function QRGeneratorPage() {
  const navigate  = useNavigate()
  const printRef  = useRef<HTMLDivElement>(null)
  const baseUrl   = window.location.origin

  return (
    <>
      {/* Estilos de impresión (definidos en index.css, aquí solo el display del área) */}
      <style>{`
        @media print {
          #qr-print-area { display: block !important; }
        }
      `}</style>

      {/* Interfaz principal */}
      <div className="min-h-screen bg-blix-bone font-sans no-print">

        {/* Header */}
        <div className="bg-white border-b-2 border-ui-border px-6 py-4
                        flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/admin')}
              className="flex items-center gap-1.5 text-ui-muted hover:text-blix-red
                         text-sm font-medium transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor"
                   viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                  strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver
            </button>
            <div className="w-px h-4 bg-ui-border" />
            <div>
              <h1 className="font-display text-blix-carbon"
                  style={{ fontSize: '1.3rem', fontWeight: 600 }}>
                Generador de Códigos QR
              </h1>
              <p className="text-ui-muted text-xs mt-0.5">
                {TABLES.length} mesas · Imprime y pega en cada mesa física
              </p>
            </div>
          </div>

          <button onClick={() => window.print()}
            className="flex items-center gap-2 bg-blix-red text-white font-bold
                       px-5 py-2.5 rounded-xl hover:bg-blix-red-dark
                       transition-all shadow-lg shadow-red-200 text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor"
                 viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Imprimir todos
          </button>
        </div>

        {/* Info */}
        <div className="max-w-5xl mx-auto px-6 py-5">
          <div className="bg-white border-2 border-ui-border rounded-2xl
                          px-4 py-3 mb-6 flex items-start gap-3">
            <span className="text-blue-500 text-lg mt-0.5">ℹ️</span>
            <div className="text-sm text-blix-carbon">
              Cada QR lleva al usuario directo al check-in con la mesa pre-seleccionada.
              Si no tiene sesión, la app la solicita y luego lo regresa automáticamente.
              <div className="text-ui-muted text-xs mt-1">
                URL: <code className="text-blix-red font-mono">
                  {baseUrl}/checkin?mesa=XX
                </code>
              </div>
            </div>
          </div>

          {/* Grid de QRs */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {TABLES.map(t => (
              <div key={t.id}
                   className="bg-white rounded-2xl border-2 border-ui-border p-4
                              flex flex-col items-center gap-2 shadow-sm
                              hover:border-blix-red transition-colors qr-card">
                <div className="bg-white p-1.5 rounded-xl border border-ui-border">
                  <QRCode
                    value={`${baseUrl}/checkin?mesa=${t.id}`}
                    size={96}
                    level="M"
                    style={{ display: 'block' }}
                  />
                </div>
                <div className="text-center">
                  <div className="font-display text-blix-carbon font-semibold text-lg">
                    Mesa {t.id}
                  </div>
                  <div className="text-xs text-ui-muted">
                    Zona {t.zone} · ×{t.capacity}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Área de impresión — invisible en pantalla, visible al imprimir */}
      <div id="qr-print-area" ref={printRef}
           style={{ display: 'none', background: 'white', padding: '20px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
        }}>
          {TABLES.map(t => (
            <div key={t.id} className="qr-card" style={{
              background: 'white',
              border: '2px solid #E9ECEF',
              borderRadius: '14px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px',
              pageBreakInside: 'avoid',
            }}>
              {/* Logo */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: 18, height: 18, background: '#EF233C',
                              borderRadius: 4 }} />
                <span style={{ fontWeight: 900, fontSize: 13, color: '#2B2D42' }}>
                  BLIX
                </span>
              </div>
              {/* QR — fondo blanco explícito */}
              <div style={{ background: 'white', padding: 6,
                            borderRadius: 8, border: '1px solid #E9ECEF' }}>
                <QRCode
                  value={`${baseUrl}/checkin?mesa=${t.id}`}
                  size={130}
                  level="M"
                  style={{ display: 'block' }}
                />
              </div>
              {/* Mesa */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: '#2B2D42' }}>
                  Mesa {t.id}
                </div>
                <div style={{ fontSize: 11, color: '#6C757D', marginTop: 2 }}>
                  Zona {t.zone} · {t.capacity} personas
                </div>
              </div>
              {/* Instrucción */}
              <div style={{ background: '#F8F9FA', borderRadius: 8, padding: '7px 10px',
                            textAlign: 'center', width: '100%',
                            border: '1px solid #E9ECEF' }}>
                <div style={{ fontSize: 11, color: '#2B2D42', fontWeight: 600 }}>
                  📱 Escanea para check-in
                </div>
                <div style={{ fontSize: 10, color: '#6C757D', marginTop: 2 }}>
                  Necesitas tu código de reserva
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}