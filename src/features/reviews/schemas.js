import { z } from 'zod'

export const reviewResponseSchema = z.object({
  id: z.string().uuid(),
  customer_id: z.string().uuid(),
  model_id: z.string().uuid(),
  rating: z.number(),
  title: z.string().nullable().optional(),
  comment: z.string().nullable().optional(),
  created_at: z.string().nullable().optional(),
  updated_at: z.string().nullable().optional(),
})

export const reviewsResponseSchema = z.object({
  reviews: z.array(reviewResponseSchema),
})
