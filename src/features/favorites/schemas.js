import { z } from 'zod'
import { vehicleResponseSchema } from '@/features/vehicles/schemas.js'

export const favoritesResponseSchema = z.object({
  vehicles: z.array(vehicleResponseSchema),
})
