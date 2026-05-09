import { z } from 'zod'

const decimalLike = z.union([z.string(), z.number(), z.null()]).optional()

export const customOrderResponseSchema = z.object({
  id: z.string().uuid(),
  customer_id: z.string().uuid(),
  dealership_id: z.number(),
  model_id: z.string().uuid(),
  engine_id: z.number(),
  transmission_id: z.number(),
  exterior_color: z.string(),
  interior_color: z.string().nullable().optional(),
  status: z.string(),
  estimated_price: decimalLike,
  final_price: decimalLike,
  notes: z.string().nullable().optional(),
  created_at: z.string().nullable().optional(),
  updated_at: z.string().nullable().optional(),
})

export const customOrdersResponseSchema = z.object({
  custom_orders: z.array(customOrderResponseSchema),
})
