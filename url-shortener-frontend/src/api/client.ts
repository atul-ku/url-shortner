import axios from 'axios'

// axios.create() gives us an instance pre-configured with the base URL.
// In dev, Vite's proxy rewrites /api/* → http://localhost:3000/api/*
// In production, BASE_URL points to your real API domain.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 8000,
  headers: { 'Content-Type': 'application/json' },
})

export interface ShortenResponse {
  short_url:    string
  short_code:   string
  original_url: string
  created_at:   string
}

export interface StatsResponse {
  short_url:    string
  original_url: string
  clicks:       number
  created_at:   string
  expires_at:   string | null
}

export const shortenUrl = async (url: string): Promise<ShortenResponse> => {
  const res = await api.post<ShortenResponse>('/api/shorten', { url })
  return res.data
}

export const getStats = async (code: string): Promise<StatsResponse> => {
  const res = await api.get<StatsResponse>(`/api/stats/${code}`)
  return res.data
}

export const deleteUrl = async (code: string): Promise<void> => {
  await api.delete(`/api/urls/${code}`)
}