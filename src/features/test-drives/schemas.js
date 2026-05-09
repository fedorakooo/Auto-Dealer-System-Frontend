import { z } from 'zod'

export const testDriveResponseSchema = z.object({
  id: z.string().uuid(),
  customer_id: z.string().uuid(),
  vehicle_id: z.string().uuid(),
  dealership_id: z.number(),
  requested_datetime: z.string(),
  status: z.string(),
  notes: z.string().nullable().optional(),
  created_at: z.string().nullable().optional(),
  updated_at: z.string().nullable().optional(),
})

export const testDrivesResponseSchema = z.object({
  test_drives: z.array(testDriveResponseSchema),
})
