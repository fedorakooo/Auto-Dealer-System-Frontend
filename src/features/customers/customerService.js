export async function fetchCustomerByUserId(api, userId) {
  const { data } = await api.get(`/customers/user/${userId}`)
  return data
}
export async function fetchCustomer(api, customerId) {
  const { data } = await api.get(`/customers/${customerId}`)
  return data
}
export async function createCustomer(api, body) {
  const { data } = await api.post('/customers', body)
  return data
}
export async function patchCustomer(api, customerId, body) {
  const { data } = await api.patch(`/customers/${customerId}`, body)
  return data
}
