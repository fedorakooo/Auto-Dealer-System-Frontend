import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/features/auth/hooks/useAuth.js'
import { fetchCustomerByUserId } from '@/features/customers/customerService.js'
import { customerResponseSchema } from '@/features/customers/schemas.js'
import { QK } from '@/constants/queryKeys.js'
import { USER_ROLES } from '@/constants/roles.js'

export function useCustomerRecord() {
  const { api, user } = useAuth()

  return useQuery({
    queryKey: QK.customerByUser(user?.id),
    queryFn: async () => {
      const raw = await fetchCustomerByUserId(api, user.id)
      return customerResponseSchema.parse(raw)
    },
    enabled: !!user?.id && user.role === USER_ROLES.customer,
  })
}
