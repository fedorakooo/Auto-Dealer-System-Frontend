import { z } from 'zod'

const decimalLike = z.union([z.string(), z.number()]).transform((v) => String(v))

export const vehicleResponseSchema = z.object({
  id: z.string().uuid(),
  model_id: z.string().uuid(),
  dealership_id: z.number(),
  vin: z.string(),
  production_year: z.number(),
  exterior_color: z.string(),
  interior_color: z.string().nullable().optional(),
  price: decimalLike,
  is_active: z.boolean().optional(),
  created_at: z.string().nullable().optional(),
  updated_at: z.string().nullable().optional(),
  model_name: z.string().nullable().optional(),
  images: z.array(z.string()).nullable().optional(),
})

export const vehiclesResponseSchema = z.object({
  vehicles: z.array(vehicleResponseSchema),
  total: z.number(),
})
