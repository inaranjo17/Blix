import axios from 'axios'
import type { Reservation } from '../@types'

const BASE = import.meta.env.VITE_API_URL

function authHeader(token: string) {
  return { Authorization: `Bearer ${token}` }
}

export const reservationApi = {
  create: async (
    token: string,
    data: { tableId: string; startTime: string; duration: number }
  ): Promise<Reservation> => {
    const res = await axios.post(`${BASE}/api/reservations`, data, {
      headers: authHeader(token),
    })
    return res.data
  },

  getMy: async (token: string): Promise<Reservation[]> => {
    const res = await axios.get(`${BASE}/api/reservations/my`, {
      headers: authHeader(token),
    })
    return res.data
  },

  cancel: async (token: string, id: string): Promise<void> => {
    await axios.delete(`${BASE}/api/reservations/${id}`, {
      headers: authHeader(token),
    })
  },

  extend: async (token: string, id: string): Promise<Reservation> => {
    const res = await axios.post(
      `${BASE}/api/reservations/${id}/extend`,
      {},
      { headers: authHeader(token) }
    )
    return res.data
  },

  checkin: async (
    token: string,
    data: { tableId: string; code: string }
  ): Promise<{ message: string; remainingSeconds: number }> => {
    const res = await axios.post(`${BASE}/api/checkin`, data, {
      headers: authHeader(token),
    })
    return res.data
  },
}