import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes.js'
import { PUBLIC_IMAGES } from '@/shared/config/publicImages.js'

const tiles = [
  {
    title: 'Автомобили в наличии',
    subtitle: 'Каталог и подбор по параметрам',
    href: ROUTES.vehicles,
    image: PUBLIC_IMAGES.tileStock,
  },
  {
    title: 'Тест-драйв',
    subtitle: 'Салон, дорога, запись',
    href: ROUTES.account,
    image: PUBLIC_IMAGES.tileTestdrive,
  },
  {
    title: 'Дилерские центры',
    subtitle: 'Салоны на карте и контакты',
    href: ROUTES.dealerships,
    image: PUBLIC_IMAGES.tileDealers,
  },
]

export function HomeQuickTiles() {
  return (
    <section className="mx-auto grid max-w-6xl gap-4 px-4 py-10 sm:grid-cols-3 sm:px-6 lg:px-8">
      {tiles.map((t) => (
        <Link
          key={t.href}
          to={t.href}
          className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
        >
          <img
            src={t.image}
            alt=""
            className="aspect-[553/404] w-full object-cover transition group-hover:scale-105"
            width={553}
            height={404}
          />
          <div className="p-4">
            <p className="font-semibold text-zinc-900 dark:text-zinc-50">{t.title}</p>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">{t.subtitle}</p>
          </div>
        </Link>
      ))}
    </section>
  )
}
