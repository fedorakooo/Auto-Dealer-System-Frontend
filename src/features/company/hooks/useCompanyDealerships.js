import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/features/auth/hooks/useAuth.js'
import { listDealerships } from '@/features/company/api/companyApi.js'
import { QK } from '@/constants/queryKeys.js'
export function useCompanyDealerships(
  params = {
    page: 1,
    limit: 20,
  }
) {
  const { api } = useAuth()
  return useQuery({
    queryKey: QK.dealerships(params),
    queryFn: () => listDealerships(api, params),
  })
}
