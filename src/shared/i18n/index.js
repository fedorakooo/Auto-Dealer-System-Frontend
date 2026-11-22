/**
 * Tiny i18n layer (ru/en). Dictionaries are nested objects per namespace (see ./locales); keys are dot paths:
 * t('home.hero.title'). A value may be a plural map ({ one, few, many, other }) picked by params.count.
 * Never call t() at module scope: the language can change at runtime (the app re-renders on switch).
 */
import en from '@/shared/i18n/locales/en/index.js'
import ru from '@/shared/i18n/locales/ru/index.js'

export const LANGUAGES = ['ru', 'en']
export const DEFAULT_LANGUAGE = 'ru'
/** Formatting locale used when the visitor's language differs from the brand's own language. */
export const LANGUAGE_LOCALES = { ru: 'ru-RU', en: 'en-GB' }

const dictionaries = { ru, en }
const pluralRules = {}

let language = DEFAULT_LANGUAGE

export function isSupportedLanguage(value) {
  return LANGUAGES.includes(value)
}

export function setLanguage(next) {
  language = isSupportedLanguage(next) ? next : DEFAULT_LANGUAGE
}

export function getLanguage() {
  return language
}

function lookup(dict, key) {
  let node = dict
  for (const part of key.split('.')) {
    if (node === null || typeof node !== 'object' || !(part in node)) return undefined
    node = node[part]
  }
  return node
}

function pick(value, count) {
  if (value === null || typeof value !== 'object' || !('other' in value)) return value
  if (typeof count !== 'number') return value.other
  pluralRules[language] ??= new Intl.PluralRules(LANGUAGE_LOCALES[language])
  return value[pluralRules[language].select(count)] ?? value.other
}

/** Translates a key; falls back to Russian, then to `fallback` (or the key itself). */
export function t(key, params = {}, fallback = key) {
  const raw = lookup(dictionaries[language], key) ?? lookup(dictionaries.ru, key)
  const template = pick(raw, params.count)
  if (typeof template !== 'string') return fallback
  return template.replace(/\{(\w+)\}/g, (_, name) =>
    name in params ? String(params[name]) : `{${name}}`
  )
}

/** Label for an enum code of a lookup group (fuel, transmission, drive); the raw code if unknown. */
export function codeLabel(group, code) {
  return code ? t(`${group}.${code}`, {}, code) : ''
}

/** Picks the current language from a brand text that is either a plain string or { ru, en }. */
export function localize(value) {
  if (value === null || value === undefined) return value
  if (typeof value === 'string') return value
  return value[language] ?? value[DEFAULT_LANGUAGE] ?? Object.values(value)[0] ?? null
}
