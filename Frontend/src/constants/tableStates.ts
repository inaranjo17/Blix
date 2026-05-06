import type { TableState } from '../@types'

export interface StateConfig {
  color: string          // clase Tailwind bg-*
  border: string         // clase Tailwind border-*
  label: string          // texto visible al usuario
  publicState: TableState // estado que ve el público
}

export const STATE_CONFIG: Record<TableState, StateConfig> = {
  FREE: {
    color: 'bg-green-500',
    border: 'border-green-400',
    label: 'Libre',
    publicState: 'FREE',
  },
  RESERVED: {
    color: 'bg-yellow-400',
    border: 'border-yellow-300',
    label: 'Reservada',
    publicState: 'RESERVED',
  },
  PENDING_CONFIRM: {
    color: 'bg-yellow-400',
    border: 'border-yellow-300',
    label: 'Reservada',          // el público ve amarillo igual
    publicState: 'RESERVED',
  },
  LEGITIMATELY_OCCUPIED: {
    color: 'bg-red-500',
    border: 'border-red-400',
    label: 'En uso',
    publicState: 'LEGITIMATELY_OCCUPIED',
  },
  OCCUPIED_NO_RESERVATION: {
    color: 'bg-blue-500',
    border: 'border-blue-400',
    label: 'Ocupada',
    publicState: 'OCCUPIED_NO_RESERVATION',
  },
  CONFLICT: {
    color: 'bg-red-500',         // el público ve rojo (no naranja)
    border: 'border-red-400',
    label: 'En uso',
    publicState: 'LEGITIMATELY_OCCUPIED',
  },
  NO_SIGNAL: {
    color: 'bg-gray-400',
    border: 'border-gray-300',
    label: 'Sin señal',
    publicState: 'NO_SIGNAL',
  },
}

// Para el admin — ve CONFLICT en naranja
export const ADMIN_STATE_CONFIG: Record<TableState, StateConfig> = {
  ...STATE_CONFIG,
  CONFLICT: {
    color: 'bg-orange-500',
    border: 'border-orange-400',
    label: '⚠️ Conflicto',
    publicState: 'CONFLICT',
  },
}

export function formatTimer(seconds: number): string {
  if (seconds <= 0) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}