import { z } from 'zod'

export const dealershipResponseSchema = z.object({
  id: z.number(),
  name: z.string(),
  address: z.string(),
  city_id: z.number(),
  phone_number: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  opening_hours: z.string().nullable().optional(),
  latitude: z.union([z.string(), z.number()]).nullable().optional(),
  longitude: z.union([z.string(), z.number()]).nullable().optional(),
  is_active: z.boolean().optional(),
  updated_at: z.string().nullable().optional(),
})

export const dealershipsResponseSchema = z.object({
  dealerships: z.array(dealershipResponseSchema),
  total: z.number(),
})
