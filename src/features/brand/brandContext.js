import { createContext, useContext } from 'react'
import { DEFAULT_BRAND } from '@/features/brand/defaults.js'

export const BrandContext = createContext(DEFAULT_BRAND)

/** Current deployment brand (always a complete object, defaults filled in). */
export function useBrand() {
  return useContext(BrandContext)
}

/** True when a feature (test_drives, custom_orders, …) is enabled for this deployment. */
export function useFeature(name) {
  return useBrand().features[name] !== false
}
