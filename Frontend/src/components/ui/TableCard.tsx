import { STATE_CONFIG, formatTimer } from '../../constants/tableStates'
import { useCountdown } from '../../hooks/useCountdown'
import type { Table } from '../../@types'

interface Props {
  table: Table
  isAdmin?: boolean
  onClick?: (table: Table) => void
}

export function TableCard({ table, isAdmin = false, onClick }: Props) {
  const config  = STATE_CONFIG[table.state]
  const isFree  = table.state === 'FREE'
  const seconds = useCountdown(
    table.state === 'LEGITIMATELY_OCCUPIED' ? table.timer : undefined
  )

  const displayColor  = isAdmin && table.state === 'CONFLICT' ? 'bg-orange-500'  : config.color
  const displayBorder = isAdmin && table.state === 'CONFLICT' ? 'border-orange-400' : config.border
  const displayLabel  = isAdmin && table.state === 'CONFLICT' ? '⚠️ Conflicto'   : config.label

  // Colores de fondo por estado (muy suaves para el mapa)
  const bgMap: Record<string, string> = {
    FREE:                    'bg-green-500/10',
    RESERVED:                'bg-yellow-400/10',
    PENDING_CONFIRM:         'bg-yellow-400/10',
    LEGITIMATELY_OCCUPIED:   'bg-red-500/10',
    OCCUPIED_NO_RESERVATION: 'bg-blue-500/10',
    CONFLICT:                'bg-orange-500/10',
    NO_SIGNAL:               'bg-gray-400/10',
  }

  const dotColor: Record<string, string> = {
    FREE:                    'bg-green-500 shadow-green-500/50',
    RESERVED:                'bg-yellow-400 shadow-yellow-400/50',
    PENDING_CONFIRM:         'bg-yellow-400 shadow-yellow-400/50',
    LEGITIMATELY_OCCUPIED:   'bg-red-500 shadow-red-500/50',
    OCCUPIED_NO_RESERVATION: 'bg-blue-500 shadow-blue-500/50',
    CONFLICT:                isAdmin ? 'bg-orange-500 shadow-orange-500/50' : 'bg-red-500 shadow-red-500/50',
    NO_SIGNAL:               'bg-gray-400',
  }

  return (
    <button
      onClick={() => isFree && onClick?.(table)}
      disabled={!isFree}
      className={`
        relative w-full rounded-2xl p-3 border transition-all duration-200 text-left
        ${bgMap[table.state] ?? 'bg-gray-400/10'}
        ${displayBorder}
        ${isFree
          ? 'cursor-pointer hover:scale-105 hover:shadow-lg table-free-pulse'
          : 'cursor-default'}
      `}
    >
      {/* Dot de estado */}
      <div className={`
        absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full shadow-md
        ${dotColor[table.state] ?? 'bg-gray-400'}
        ${isFree ? 'animate-pulse' : ''}
      `} />

      {/* Mesa ID */}
      <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-0.5">
        Mesa
      </div>
      <div className="text-xl font-black text-gray-800 leading-none mb-2">
        {table.id}
      </div>

      {/* Capacidad */}
      <div className="flex items-center gap-1 mb-1.5">
        <svg className="w-3 h-3 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
        </svg>
        <span className="text-xs text-gray-500 font-medium">{table.capacity} personas</span>
      </div>

      {/* Estado */}
      <div className={`
        inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold
        ${displayColor} bg-opacity-15 text-gray-700
      `}>
        <div className={`w-1.5 h-1.5 rounded-full ${displayColor}`} />
        {displayLabel}
      </div>

      {/* Timer */}
      {table.state === 'LEGITIMATELY_OCCUPIED' && (
        <div className={`
          text-sm font-mono font-black mt-1.5 block
          ${seconds < 300 ? 'text-red-600 animate-pulse' : 'text-red-500'}
        `}>
          ⏱ {formatTimer(seconds)}
        </div>
      )}
    </button>
  )
}