import { describe, it, expect } from 'vitest'
import { formatDate, formatDateTime, formatPrice } from '@/lib/format.js'

describe('formatPrice', () => {
  it('returns a dash for empty values', () => {
    expect(formatPrice(null)).toBe('—')
    expect(formatPrice(undefined)).toBe('—')
    expect(formatPrice('')).toBe('—')
  })

  it('formats numeric strings and numbers', () => {
    expect(formatPrice('1500.5').replace(/\s/g, '')).toBe('1500,5')
    expect(formatPrice(2000).replace(/\s/g, '')).toBe('2000')
  })

  it('falls back to the raw string for non-numeric input', () => {
    expect(formatPrice('abc')).toBe('abc')
  })
})

describe('date formatting', () => {
  it('returns a dash for invalid dates', () => {
    expect(formatDate('not-a-date')).toBe('—')
    expect(formatDateTime(null)).toBe('—')
  })

  it('formats valid ISO dates', () => {
    expect(formatDate('2025-03-14T10:00:00Z')).toMatch(/2025/)
    expect(formatDateTime('2025-03-14T10:00:00Z')).toMatch(/2025/)
  })
})
