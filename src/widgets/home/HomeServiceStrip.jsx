import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes.js'
import { useBrand } from '@/features/brand/brandContext.js'
import { homeImages } from '@/features/brand/brandUtils.js'
import { t } from '@/shared/i18n/index.js'

const BLOCKS = [
  {
    textKey: 'home.service.blocks.maintenance',
    href: ROUTES.dealerships,
    image: 'serviceMaintenance',
  },
  {
    textKey: 'home.service.blocks.booking',
    href: ROUTES.dealerships,
    image: 'serviceBooking',
    feature: 'service_appointments',
  },
  {
    textKey: 'home.service.blocks.parts',
    href: ROUTES.dealerships,
    image: 'serviceParts',
  },
]

export function HomeServiceStrip() {
  const brand = useBrand()
  const images = homeImages(brand)
  const blocks = BLOCKS.filter((block) => !block.feature || brand.features[block.feature]).map(
    (block) => ({ ...block, image: images[block.image] })
  )
  return (
    <section
      className="bg-[var(--color-primary)] py-16 text-white sm:py-20"
      aria-labelledby="service-title"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 grid gap-5 lg:grid-cols-2 lg:items-end">
          <div>
            <p className="mb-3 text-xs font-semibold tracking-[0.22em] text-[color-mix(in_srgb,var(--color-accent)_70%,white)] uppercase">
              {t('home.service.kicker')}
            </p>
            <h2
              id="service-title"
              className="mb-0 max-w-xl text-3xl tracking-[-0.03em] text-white sm:text-4xl"
            >
              {t('home.service.title')}
            </h2>
          </div>
          <p className="mb-0 max-w-xl text-sm leading-6 text-slate-300 lg:justify-self-end">
            {t('home.service.description')}
          </p>
        </div>

        <div className="grid gap-5 sm:auto-cols-fr sm:grid-flow-col">
          {blocks.map((block) => (
            <Link
              key={block.textKey}
              to={block.href}
              className="group relative isolate min-h-72 overflow-hidden rounded-2xl border border-white/15 bg-[var(--color-primary-hover)] text-white"
            >
              <img
                src={block.image}
                alt=""
                className="absolute inset-0 -z-20 h-full w-full object-cover transition duration-500 group-hover:scale-[1.04] motion-reduce:transform-none"
                width={558}
                height={408}
                loading="lazy"
              />
              <span className="absolute inset-0 -z-10 bg-gradient-to-t from-slate-950 via-slate-950/45 to-slate-950/5" />
              <span className="absolute right-0 bottom-0 left-0 flex items-end justify-between gap-4 p-5">
                <span>
                  <span className="block font-semibold text-white">
                    {t(`${block.textKey}.title`)}
                  </span>
                  <span className="mt-1 block text-sm text-slate-300">
                    {t(`${block.textKey}.subtitle`)}
                  </span>
                </span>
                <span
                  className="text-xl text-white/65 transition-transform group-hover:translate-x-1 group-hover:text-white"
                  aria-hidden="true"
                >
                  →
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
