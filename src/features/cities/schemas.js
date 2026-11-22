import { z } from 'zod'

const citySchema = z.object({
  id: z.number(),
  name: z.string(),
  country: z.string().optional(),
})

export const citiesResponseSchema = z.object({
  cities: z.array(citySchema),
})
