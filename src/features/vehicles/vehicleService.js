export async function fetchVehicles(api, params = {}) {
  const { data } = await api.get('/vehicles', {
    params,
  })
  return data
}
export async function fetchVehicle(api, vehicleId) {
  const { data } = await api.get(`/vehicles/${vehicleId}`)
  return data
}
