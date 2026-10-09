/** Operational endpoints intentionally use the backend's generic `{ data }` / `{ items }` envelopes. */
export async function fetchOperationList(api, path, params = {}) {
  const { data } = await api.get(path, { params })
  return data?.items ?? data?.data ?? data ?? []
}

export async function createWithIdempotency(api, path, body, key) {
  const { data } = await api.post(path, body, { headers: { 'Idempotency-Key': key } })
  return data
}

export async function mutateOperation(api, method, path, body) {
  const response = await api.request({ method, url: path, data: body })
  // Axios represents 204 as an empty string. Callers must never JSON-parse it.
  return response.status === 204 ? undefined : response.data
}

export function actionIdempotencyKey(scope) {
  const storageKey = `ads:idempotency:${scope}`
  const existing = sessionStorage.getItem(storageKey)
  if (existing) return existing
  const key = crypto.randomUUID()
  sessionStorage.setItem(storageKey, key)
  return key
}

export function clearActionIdempotencyKey(scope) {
  sessionStorage.removeItem(`ads:idempotency:${scope}`)
}

export async function uploadModelMedia(api, formData) {
  const { data } = await api.post('/model-media/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}
