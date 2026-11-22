import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  actionIdempotencyKey,
  createWithIdempotency,
  mutateOperation,
} from './operationsService.js'

describe('operational API helpers', () => {
  beforeEach(() => sessionStorage.clear())

  it('reuses an idempotency key for the same service action', () => {
    expect(actionIdempotencyKey('service-appointment')).toBe(
      actionIdempotencyKey('service-appointment')
    )
  })

  it('sends an idempotency header for a payment or appointment', async () => {
    const post = vi.fn().mockResolvedValue({ data: { data: { id: 'payment' } } })
    await createWithIdempotency({ post }, '/orders/id/payments', { amount: '1.00' }, 'key-12345678')
    expect(post).toHaveBeenCalledWith(
      '/orders/id/payments',
      { amount: '1.00' },
      { headers: { 'Idempotency-Key': 'key-12345678' } }
    )
  })

  it('does not attempt to parse a 204 response body', async () => {
    const request = vi.fn().mockResolvedValue({ status: 204, data: '' })
    await expect(
      mutateOperation({ request }, 'delete', '/customers/me/addresses/1')
    ).resolves.toBeUndefined()
  })
})
