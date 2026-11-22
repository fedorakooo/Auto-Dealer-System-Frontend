import clsx from 'clsx'
import { LANGUAGES, getLanguage, t } from '@/shared/i18n/index.js'
import { useLanguageStore } from '@/shared/i18n/languageStore.js'

/** RU/EN toggle; the choice is remembered per browser and overrides the brand default. */
export function LanguageSwitcher({ className }) {
  const setLanguage = useLanguageStore((s) => s.setLanguage)
  const current = getLanguage()
  return (
    <div
      role="group"
      aria-label={t('common.language.label')}
      className={clsx('inline-flex rounded-md border border-white/20 p-0.5 text-xs', className)}
    >
      {LANGUAGES.map((code) => (
        <button
          key={code}
          type="button"
          lang={code}
          aria-pressed={current === code}
          title={t(`common.language.${code}`)}
          onClick={() => setLanguage(code)}
          className={clsx(
            'min-h-8 min-w-9 rounded px-2 font-semibold uppercase transition-colors',
            current === code
              ? 'bg-white text-[var(--color-primary)]'
              : 'text-[var(--color-on-primary-muted)] hover:text-white'
          )}
        >
          {code}
        </button>
      ))}
    </div>
  )
}
