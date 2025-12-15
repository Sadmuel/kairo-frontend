import axios from 'axios'
import { api } from '@/services/api'
import type { User, RegisterDto, LoginDto, AuthResponse } from '@/types'

const API_URL = import.meta.env.API_URL

export const authService = {
  async register(data: RegisterDto): Promise<User> {
    const response = await api.post<User>('/auth/register', data)
    return response.data
  },

  async login(data: LoginDto): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', data)
    return response.data
  },

  async refresh(refreshToken: string): Promise<AuthResponse> {
    // Use plain axios to avoid interceptor interference
    const response = await axios.post<AuthResponse>(`${API_URL}/auth/refresh`, {
      refreshToken,
    })
    return response.data
  },

  async logout(refreshToken: string): Promise<void> {
    await api.post('/auth/logout', { refreshToken })
  },

  async getMe(): Promise<User> {
    const response = await api.get<User>('/auth/me')
    return response.data
  },
}
