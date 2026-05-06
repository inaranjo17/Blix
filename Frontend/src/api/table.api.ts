import axios from 'axios'
import type { Table } from '../@types'

const BASE = import.meta.env.VITE_API_URL

export const tableApi = {
  getAll: async (): Promise<Table[]> => {
    const res = await axios.get(`${BASE}/api/tables`)
    return res.data
  },

  getById: async (id: string): Promise<Table> => {
    const res = await axios.get(`${BASE}/api/tables/${id}`)
    return res.data
  },
}