import { endpoints } from '@/services/api'
export async function listDealerships(api, params = {}) {
  const { data } = await api.get(endpoints.dealerships, {
    params,
  })
  return data
}
export async function getDealership(api, id) {
  const { data } = await api.get(endpoints.dealership(id))
  return data
}
