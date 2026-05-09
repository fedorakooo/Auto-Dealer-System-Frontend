import { z } from 'zod'

const citySchema = z.object({
  id: z.number(),
  name: z.string(),
})

export const citiesResponseSchema = z.object({
  cities: z.array(citySchema),
})
