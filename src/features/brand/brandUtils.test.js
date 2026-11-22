import { describe, it, expect } from 'vitest'
import {
  applyTheme,
  homeImages,
  mergeBrand,
  monogramFavicon,
  normalizeBrand,
} from '@/features/brand/brandUtils.js'
import { DEFAULT_BRAND, DEFAULT_HOME_IMAGES } from '@/features/brand/defaults.js'

describe('normalizeBrand', () => {
  it('returns defaults for a missing payload', () => {
    expect(normalizeBrand(undefined)).toEqual(DEFAULT_BRAND)
  })

  it('deep-merges the API payload and ignores nulls', () => {
    const brand = normalizeBrand({
      name: 'Toyota Center',
      tagline: null,
      theme: { accent: '#eb0a1e' },
      features: { custom_orders: false },
    })
    expect(brand.name).toBe('Toyota Center')
    expect(brand.tagline).toBeNull()
    expect(brand.theme.accent).toBe('#eb0a1e')
    expect(brand.theme.primary).toBe(DEFAULT_BRAND.theme.primary)
    expect(brand.features.custom_orders).toBe(false)
    expect(brand.features.test_drives).toBe(true)
  })

  it('replaces arrays instead of merging them', () => {
    const merged = mergeBrand({ social: [{ type: 'x', url: 'https://x.com' }] }, { social: [] })
    expect(merged.social).toEqual([])
  })
})

describe('homeImages', () => {
  it('falls back to bundled images', () => {
    const images = homeImages(DEFAULT_BRAND)
    expect(images.hero).toBe(DEFAULT_HOME_IMAGES.hero)
    expect(images.promo).toEqual(DEFAULT_HOME_IMAGES.promo)
  })

  it('uses configured absolute URLs', () => {
    const brand = normalizeBrand({
      home: {
        images: { hero: 'https://cdn.example/hero.jpg', promo: ['https://cdn.example/1.jpg'] },
      },
    })
    const images = homeImages(brand)
    expect(images.hero).toBe('https://cdn.example/hero.jpg')
    expect(images.promo[0]).toBe('https://cdn.example/1.jpg')
    expect(images.promo[1]).toBe(DEFAULT_HOME_IMAGES.promo[1])
  })
})

describe('theme and favicon', () => {
  it('sets CSS variables from the theme', () => {
    const root = document.createElement('div')
    applyTheme({ accent: '#123456', primary: '#000000' }, root)
    expect(root.style.getPropertyValue('--color-accent')).toBe('#123456')
    expect(root.style.getPropertyValue('--color-primary')).toBe('#000000')
  })

  it('builds an escaped SVG monogram', () => {
    const url = decodeURIComponent(monogramFavicon('A&B', '#eb0a1e'))
    expect(url).toContain('fill="#eb0a1e"')
    expect(url).toContain('A&amp;B')
  })
})
