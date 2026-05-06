import { useState } from 'react'
import { shortenUrl, deleteUrl } from '../api/client'
import type { ShortenResponse } from '../api/client'

// A custom hook keeps all state + side-effect logic out of the component.
// The component just calls functions and reads state — no axios, no try/catch.
export function useUrlShortener() {
  const [result, setResult]   = useState<ShortenResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)

  const shorten = async (url: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await shortenUrl(url)
      setResult(data)
    } catch (err: any) {
      // Axios puts the API's error message in err.response.data.error
      setError(err?.response?.data?.error ?? 'Something went wrong. Is the API running?')
    } finally {
      setLoading(false)
    }
  }

  const remove = async (code: string) => {
    try {
      await deleteUrl(code)
      setResult(null)
    } catch {
      setError('Failed to delete the URL.')
    }
  }

  const reset = () => { setResult(null); setError(null) }

  return { result, loading, error, shorten, remove, reset }
}