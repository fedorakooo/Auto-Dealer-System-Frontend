import { resolveMediaUrl } from '@/lib/mediaUrl.js'

function resolveAll(urls) {
  return (urls ?? []).map((url) => resolveMediaUrl(url)).filter(Boolean)
}

/** Photos of a model: its appearance only. */
export function getModelPhotos(model) {
  return resolveAll(model?.images)
}

/**
 * Photos of a concrete vehicle. `own` shows this exact car; `model` is the model's appearance.
 * `cover` prefers the vehicle's own photo and falls back to the model's one.
 */
export function getVehiclePhotos(vehicle) {
  const own = resolveAll(vehicle?.images)
  const model = resolveAll(vehicle?.model_images)
  return {
    own,
    model,
    cover: own[0] ?? model[0] ?? null,
    coverIsModelPhoto: own.length === 0 && model.length > 0,
  }
}
