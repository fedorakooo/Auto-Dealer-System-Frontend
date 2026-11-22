import { afterEach, describe, it, expect } from 'vitest'
import { getLanguage, localize, setLanguage, t } from '@/shared/i18n/index.js'
import { normalizeBrand, resolveLanguage } from '@/features/brand/brandUtils.js'
import en from '@/shared/i18n/locales/en/index.js'
import ru from '@/shared/i18n/locales/ru/index.js'

afterEach(() => setLanguage('ru'))

/** Flattens a nested dictionary into dot-path keys; plural maps count as one key. */
function keysOf(node, prefix = '') {
  return Object.entries(node).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key
    const isLeaf = typeof value === 'string' || 'other' in value
    return isLeaf ? [path] : keysOf(value, path)
  })
}

describe('t', () => {
  it('translates nested keys and interpolates params', () => {
    expect(t('price.withCurrency', { currency: 'BYN' })).toBe('Цена, BYN')
    setLanguage('en')
    expect(t('price.withCurrency', { currency: 'BYN' })).toBe('Price, BYN')
  })

  it('falls back to the given fallback, then to the key', () => {
    expect(t('missing.key', {}, 'x')).toBe('x')
    expect(t('missing.key')).toBe('missing.key')
  })

  it('ignores unsupported languages', () => {
    setLanguage('de')
    expect(getLanguage()).toBe('ru')
  })
})

describe('dictionaries', () => {
  it('have the same keys in ru and en', () => {
    expect(keysOf(en).sort()).toEqual(keysOf(ru).sort())
  })
})

describe('localize', () => {
  it('passes plain strings through and picks the current language from maps', () => {
    expect(localize('Toyota')).toBe('Toyota')
    expect(localize({ ru: 'Привет', en: 'Hello' })).toBe('Привет')
    setLanguage('en')
    expect(localize({ ru: 'Привет', en: 'Hello' })).toBe('Hello')
    expect(localize({ ru: 'Только ru' })).toBe('Только ru')
    expect(localize(null)).toBeNull()
  })
})

describe('resolveLanguage', () => {
  const brand = normalizeBrand({ locale: { language: 'ru', locale: 'ru-BY' } })

  it('uses the brand language and locale by default', () => {
    expect(resolveLanguage(brand, null)).toEqual({ language: 'ru', locale: 'ru-BY' })
  })

  it('lets the visitor switch language with a matching locale', () => {
    expect(resolveLanguage(brand, 'en')).toEqual({ language: 'en', locale: 'en-GB' })
  })
})
