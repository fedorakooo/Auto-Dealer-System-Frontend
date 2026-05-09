export async function fetchDealerships(api, params = {}) {
  const { data } = await api.get('/dealerships', {
    params,
  })
  return data
}
export async function fetchDealership(api, id) {
  const { data } = await api.get(`/dealerships/${id}`)
  return data
}
