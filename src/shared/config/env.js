import { z } from 'zod'
const raw = import.meta.env
const publicEnvSchema = z.object({
  VITE_API_BASE_URL: z.string().optional(),
  VITE_APP_ENV: z.enum(['development', 'production', 'test']).optional(),
})
const envCheck = publicEnvSchema.safeParse({
  VITE_API_BASE_URL: raw.VITE_API_BASE_URL,
  VITE_APP_ENV: raw.VITE_APP_ENV,
})
if (!envCheck.success && import.meta.env.DEV) {
  console.warn('[env] Invalid public env', envCheck.error.flatten().fieldErrors)
}
export const apiBaseUrl =
  typeof raw.VITE_API_BASE_URL === 'string' ? raw.VITE_API_BASE_URL.trim() : ''
export const resolvedApiBaseUrl = (() => {
  const u = apiBaseUrl.replace(/\/$/, '')
  return u || '/api/v1'
})()
export const appEnv =
  raw.VITE_APP_ENV === 'production' || raw.VITE_APP_ENV === 'test'
    ? raw.VITE_APP_ENV
    : raw.MODE === 'production'
      ? 'production'
      : 'development'
export const isDev = appEnv === 'development'
// Without VITE_API_BASE_URL the app calls same-origin /api/v1 (proxied by nginx in the image).
