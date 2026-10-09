import { useQuery } from '@tanstack/react-query'
import { fetchVehicle, fetchVehicles } from '@/features/vehicles/vehicleService.js'
import { vehicleResponseSchema, vehiclesResponseSchema } from '@/features/vehicles/schemas.js'
import { QK } from '@/constants/queryKeys.js'
export function useVehiclesCatalogQuery(api, params) {
  return useQuery({
    queryKey: QK.vehicles({
      ...params,
      is_active: true,
    }),
    queryFn: async () => {
      const raw = await fetchVehicles(api, {
        limit: 12,
        ...params,
        is_active: true,
      })
      return vehiclesResponseSchema.parse(raw)
    },
  })
}
export function useVehicleDetailQuery(api, id) {
  return useQuery({
    queryKey: QK.vehicle(id),
    queryFn: async () => {
      const raw = await fetchVehicle(api, id)
      return vehicleResponseSchema.parse(raw)
    },
    enabled: !!id,
  })
}
