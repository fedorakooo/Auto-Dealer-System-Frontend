/** Locale-aware formatting; configured once from the brand (locale, currency, timezone). */
let settings = { locale: 'ru-RU', currency: 'BYN', timeZone: undefined }
let formatters = buildFormatters(settings)

function buildFormatters({ locale, currency, timeZone }) {
  return {
    price: new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      currencyDisplay: 'symbol',
      maximumFractionDigits: 2,
      minimumFractionDigits: 0,
    }),
    number: new Intl.NumberFormat(locale, { maximumFractionDigits: 2, minimumFractionDigits: 0 }),
    dateTime: new Intl.DateTimeFormat(locale, {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone,
    }),
    date: new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeZone }),
  }
}

export function configureFormatting({ locale, currency, timeZone } = {}) {
  const next = {
    locale: locale || settings.locale,
    currency: currency || settings.currency,
    timeZone: timeZone || settings.timeZone,
  }
  try {
    formatters = buildFormatters(next)
    settings = next
  } catch (error) {
    console.warn('[format] Invalid locale settings, keeping previous ones', error)
  }
}

export function getLocale() {
  return settings.locale
}

export function getCurrency() {
  return settings.currency
}

function toNumber(value) {
  if (value === null || value === undefined || value === '') return null
  return typeof value === 'string' ? parseFloat(value) : Number(value)
}

/** Price with the deployment currency, e.g. "45 000 €". */
export function formatPrice(value) {
  const n = toNumber(value)
  if (n === null) return '—'
  if (Number.isNaN(n)) return String(value)
  return formatters.price.format(n)
}

/** Plain number in the deployment locale (no currency). */
export function formatNumber(value) {
  const n = toNumber(value)
  if (n === null) return '—'
  if (Number.isNaN(n)) return String(value)
  return formatters.number.format(n)
}

/** Locale-aware string comparison for sorting names. */
export function compareText(a, b) {
  return String(a ?? '').localeCompare(String(b ?? ''), settings.locale)
}

function toValidDate(value) {
  if (!value) return null
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

export function formatDateTime(value) {
  const date = toValidDate(value)
  return date ? formatters.dateTime.format(date) : '—'
}

export function formatDate(value) {
  const date = toValidDate(value)
  return date ? formatters.date.format(date) : '—'
}
