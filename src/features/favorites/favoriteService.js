export async function fetchFavorites(api, customerId) {
  const { data } = await api.get(`/favorites/customer/${customerId}`)
  return data
}
export async function addFavorite(api, body) {
  await api.post('/favorites', body)
}
export async function removeFavorite(api, body) {
  await api.delete('/favorites', {
    data: body,
  })
}
