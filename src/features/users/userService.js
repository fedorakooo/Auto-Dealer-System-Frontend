export async function fetchUser(api, userId) {
  const { data } = await api.get(`/users/${userId}`)
  return data
}
export async function fetchUsers(api, params = {}) {
  const { data } = await api.get('/users', {
    params,
  })
  return data
}
