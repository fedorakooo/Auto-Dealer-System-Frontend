import { useQuery } from '@tanstack/react-query'
import { fetchVehicle, fetchVehicles } from '@/features/vehicles/vehicleService.js'
import { vehicleResponseSchema, vehiclesResponseSchema } from '@/features/vehicles/schemas.js'
import { QK } from '@/constants/queryKeys.js'
export function useVehiclesCatalogQuery(api, page) {
  return useQuery({
    queryKey: QK.vehicles({
      page,
      is_active: true,
    }),
    queryFn: async () => {
      const raw = await fetchVehicles(api, {
        page,
        limit: 12,
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
