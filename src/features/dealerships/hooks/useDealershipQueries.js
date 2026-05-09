import { useQuery } from '@tanstack/react-query'
import { fetchDealership, fetchDealerships } from '@/features/dealerships/dealershipService.js'
import {
  dealershipResponseSchema,
  dealershipsResponseSchema,
} from '@/features/dealerships/schemas.js'
import { QK } from '@/constants/queryKeys.js'
export function useDealershipsCatalogQuery(
  api,
  params = {
    page: 1,
    limit: 100,
  }
) {
  return useQuery({
    queryKey: QK.dealerships(params),
    queryFn: async () => {
      const raw = await fetchDealerships(api, params)
      return dealershipsResponseSchema.parse(raw)
    },
  })
}
export function useDealershipDetailQuery(api, id) {
  const numId = Number(id)
  return useQuery({
    queryKey: QK.dealership(numId),
    queryFn: async () => {
      const raw = await fetchDealership(api, numId)
      return dealershipResponseSchema.parse(raw)
    },
    enabled: !!id && Number.isFinite(numId),
  })
}
