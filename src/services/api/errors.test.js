import { describe, it, expect } from 'vitest'
import axios from 'axios'
import { parseApiError } from '@/services/api/errors.js'

describe('parseApiError', () => {
  it('reads string detail from Axios error response', () => {
    const err = new axios.AxiosError(
      'fail',
      'ERR_BAD_REQUEST',
      {},
      {},
      {
        status: 422,
        data: { detail: 'Invalid payload' },
      }
    )
    const parsed = parseApiError(err)
    expect(parsed.message).toBe('Invalid payload')
    expect(parsed.status).toBe(422)
  })

  it('falls back for plain Error', () => {
    expect(parseApiError(new Error('oops')).message).toBe('oops')
  })
})
