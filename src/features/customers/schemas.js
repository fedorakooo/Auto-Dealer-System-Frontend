import { z } from 'zod'

export const customerResponseSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  date_of_birth: z.string().nullable().optional(),
})
