export async function fetchCities(api) {
  const { data } = await api.get('/cities')
  return data
}
