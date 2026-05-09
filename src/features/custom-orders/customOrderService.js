export async function fetchCustomOrdersByCustomer(api, customerId) {
  const { data } = await api.get(`/custom-orders/customer/${customerId}`)
  return data
}
export async function createCustomOrder(api, body) {
  const { data } = await api.post('/custom-orders', body)
  return data
}
export async function patchCustomOrderStatus(api, id, body) {
  const { data } = await api.patch(`/custom-orders/${id}/status`, body)
  return data
}
