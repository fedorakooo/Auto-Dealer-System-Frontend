import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes.js'
import { useBrand } from '@/features/brand/brandContext.js'
import { homeImages } from '@/features/brand/brandUtils.js'
import { t, localize } from '@/shared/i18n/index.js'

const PROMOS = [
  {
    key: 'a',
    textKey: 'home.hero.promos.inspection',
    href: ROUTES.dealerships,
  },
  {
    key: 'b',
    textKey: 'home.hero.promos.stock',
    href: ROUTES.vehicles,
  },
  {
    key: 'c',
    textKey: 'home.hero.promos.testDrive',
    href: ROUTES.account,
    feature: 'test_drives',
  },
]

export function HomeHeroPromoStrip() {
  const brand = useBrand()
  const images = homeImages(brand)
  const { home } = brand
  const promos = PROMOS.filter((promo) => !promo.feature || brand.features[promo.feature])
  return (
    <section className="relative isolate overflow-hidden bg-[var(--color-primary)] text-[var(--color-on-primary)]">
      <img
        src={images.hero}
        alt={t('home.hero.imageAlt')}
        className="absolute inset-0 -z-20 h-full w-full object-cover object-[62%_center]"
        width={1600}
        height={900}
        fetchPriority="high"
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(15,23,42,0.98)_0%,rgba(15,23,42,0.9)_42%,rgba(15,23,42,0.38)_72%,rgba(15,23,42,0.12)_100%)]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgba(15,23,42,0.52)_0%,transparent_45%)]" />

      <div className="mx-auto flex min-h-[38rem] max-w-6xl items-center px-4 py-20 sm:px-6 lg:min-h-[42rem] lg:px-8">
        <div className="max-w-2xl">
          <p className="mb-5 flex items-center gap-3 text-xs font-semibold tracking-[0.24em] text-white/75 uppercase">
            <span className="h-px w-10 bg-[var(--color-accent)]" aria-hidden="true" />
            {localize(home.hero_kicker) || t('home.hero.kicker')}
          </p>
          <h1 className="max-w-xl text-4xl leading-[1.05] font-semibold tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
            {localize(home.hero_title) || t('home.hero.title')}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-slate-200 sm:text-lg">
            {localize(home.hero_subtitle) || t('home.hero.subtitle')}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              to={ROUTES.vehicles}
              className="inline-flex min-h-12 items-center justify-center gap-3 rounded-lg bg-[var(--color-accent)] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_color-mix(in_srgb,var(--color-accent)_28%,transparent)] transition hover:-translate-y-0.5 hover:bg-[var(--color-accent-strong)] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white motion-reduce:hover:translate-y-0"
            >
              {t('home.hero.vehiclesCta')}
              <span aria-hidden="true">→</span>
            </Link>
            <Link
              to={ROUTES.models}
              className="inline-flex min-h-12 items-center border-b border-white/40 px-1 text-sm font-semibold text-white transition hover:border-white hover:text-white"
            >
              {t('home.hero.modelsCta')}
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-white/15 bg-slate-950/45 backdrop-blur-md">
        <div className="mx-auto grid max-w-6xl gap-px px-4 sm:auto-cols-fr sm:grid-flow-col sm:px-6 lg:px-8">
          {promos.map((promo, index) => (
            <Link
              key={promo.key}
              to={promo.href}
              className="group flex min-h-24 items-center justify-between gap-4 border-white/15 py-5 text-white sm:px-5 sm:not-first:border-l"
            >
              <span>
                <span className="block text-[0.65rem] font-semibold tracking-[0.18em] text-white/55 uppercase">
                  0{index + 1}
                </span>
                <span className="mt-1 block text-sm font-semibold">
                  {t(`${promo.textKey}.title`)}
                </span>
                <span className="mt-1 block text-xs text-white/65">
                  {t(`${promo.textKey}.subtitle`)}
                </span>
              </span>
              <span
                className="text-xl text-white/55 transition-transform group-hover:translate-x-1 group-hover:text-white"
                aria-hidden="true"
              >
                →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
