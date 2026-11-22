import { endpoints } from '@/services/api/endpoints.js'

/** File types the photo upload inputs accept. */
export const ACCEPTED_IMAGE_TYPES = 'image/jpeg,image/png,image/webp'

/**
 * Media owners and the REST resources that store their photos.
 * `owner` is `{ id }` for a model or a dealership and `{ modelId, id }` for a vehicle (vehicles are nested in models).
 */
export const MEDIA_KINDS = {
  model: {
    list: (owner) => `${endpoints.modelMedia}/model/${owner.id}`,
    upload: () => `${endpoints.modelMedia}/upload`,
    item: (owner, mediaId) => `${endpoints.modelMedia}/${mediaId}`,
    ownerField: 'model_id',
  },
  vehicle: {
    list: (owner) => endpoints.vehicleMedia(owner.modelId, owner.id),
    upload: (owner) => endpoints.vehicleMedia(owner.modelId, owner.id),
    item: (owner, mediaId) => `${endpoints.vehicleMedia(owner.modelId, owner.id)}/${mediaId}`,
    ownerField: null,
  },
  dealership: {
    list: (owner) => endpoints.dealershipMedia(owner.id),
    upload: (owner) => endpoints.dealershipMedia(owner.id),
    item: (owner, mediaId) => `${endpoints.dealershipMedia(owner.id)}/${mediaId}`,
    ownerField: null,
  },
}

export async function fetchMedia(api, kind, owner) {
  const { data } = await api.get(MEDIA_KINDS[kind].list(owner))
  return data.media
}

export async function uploadMedia(api, kind, owner, file, fields = {}) {
  const { upload, ownerField } = MEDIA_KINDS[kind]
  const form = new FormData()
  if (ownerField) form.append(ownerField, owner.id)
  for (const [name, value] of Object.entries(fields)) form.append(name, String(value))
  form.append('file', file)
  const { data } = await api.post(upload(owner), form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function updateMedia(api, kind, owner, mediaId, body) {
  const { data } = await api.patch(MEDIA_KINDS[kind].item(owner, mediaId), body)
  return data
}

export async function deleteMedia(api, kind, owner, mediaId) {
  await api.delete(MEDIA_KINDS[kind].item(owner, mediaId))
}

export function mediaFileUrl(kind, owner, mediaId) {
  return `/api/v1${MEDIA_KINDS[kind].item(owner, mediaId)}/file`
}

/** Only the photos of a media list (videos and documents are skipped). */
export function onlyImages(media) {
  return (media ?? []).filter((item) => item.media_type === 'image')
}
