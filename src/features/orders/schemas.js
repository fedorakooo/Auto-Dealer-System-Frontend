import { z } from 'zod'

const decimalLike = z.union([z.string(), z.number()]).transform((v) => String(v))

export const orderResponseSchema = z.object({
  id: z.string().uuid(),
  customer_id: z.string().uuid(),
  vehicle_id: z.string().uuid(),
  dealership_id: z.number(),
  status: z.string(),
  final_price: decimalLike,
  created_at: z.string().nullable().optional(),
  updated_at: z.string().nullable().optional(),
})

export const ordersResponseSchema = z.object({
  orders: z.array(orderResponseSchema),
  total: z.number(),
})
