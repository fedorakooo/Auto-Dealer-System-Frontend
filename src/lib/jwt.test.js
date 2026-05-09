import { describe, it, expect } from 'vitest'
import { parseJwtPayload } from '@/lib/jwt.js'

describe('parseJwtPayload', () => {
  it('returns null for invalid tokens', () => {
    expect(parseJwtPayload('')).toBeNull()
    expect(parseJwtPayload('not-a-jwt')).toBeNull()
  })

  it('decodes JSON payload segment', () => {
    const payload = btoa(JSON.stringify({ id: 'user-1', sub: 'x' }))
    const token = `e30.${payload}.sig`
    expect(parseJwtPayload(token)).toEqual({ id: 'user-1', sub: 'x' })
  })
})
