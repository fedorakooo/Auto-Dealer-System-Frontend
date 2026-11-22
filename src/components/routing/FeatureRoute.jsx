import { useFeature } from '@/features/brand/brandContext.js'

/** Renders the page only when the brand enables the feature; otherwise the fallback (a 404). */
export function FeatureRoute({ feature, fallback = null, children }) {
  return useFeature(feature) ? children : fallback
}
