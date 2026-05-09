import { useCallback, useEffect, useMemo, useState } from 'react'
import { AuthContext } from '@/features/auth/authContext.js'
import { useAuthStore } from '@/app/store/authStore.js'
import { createApiClient, clearTokens, getAccessToken } from '@/services/api'
import { parseJwtPayload } from '@/lib/jwt.js'
import {
  signInWithPassword,
  signOut as signOutRequest,
  signUp,
} from '@/features/auth/authService.js'
import { fetchUser } from '@/features/users/userService.js'
import { userResponseSchema } from '@/features/users/schemas.js'
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [booting, setBooting] = useState(true)
  const api = useMemo(
    () =>
      createApiClient({
        onAuthCleared: () => {
          setUser(null)
          useAuthStore.getState().clearSession()
        },
      }),
    []
  )
  useEffect(() => {
    useAuthStore.getState().setUser(user)
  }, [user])
  useEffect(() => {
    let cancelled = false
    async function boot() {
      const token = getAccessToken()
      if (!token) {
        setBooting(false)
        return
      }
      const payload = parseJwtPayload(token)
      const id = typeof payload?.id === 'string' ? payload.id : null
      if (!id) {
        clearTokens()
        setBooting(false)
        return
      }
      try {
        const raw = await fetchUser(api, id)
        const u = userResponseSchema.parse(raw)
        if (!cancelled) setUser(u)
      } catch {
        clearTokens()
      } finally {
        if (!cancelled) setBooting(false)
      }
    }
    boot()
    return () => {
      cancelled = true
    }
  }, [api])
  const login = useCallback(
    async (email, password) => {
      await signInWithPassword({
        username: email,
        password,
      })
      const payload = parseJwtPayload(getAccessToken())
      const id = typeof payload?.id === 'string' ? payload.id : null
      if (!id) throw new Error('Invalid token payload')
      const raw = await fetchUser(api, id)
      const u = userResponseSchema.parse(raw)
      setUser(u)
    },
    [api]
  )
  const logout = useCallback(async () => {
    await signOutRequest(api)
    setUser(null)
  }, [api])
  const register = useCallback(async (body) => {
    const raw = await signUp(body)
    return userResponseSchema.parse(raw)
  }, [])
  const value = useMemo(
    () => ({
      api,
      user,
      setUser,
      booting,
      login,
      logout,
      register,
      isAuthenticated: !!user,
    }),
    [api, user, booting, login, logout, register]
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
