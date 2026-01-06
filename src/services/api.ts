import axios from 'axios'

const apiUrl = import.meta.env.VITE_API_URL as string | undefined

if (!apiUrl) {
  throw new Error('VITE_API_URL environment variable is not configured')
}

export const API_URL = apiUrl

// Token store - keeps access token in memory for security
let accessToken: string | null = null

export const tokenStore = {
  getAccessToken: () => accessToken,
  setAccessToken: (token: string | null) => {
    accessToken = token
  },
  getRefreshToken: () => localStorage.getItem('refreshToken'),
  setRefreshToken: (token: string | null) => {
    if (token) {
      localStorage.setItem('refreshToken', token)
    } else {
      localStorage.removeItem('refreshToken')
    }
  },
  clearTokens: () => {
    accessToken = null
    localStorage.removeItem('refreshToken')
  },
}

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - attach access token
api.interceptors.request.use((config) => {
  const token = tokenStore.getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Token refresh state - prevents race conditions
let isRefreshing = false

interface RefreshSubscriber {
  resolve: (token: string) => void
  reject: (error: unknown) => void
}

let refreshSubscribers: RefreshSubscriber[] = []

function subscribeTokenRefresh(subscriber: RefreshSubscriber) {
  refreshSubscribers.push(subscriber)
}

function onTokenRefreshed(token: string) {
  refreshSubscribers.forEach((subscriber) => subscriber.resolve(token))
  refreshSubscribers = []
}

function onRefreshFailed(error: unknown) {
  refreshSubscribers.forEach((subscriber) => subscriber.reject(error))
  refreshSubscribers = []
}

// Response interceptor - handle 401 and refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Skip refresh for auth endpoints
    if (
      originalRequest.url?.includes('/auth/refresh') ||
      originalRequest.url?.includes('/auth/login')
    ) {
      return Promise.reject(error)
    }

    // Handle 401 - attempt token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      // If already refreshing, wait for the refresh to complete
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`
              resolve(api(originalRequest))
            },
            reject,
          })
        })
      }

      const refreshToken = tokenStore.getRefreshToken()
      if (!refreshToken) {
        return Promise.reject(error)
      }

      isRefreshing = true

      try {
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken,
        })

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data

        tokenStore.setAccessToken(newAccessToken)
        tokenStore.setRefreshToken(newRefreshToken)

        // Notify all waiting requests
        onTokenRefreshed(newAccessToken)
        isRefreshing = false

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return api(originalRequest)
      } catch (refreshError) {
        // Refresh failed - reject all queued requests, clear tokens and redirect to login
        onRefreshFailed(refreshError)
        isRefreshing = false
        tokenStore.clearTokens()
        window.location.href = '/login'
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  },
)
