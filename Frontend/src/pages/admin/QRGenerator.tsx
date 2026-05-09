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

  // La URL base es el dominio actual — funciona en dev y en producción
  const baseUrl = window.location.origin

  function handlePrint() {
    window.print()
  }

  return (
    <>
      {/* ── Estilos de impresión ─────────────────────────────────── */}
      <style>{`
        @media print {
          body * { visibility: hidden !important; }
          #qr-print-area,
          #qr-print-area * { visibility: visible !important; }
          #qr-print-area {
            position: fixed !important;
            inset: 0 !important;
            padding: 16px !important;
            background: white !important;
          }
          .no-print { display: none !important; }
          .qr-card {
            break-inside: avoid !important;
            page-break-inside: avoid !important;
          }
        }
      `}</style>

      {/* ── Interfaz normal (no se imprime) ─────────────────────── */}
      <div className="min-h-screen bg-blix-dark no-print">

        {/* Header */}
        <div className="bg-[#0f172a] border-b border-white/5 px-6 py-4
                        flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/admin')}
              className="text-gray-400 hover:text-white transition text-sm"
            >
              ← Volver
            </button>
            <div className="w-px h-4 bg-white/10" />
            <div>
              <h1 className="text-white font-bold">Generador de Códigos QR</h1>
              <p className="text-gray-500 text-xs">
                {TABLES.length} mesas · Imprime y pega cada código en su mesa física
              </p>
            </div>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-blix-amber text-blix-dark
                       font-bold px-5 py-2.5 rounded-xl hover:bg-blix-amber-light
                       transition-all shadow-lg shadow-amber-500/20 text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Imprimir todos
          </button>
        </div>

        {/* Info */}
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="bg-blix-blue/10 border border-blix-blue/20 rounded-xl
                          px-4 py-3 mb-6 text-sm text-gray-300 flex items-start gap-3">
            <span className="text-blue-400 text-lg mt-0.5">ℹ️</span>
            <div>
              Cada QR lleva al usuario directamente a la pantalla de check-in con la mesa
              pre-seleccionada. Si no tiene sesión, lo pide primero y luego lo regresa
              al check-in automáticamente.
              <div className="text-gray-500 text-xs mt-1">
                URL base: <code className="text-blix-amber">{baseUrl}/checkin?mesa=XX</code>
              </div>
            </div>
          </div>

          {/* Preview de las tarjetas */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {TABLES.map(table => (
              <QRCard
                key={table.id}
                table={table}
                url={`${baseUrl}/checkin?mesa=${table.id}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Área de impresión ─────────────────────────────────────── */}
      <div id="qr-print-area" ref={printRef}
           style={{ display: 'none' }}
           className="bg-white p-4">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
        }}>
          {TABLES.map(table => (
            <PrintableQRCard
              key={table.id}
              table={table}
              url={`${baseUrl}/checkin?mesa=${table.id}`}
            />
          ))}
        </div>
      </div>
    </>
  )
}

// ── Tarjeta de preview (interfaz dark) ──────────────────────────
function QRCard({
  table,
  url,
}: {
  table: { id: string; zone: string; capacity: number }
  url: string
}) {
  return (
    <div className="qr-card bg-white rounded-2xl p-4 flex flex-col items-center gap-3
                    border border-white/10 shadow-lg">
      {/* QR */}
      <div className="bg-white p-2 rounded-xl">
        <QRCode value={url} size={100} level="M" />
      </div>

      {/* Info */}
      <div className="text-center">
        <div className="text-blix-dark text-xl font-black">
          Mesa {table.id}
        </div>
        <div className="text-gray-500 text-xs">
          Zona {table.zone} · ×{table.capacity}
        </div>
        <div className="text-gray-400 text-xs mt-1 font-mono break-all">
          /checkin?mesa={table.id}
        </div>
      </div>
    </div>
  )
}

// ── Tarjeta imprimible (blanca, para papel) ──────────────────────
function PrintableQRCard({
  table,
  url,
}: {
  table: { id: string; zone: string; capacity: number }
  url: string
}) {
  return (
    <div className="qr-card" style={{
      background: 'white',
      border: '2px solid #e5e7eb',
      borderRadius: '12px',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '10px',
      pageBreakInside: 'avoid',
    }}>
      {/* Logo BLIX */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        marginBottom: '2px',
      }}>
        <div style={{
          width: '20px',
          height: '20px',
          background: '#f59e0b',
          borderRadius: '5px',
        }} />
        <span style={{ fontWeight: 900, fontSize: '14px', color: '#0f172a' }}>
          BLIX
        </span>
      </div>

      {/* QR */}
      <div style={{ background: 'white', padding: '6px', borderRadius: '8px' }}>
        <QRCode value={url} size={140} level="M" />
      </div>

      {/* Mesa */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '22px', fontWeight: 900, color: '#0f172a' }}>
          Mesa {table.id}
        </div>
        <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
          Zona {table.zone} · {table.capacity} personas
        </div>
      </div>

      {/* Instrucción */}
      <div style={{
        background: '#f8fafc',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '8px 10px',
        textAlign: 'center',
        width: '100%',
      }}>
        <div style={{ fontSize: '11px', color: '#374151', fontWeight: 600 }}>
          📱 Escanea para hacer check-in
        </div>
        <div style={{ fontSize: '10px', color: '#9ca3af', marginTop: '2px' }}>
          Necesitas tu código de reserva
        </div>
      </div>
    </div>
  )
}