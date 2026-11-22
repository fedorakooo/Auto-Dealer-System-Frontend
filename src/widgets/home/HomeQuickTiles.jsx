import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes.js'
import { useBrand } from '@/features/brand/brandContext.js'
import { homeImages } from '@/features/brand/brandUtils.js'
import { t } from '@/shared/i18n/index.js'

const TILES = [
  {
    textKey: 'home.quickTiles.tiles.stock',
    href: ROUTES.vehicles,
    image: 'tileStock',
  },
  {
    textKey: 'home.quickTiles.tiles.testDrive',
    href: ROUTES.account,
    image: 'tileTestDrive',
    feature: 'test_drives',
  },
  {
    textKey: 'home.quickTiles.tiles.dealerships',
    href: ROUTES.dealerships,
    image: 'tileDealers',
  },
]

export function HomeQuickTiles() {
  const brand = useBrand()
  const images = homeImages(brand)
  const tiles = TILES.filter((tile) => !tile.feature || brand.features[tile.feature]).map(
    (tile) => ({ ...tile, image: images[tile.image] })
  )
  return (
    <section className="bg-[var(--color-bg)] py-16 sm:py-20" aria-labelledby="quick-title">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 text-xs font-semibold tracking-[0.22em] text-[var(--color-accent)] uppercase">
              {t('home.quickTiles.kicker')}
            </p>
            <h2
              id="quick-title"
              className="mb-0 text-3xl tracking-[-0.03em] text-[var(--color-text)] sm:text-4xl"
            >
              {t('home.quickTiles.title')}
            </h2>
          </div>
          <p className="mb-0 max-w-md text-sm leading-6 text-[var(--color-text-muted)]">
            {t('home.quickTiles.description')}
          </p>
        </div>

        <div className="grid gap-5 sm:auto-cols-fr sm:grid-flow-col">
          {tiles.map((tile, index) => (
            <Link
              key={tile.href}
              to={tile.href}
              className="group overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-card)] transition duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-[var(--shadow-card-hover)] motion-reduce:hover:translate-y-0"
            >
              <div className="relative overflow-hidden">
                <img
                  src={tile.image}
                  alt=""
                  className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-[1.04] motion-reduce:transform-none"
                  width={553}
                  height={404}
                  loading={index === 0 ? 'eager' : 'lazy'}
                />
                <span className="absolute top-4 left-4 rounded-full border border-white/30 bg-slate-950/70 px-3 py-1 text-[0.65rem] font-semibold tracking-[0.14em] text-white uppercase backdrop-blur-sm">
                  0{index + 1}
                </span>
              </div>
              <div className="flex items-start justify-between gap-4 p-5">
                <span>
                  <span className="block font-semibold text-[var(--color-text)]">
                    {t(`${tile.textKey}.title`)}
                  </span>
                  <span className="mt-1 block text-sm leading-6 text-[var(--color-text-muted)]">
                    {t(`${tile.textKey}.subtitle`)}
                  </span>
                </span>
                <span
                  className="mt-1 text-xl text-[var(--color-text-muted)] transition-transform group-hover:translate-x-1 group-hover:text-[var(--color-accent)]"
                  aria-hidden="true"
                >
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
