import axios from 'axios'
import { setTokens, clearTokens, getRefreshToken } from '@/services/api'
import { resolvedApiBaseUrl } from '@/shared/config/env.js'
export async function signInWithPassword(body) {
  const form = new URLSearchParams()
  form.set('username', body.username)
  form.set('password', body.password)
  const { data } = await axios.post(`${resolvedApiBaseUrl}/auth/signin`, form, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
  setTokens(data)
  return data
}
export async function signOut(api) {
  const rt = getRefreshToken()
  if (rt) {
    const form = new URLSearchParams()
    form.set('refresh_token', rt)
    try {
      await axios.post(`${resolvedApiBaseUrl}/auth/logout`, form, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
    } catch {
      try {
        await api.post('/auth/logout', form, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        })
      } catch {
        void 0
      }
    }
  }
  clearTokens()
}
export async function signUp(body) {
  const { data } = await axios.post(`${resolvedApiBaseUrl}/auth/signup`, body, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
  return data
}
