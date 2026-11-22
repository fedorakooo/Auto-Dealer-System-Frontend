import axios from 'axios'
import { endpoints } from '@/services/api/endpoints.js'
import { resolvedApiBaseUrl } from '@/shared/config/env.js'

/** Public brand config; fetched without auth so it works before login. */
export async function fetchBrand() {
  const { data } = await axios.get(`${resolvedApiBaseUrl}${endpoints.brand}`, { timeout: 10_000 })
  return data
}
