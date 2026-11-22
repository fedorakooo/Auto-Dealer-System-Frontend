import { afterEach, describe, it, expect } from 'vitest'
import {
  compareText,
  configureFormatting,
  formatDate,
  formatDateTime,
  formatNumber,
  formatPrice,
  getCurrency,
} from '@/lib/format.js'

const compact = (text) => text.replace(/\s/g, '')

afterEach(() => configureFormatting({ locale: 'ru-RU', currency: 'BYN', timeZone: 'UTC' }))

describe('formatPrice', () => {
  it('returns a dash for empty values', () => {
    expect(formatPrice(null)).toBe('—')
    expect(formatPrice(undefined)).toBe('—')
    expect(formatPrice('')).toBe('—')
  })

  it('formats numeric strings and numbers with the configured currency', () => {
    configureFormatting({ locale: 'ru-RU', currency: 'BYN' })
    expect(compact(formatPrice('1500.5'))).toMatch(/^1500,5(BYN|Br)$/)
    expect(compact(formatPrice(2000))).toMatch(/^2000(BYN|Br)$/)
  })

  it('follows the brand locale and currency', () => {
    configureFormatting({ locale: 'en-US', currency: 'USD' })
    expect(formatPrice(45000)).toBe('$45,000')
    expect(getCurrency()).toBe('USD')
  })

  it('keeps previous settings when the currency is invalid', () => {
    configureFormatting({ currency: 'NOT-A-CODE' })
    expect(getCurrency()).toBe('BYN')
  })

  it('falls back to the raw string for non-numeric input', () => {
    expect(formatPrice('abc')).toBe('abc')
  })
})

describe('formatNumber and compareText', () => {
  it('formats plain numbers without currency', () => {
    expect(compact(formatNumber(12345.5))).toBe('12345,5')
  })

  it('sorts with the configured locale', () => {
    expect(['Гомель', 'Брест', 'Минск'].sort(compareText)).toEqual(['Брест', 'Гомель', 'Минск'])
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
