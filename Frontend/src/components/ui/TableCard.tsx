import { STATE_CONFIG, ADMIN_STATE_CONFIG, formatTimer } from '../../constants/tableStates'
import { useCountdown } from '../../hooks/useCountdown'
import type { Table } from '../../@types'

interface Props {
  table: Table
  isAdmin?: boolean
  onClick?: (table: Table) => void
}

export function TableCard({ table, isAdmin = false, onClick }: Props) {
  const cfg    = (isAdmin ? ADMIN_STATE_CONFIG : STATE_CONFIG)[table.state]
  const isFree = table.state === 'FREE'
  const seconds = useCountdown(
    table.state === 'LEGITIMATELY_OCCUPIED' ? table.timer : undefined
  )

  return (
    <button
      onClick={() => isFree && onClick?.(table)}
      disabled={!isFree}
      className={`
        relative w-full rounded-2xl p-3 border-[1.5px] text-left
        transition-all duration-200
        ${cfg.bgClass} ${cfg.borderClass}
        ${isFree
          ? 'cursor-pointer hover:scale-[1.04] hover:shadow-lg table-free-pulse'
          : 'cursor-default'}
      `}
    >
      {/* Estado dot */}
      <span
        className={`absolute top-2.5 right-2.5 w-2.5 h-2.5 rounded-full
          ${isFree ? 'animate-pulse' : ''}`}
        style={{ backgroundColor: cfg.color, boxShadow: `0 0 0 3px ${cfg.color}28` }}
      />

      {/* Mesa label */}
      <p className="text-[10px] font-bold text-blix-carbon/40 uppercase tracking-[0.12em] mb-0.5 font-sans">
        Mesa
      </p>

      {/* Mesa ID — Cormorant */}
      <p className="font-display font-bold text-blix-carbon leading-none mb-2"
         style={{ fontSize: '1.4rem' }}>
        {table.id}
      </p>

      {/* Capacidad */}
      <div className="flex items-center gap-1 mb-2">
        <svg className="w-3 h-3 text-blix-carbon/35" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
        </svg>
        <span className="text-[11px] text-blix-carbon/50 font-medium">{table.capacity} pers.</span>
      </div>

      {/* Badge de estado */}
      <div className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 bg-white/70 border border-white/80">
        <span
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: cfg.color }}
        />
        <span className={`text-[11px] font-semibold ${cfg.textClass}`}>
          {cfg.label}
        </span>
      </div>

      {/* Timer para LEGITIMATELY_OCCUPIED */}
      {table.state === 'LEGITIMATELY_OCCUPIED' && (
        <p className={`text-xs font-mono font-black mt-1.5
          ${seconds < 300 ? 'text-blix-red animate-pulse' : 'text-[#F97316]'}`}>
          ⏱ {formatTimer(seconds)}
        </p>
      )}
    </button>
  )
}