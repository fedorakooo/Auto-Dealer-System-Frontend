export async function fetchOrders(api, params = {}) {
  const { data } = await api.get('/orders', {
    params,
  })
  return data
}
export async function fetchOrder(api, orderId) {
  const { data } = await api.get(`/orders/${orderId}`)
  return data
}
export async function createOrder(api, body) {
  const { data } = await api.post('/orders', body)
  return data
}
export async function patchOrderStatus(api, orderId, body) {
  const { data } = await api.patch(`/orders/${orderId}/status`, body)
  return data
}
