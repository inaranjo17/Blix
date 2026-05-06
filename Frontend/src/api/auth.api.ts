import axios from 'axios'
import type { LoginResponse, User } from '../@types'

const BASE = import.meta.env.VITE_API_URL

export const authApi = {
  register: async (data: {
    name: string
    email: string
    phone: string
    password: string
  }): Promise<{ message: string }> => {
    const res = await axios.post(`${BASE}/api/auth/register`, data)
    return res.data
  },

  login: async (
    email: string,
    password: string
  ): Promise<LoginResponse> => {
    const res = await axios.post(`${BASE}/api/auth/login`, { email, password })
    return res.data
  },

  me: async (token: string): Promise<User> => {
    const res = await axios.get(`${BASE}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return res.data
  },
}