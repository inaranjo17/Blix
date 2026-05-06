export type UserRole = 'USER' | 'ADMIN'

export type TableState =
  | 'FREE'
  | 'RESERVED'
  | 'PENDING_CONFIRM'
  | 'LEGITIMATELY_OCCUPIED'
  | 'OCCUPIED_NO_RESERVATION'
  | 'CONFLICT'
  | 'NO_SIGNAL'

export type ReservationStatus =
  | 'PENDING'
  | 'ACTIVE'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'EXTENDED'

export interface User {
  id: string
  name: string
  email: string
  phone?: string
  role: UserRole
}

export interface Table {
  id: string
  zone: string
  capacity: number
  state: TableState
  sensorActive: boolean
  lastSeen?: string
  timer?: number        // segundos restantes (solo en LEGITIMATELY_OCCUPIED)
  reservations?: ActiveReservationInfo[]
}

export interface ActiveReservationInfo {
  id: string
  startTime: string
  endTime: string
  status: ReservationStatus
}

export interface Reservation {
  id: string
  code: string
  tableId: string
  userId: string
  startTime: string
  endTime: string
  duration: number
  status: ReservationStatus
  checkedInAt?: string
  createdAt: string
  table: Table
}

export interface LoginResponse {
  token: string
  user: User
}

export interface ApiError {
  error: string
  alternatives?: { id: string; zone: string; capacity: number }[]
}