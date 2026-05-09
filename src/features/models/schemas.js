import { z } from 'zod'

export const modelResponseSchema = z.object({
  id: z.string().uuid(),
  body_type_id: z.number(),
  engine_id: z.number(),
  transmission_id: z.number(),
  name: z.string(),
  model_code: z.string().nullable().optional(),
  is_in_production: z.boolean().nullable().optional(),
  production_year_start: z.number().optional(),
  production_year_end: z.number().nullable().optional(),
  description: z.string().nullable().optional(),
  drive_type: z.string().nullable().optional(),
  created_at: z.string().nullable().optional(),
  updated_at: z.string().nullable().optional(),
})

export const modelsResponseSchema = z.object({
  models: z.array(modelResponseSchema),
  total: z.number(),
})
