export async function fetchTestDrivesByCustomer(api, customerId) {
  const { data } = await api.get(`/test-drives/customer/${customerId}`)
  return data
}
export async function createTestDrive(api, body) {
  const { data } = await api.post('/test-drives', body)
  return data
}
export async function patchTestDriveStatus(api, id, body) {
  const { data } = await api.patch(`/test-drives/${id}/status`, body)
  return data
}
