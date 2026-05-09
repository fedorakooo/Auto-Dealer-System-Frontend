import { STORAGE_ACCESS_TOKEN, STORAGE_REFRESH_TOKEN } from '@/constants/storageKeys.js'

export function getAccessToken() {
  return localStorage.getItem(STORAGE_ACCESS_TOKEN)
}

export function getRefreshToken() {
  return localStorage.getItem(STORAGE_REFRESH_TOKEN)
}

export function setTokens(tokens) {
  localStorage.setItem(STORAGE_ACCESS_TOKEN, tokens.access_token)
  localStorage.setItem(STORAGE_REFRESH_TOKEN, tokens.refresh_token)
}

export function clearTokens() {
  localStorage.removeItem(STORAGE_ACCESS_TOKEN)
  localStorage.removeItem(STORAGE_REFRESH_TOKEN)
}
