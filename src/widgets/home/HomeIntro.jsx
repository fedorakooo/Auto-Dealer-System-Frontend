import { t } from '@/shared/i18n/index.js'
const benefits = [
  { number: '01', textKey: 'home.intro.benefits.search' },
  { number: '02', textKey: 'home.intro.benefits.booking' },
  { number: '03', textKey: 'home.intro.benefits.allInOne' },
]

export function HomeIntro() {
  return (
    <section
      className="border-b border-[var(--color-border)] bg-[var(--color-surface)] py-14 sm:py-16"
      aria-labelledby="benefits-title"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_2.2fr] lg:items-start">
          <div>
            <p className="mb-3 text-xs font-semibold tracking-[0.22em] text-[var(--color-accent)] uppercase">
              {t('home.intro.kicker')}
            </p>
            <h2
              id="benefits-title"
              className="max-w-xs text-2xl tracking-[-0.025em] text-[var(--color-text)] sm:text-3xl"
            >
              {t('home.intro.title')}
            </h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            {benefits.map((benefit) => (
              <article
                key={benefit.number}
                className="border-l-2 border-[var(--color-border)] pl-5 transition-colors hover:border-[var(--color-accent)]"
              >
                <span className="text-xs font-semibold tracking-[0.16em] text-[var(--color-accent)]">
                  {benefit.number}
                </span>
                <h3 className="mt-3 mb-2 text-base text-[var(--color-text)]">
                  {t(`${benefit.textKey}.title`)}
                </h3>
                <p className="mb-0 text-sm leading-6 text-[var(--color-text-muted)]">
                  {t(`${benefit.textKey}.text`)}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
