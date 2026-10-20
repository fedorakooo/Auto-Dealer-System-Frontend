import { endpoints } from '@/services/api/endpoints.js'

/** Media owners and the REST resources that store their photos. */
export const MEDIA_KINDS = {
  model: { base: endpoints.modelMedia, ownerField: 'model_id', listPath: 'model' },
  vehicle: { base: endpoints.vehicleMedia, ownerField: 'vehicle_id', listPath: 'vehicle' },
}

export async function fetchMedia(api, kind, ownerId) {
  const { base, listPath } = MEDIA_KINDS[kind]
  const { data } = await api.get(`${base}/${listPath}/${ownerId}`)
  return data.media
}

export async function uploadMedia(api, kind, ownerId, file) {
  const { base, ownerField } = MEDIA_KINDS[kind]
  const form = new FormData()
  form.append(ownerField, ownerId)
  form.append('file', file)
  const { data } = await api.post(`${base}/upload`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function deleteMedia(api, kind, mediaId) {
  await api.delete(`${MEDIA_KINDS[kind].base}/${mediaId}`)
}

export function mediaFileUrl(kind, mediaId) {
  return `/api/v1/${MEDIA_KINDS[kind].base.replace(/^\//, '')}/${mediaId}/file`
}
