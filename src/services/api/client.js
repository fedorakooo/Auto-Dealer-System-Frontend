import axios from 'axios'
import { attachAuthInterceptors } from '@/services/api/interceptors.js'
import { getAccessToken, getRefreshToken, setTokens } from '@/services/api/tokenStorage.js'
import { apiBaseUrl, resolvedApiBaseUrl } from '@/shared/config/env.js'
const DEFAULT_TIMEOUT_MS = 30_000
export function createApiClient({ onAuthCleared } = {}) {
  const baseURL = resolvedApiBaseUrl
  if (!apiBaseUrl && import.meta.env.DEV) {
    console.warn('VITE_API_BASE_URL is not set; using', baseURL)
  }
  const instance = axios.create({
    baseURL,
    timeout: DEFAULT_TIMEOUT_MS,
    headers: {
      'Content-Type': 'application/json',
    },
  })
  attachAuthInterceptors(instance, {
    getAccessToken,
    getRefreshToken,
    persistTokens: setTokens,
    clearAuth: () => {
      onAuthCleared?.()
    },
    baseURL,
  })
  return instance
}
