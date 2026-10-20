const LOCALE = 'ru-RU'

const priceFormatter = new Intl.NumberFormat(LOCALE, {
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
})

const dateTimeFormatter = new Intl.DateTimeFormat(LOCALE, {
  dateStyle: 'medium',
  timeStyle: 'short',
})

const dateFormatter = new Intl.DateTimeFormat(LOCALE, { dateStyle: 'medium' })

export function formatPrice(value) {
  if (value === null || value === undefined || value === '') return '—'
  const n = typeof value === 'string' ? parseFloat(value) : Number(value)
  if (Number.isNaN(n)) return String(value)
  return priceFormatter.format(n)
}

function toValidDate(value) {
  if (!value) return null
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

export function formatDateTime(value) {
  const date = toValidDate(value)
  return date ? dateTimeFormatter.format(date) : '—'
}

export function formatDate(value) {
  const date = toValidDate(value)
  return date ? dateFormatter.format(date) : '—'
}
