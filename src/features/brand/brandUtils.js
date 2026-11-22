import { DEFAULT_BRAND, DEFAULT_HOME_IMAGES } from '@/features/brand/defaults.js'
import { resolveMediaUrl } from '@/lib/mediaUrl.js'
import { LANGUAGE_LOCALES, isSupportedLanguage, localize } from '@/shared/i18n/index.js'

const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value)

/** Deep-merges the API payload over defaults; null/undefined never erase a default. */
export function mergeBrand(base, patch) {
  if (!isObject(patch)) return base
  const result = { ...base }
  for (const [key, value] of Object.entries(patch)) {
    if (value === null || value === undefined) continue
    result[key] = isObject(value) && isObject(base[key]) ? mergeBrand(base[key], value) : value
  }
  return result
}

export function normalizeBrand(payload) {
  return mergeBrand(DEFAULT_BRAND, payload)
}

/** Home images with bundled fallbacks; brand asset URLs are resolved against the API origin. */
export function homeImages(brand) {
  const configured = brand.home?.images ?? {}
  const pick = (key) => resolveMediaUrl(configured[key]) || DEFAULT_HOME_IMAGES[key]
  const promo = DEFAULT_HOME_IMAGES.promo.map(
    (fallback, i) => resolveMediaUrl(configured.promo?.[i]) || fallback
  )
  return {
    hero: pick('hero'),
    promo,
    tileStock: pick('tile_stock'),
    tileTestDrive: pick('tile_test_drive'),
    tileDealers: pick('tile_dealers'),
    serviceMaintenance: pick('service_maintenance'),
    serviceBooking: pick('service_booking'),
    serviceParts: pick('service_parts'),
  }
}

const escapeXml = (text) =>
  text.replace(
    /[<>&"']/g,
    (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' })[c]
  )

/** Monogram favicon in the accent colour, used when the brand has no favicon_url. */
export function monogramFavicon(shortName, accent) {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">` +
    `<rect width="64" height="64" rx="14" fill="${escapeXml(accent)}"/>` +
    `<text x="32" y="43" text-anchor="middle" font-family="Inter,Arial,sans-serif" font-size="26" ` +
    `font-weight="700" fill="#fff">${escapeXml(shortName)}</text></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

const THEME_VARS = {
  accent: '--color-accent',
  accent_strong: '--color-accent-strong',
  accent_subtle: '--color-accent-subtle',
  primary: '--color-primary',
  primary_hover: '--color-primary-hover',
  focus: '--color-focus',
}

export function applyTheme(theme, root = document.documentElement) {
  for (const [key, cssVar] of Object.entries(THEME_VARS)) {
    if (theme?.[key]) root.style.setProperty(cssVar, theme[key])
  }
}

function setMeta(selector, attrs) {
  let el = document.head.querySelector(selector)
  if (!el) {
    el = document.createElement(selector.startsWith('link') ? 'link' : 'meta')
    document.head.appendChild(el)
  }
  for (const [name, value] of Object.entries(attrs)) el.setAttribute(name, value)
}

/** Title, description, favicon, theme-color and <html lang> from the brand. */
export function applyDocument(brand, language = brand.locale.language) {
  document.documentElement.lang = language
  document.title = localize(brand.seo.title) || brand.name
  const description = localize(brand.seo.description)
  if (description) {
    setMeta('meta[name="description"]', { name: 'description', content: description })
  }
  setMeta('meta[name="theme-color"]', { name: 'theme-color', content: brand.theme.primary })
  if (brand.seo.og_image_url) {
    setMeta('meta[property="og:image"]', {
      property: 'og:image',
      content: resolveMediaUrl(brand.seo.og_image_url),
    })
  }
  const favicon =
    resolveMediaUrl(brand.favicon_url) || monogramFavicon(brand.short_name, brand.theme.accent)
  setMeta('link[rel="icon"]', { rel: 'icon', href: favicon })
  document.head.querySelector('link[rel="icon"]').removeAttribute('type')
}

/** Visitor choice wins over the brand default; formatting keeps the brand locale for its own language. */
export function resolveLanguage(brand, chosen) {
  const language = isSupportedLanguage(chosen) ? chosen : brand.locale.language
  const locale =
    language === brand.locale.language ? brand.locale.locale : LANGUAGE_LOCALES[language]
  return { language, locale }
}
