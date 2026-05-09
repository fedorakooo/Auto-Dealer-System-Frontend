export async function fetchModels(api, params = {}) {
  const { data } = await api.get('/models', {
    params,
  })
  return data
}
export async function fetchModel(api, modelId) {
  const { data } = await api.get(`/models/${modelId}`)
  return data
}
