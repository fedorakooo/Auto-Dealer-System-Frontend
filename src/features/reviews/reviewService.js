export async function fetchReviewsByModel(api, modelId) {
  const { data } = await api.get(`/reviews/model/${modelId}`)
  return data
}
export async function fetchReviewsByCustomer(api, customerId) {
  const { data } = await api.get(`/reviews/customer/${customerId}`)
  return data
}
export async function createReview(api, body) {
  const { data } = await api.post('/reviews', body)
  return data
}
