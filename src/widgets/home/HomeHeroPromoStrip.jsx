import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes.js'
import { PUBLIC_IMAGES } from '@/shared/config/publicImages.js'

const promos = [
  {
    key: 'a',
    title: 'Весенняя проверка',
    subtitle: 'Профилактика и диагностика',
    href: ROUTES.dealerships,
    image: PUBLIC_IMAGES.heroPromo1,
  },
  {
    key: 'b',
    title: 'Авто в наличии',
    subtitle: 'Подбор за один визит',
    href: ROUTES.vehicles,
    image: PUBLIC_IMAGES.heroPromo2,
  },
  {
    key: 'c',
    title: 'Тест-драйв',
    subtitle: 'Запись онлайн',
    href: ROUTES.account,
    image: PUBLIC_IMAGES.heroPromo3,
  },
]

export function HomeHeroPromoStrip() {
  return (
    <section className="border-b border-zinc-200 bg-zinc-900 text-white dark:border-zinc-800">
      <div className="mx-auto grid max-w-6xl gap-4 px-4 py-8 sm:grid-cols-3 sm:px-6 lg:px-8">
        {promos.map((p) => (
          <Link
            key={p.key}
            to={p.href}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-800/50"
          >
            <img
              src={p.image}
              alt=""
              className="h-40 w-full object-cover opacity-90 transition group-hover:scale-105 group-hover:opacity-100"
              width={640}
              height={360}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute right-0 bottom-0 left-0 p-4">
              <p className="text-sm font-semibold">{p.title}</p>
              <p className="text-xs text-zinc-300">{p.subtitle}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
