import { z } from 'zod'

export const userResponseSchema = z.object({
  id: z.string().uuid(),
  first_name: z.string(),
  second_name: z.string(),
  phone_number: z.string(),
  email: z.string().email(),
  role: z.enum(['customer', 'employee', 'admin']),
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string().nullable().optional(),
})

export const usersResponseSchema = z.object({
  users: z.array(userResponseSchema),
  total: z.number(),
})
