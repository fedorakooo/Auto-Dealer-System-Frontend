import axios from 'axios'
import { clearTokens } from '@/services/api/tokenStorage.js'
const AUTH_PATHS_NO_REFRESH = ['/auth/signin', '/auth/login', '/auth/refresh', '/auth/signup']
export function attachAuthInterceptors(instance, options) {
  const { getAccessToken, getRefreshToken: getRt, persistTokens, clearAuth, baseURL } = options
  const base = baseURL.replace(/\/$/, '')
  instance.interceptors.request.use((config) => {
    const token = getAccessToken()
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })
  let isRefreshing = false
  let queue = []
  instance.interceptors.response.use(
    (res) => res,
    async (error) => {
      const originalRequest = error.config
      if (!originalRequest) return Promise.reject(error)
      const status = error.response?.status
      const path = originalRequest.url || ''
      const skipRefresh =
        AUTH_PATHS_NO_REFRESH.some((p) => path.includes(p)) || path.includes('/auth/refresh')
      if (status !== 401 || skipRefresh || originalRequest._retry) {
        return Promise.reject(error)
      }
      const refreshToken = getRt()
      if (!refreshToken) {
        clearTokens()
        clearAuth()
        return Promise.reject(error)
      }
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          queue.push({
            resolve,
            reject,
            config: originalRequest,
          })
        })
      }
      originalRequest._retry = true
      isRefreshing = true
      try {
        const form = new URLSearchParams()
        form.set('refresh_token', refreshToken)
        const { data } = await axios.post(`${base}/auth/refresh`, form, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
        persistTokens({
          access_token: data.access_token,
          refresh_token: data.refresh_token,
        })
        const retry = (cfg) => {
          cfg.headers = cfg.headers || {}
          cfg.headers.Authorization = `Bearer ${data.access_token}`
          return instance(cfg)
        }
        queue.forEach(({ resolve, reject, config }) => {
          retry(config).then(resolve).catch(reject)
        })
        queue = []
        originalRequest.headers = originalRequest.headers || {}
        originalRequest.headers.Authorization = `Bearer ${data.access_token}`
        return retry(originalRequest)
      } catch (refreshErr) {
        queue.forEach(({ reject }) => reject(refreshErr))
        queue = []
        clearTokens()
        clearAuth()
        return Promise.reject(refreshErr)
      } finally {
        isRefreshing = false
      }
    }
  )
}
