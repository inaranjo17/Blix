import type { TableState } from '../@types'

export interface StateConfig {
  color: string       // hex color for the state dot/badge
  bgClass: string     // tailwind bg class (light tint)
  borderClass: string // tailwind border class
  textClass: string   // tailwind text class
  label: string       // visible user label
  publicState: TableState
}

export const STATE_CONFIG: Record<TableState, StateConfig> = {
  FREE: {
    color: '#06D6A0',
    bgClass: 'bg-[#06D6A0]/12',
    borderClass: 'border-[#06D6A0]/40',
    textClass: 'text-[#027A5C]',
    label: 'Libre',
    publicState: 'FREE',
  },
  RESERVED: {
    color: '#FFB703',
    bgClass: 'bg-[#FFB703]/12',
    borderClass: 'border-[#FFB703]/40',
    textClass: 'text-[#9A6E00]',
    label: 'Reservada',
    publicState: 'RESERVED',
  },
  PENDING_CONFIRM: {
    color: '#8B5CF6',
    bgClass: 'bg-[#8B5CF6]/10',
    borderClass: 'border-[#8B5CF6]/35',
    textClass: 'text-[#5B21B6]',
    label: 'Reservada',
    publicState: 'RESERVED',
  },
  LEGITIMATELY_OCCUPIED: {
    color: '#F97316',
    bgClass: 'bg-[#F97316]/10',
    borderClass: 'border-[#F97316]/35',
    textClass: 'text-[#9A4504]',
    label: 'En uso',
    publicState: 'LEGITIMATELY_OCCUPIED',
  },
  OCCUPIED_NO_RESERVATION: {
    color: '#EF233C',
    bgClass: 'bg-[#EF233C]/10',
    borderClass: 'border-[#EF233C]/35',
    textClass: 'text-[#9B0E1E]',
    label: 'Ocupada',
    publicState: 'OCCUPIED_NO_RESERVATION',
  },
  CONFLICT: {
    // public view: aparece como "En uso" (rojo)
    color: '#EF233C',
    bgClass: 'bg-[#EF233C]/10',
    borderClass: 'border-[#EF233C]/35',
    textClass: 'text-[#9B0E1E]',
    label: 'En uso',
    publicState: 'LEGITIMATELY_OCCUPIED',
  },
  NO_SIGNAL: {
    color: '#9CA3AF',
    bgClass: 'bg-gray-100',
    borderClass: 'border-gray-200',
    textClass: 'text-gray-500',
    label: 'Sin señal',
    publicState: 'NO_SIGNAL',
  },
}

// Admin ve CONFLICT en carmesí con ícono de alerta
export const ADMIN_STATE_CONFIG: Record<TableState, StateConfig> = {
  ...STATE_CONFIG,
  CONFLICT: {
    color: '#E11D48',
    bgClass: 'bg-[#E11D48]/10',
    borderClass: 'border-[#E11D48]/40',
    textClass: 'text-[#9F1239]',
    label: '⚠ Conflicto',
    publicState: 'CONFLICT',
  },
}

export function formatTimer(seconds: number): string {
  if (seconds <= 0) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}