import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes.js'
import { PUBLIC_IMAGES } from '@/shared/config/publicImages.js'

const blocks = [
  {
    title: 'Сервисное обслуживание',
    subtitle: 'ТО, диагностика, ремонт',
    href: ROUTES.dealerships,
    image: PUBLIC_IMAGES.serviceMaintenance,
  },
  {
    title: 'Запись в сервис',
    subtitle: 'Онлайн и в салоне',
    href: ROUTES.dealerships,
    image: PUBLIC_IMAGES.serviceBooking,
  },
  {
    title: 'Запасные части',
    subtitle: 'Оригинальные комплектующие',
    href: ROUTES.dealerships,
    image: PUBLIC_IMAGES.serviceParts,
  },
]

export function HomeServiceStrip() {
  return (
    <section className="bg-zinc-100 py-12 dark:bg-zinc-900">
      <div className="mx-auto grid max-w-6xl gap-4 px-4 sm:grid-cols-3 sm:px-6 lg:px-8">
        {blocks.map((b) => (
          <Link
            key={b.title}
            to={b.href}
            className="group overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
          >
            <img
              src={b.image}
              alt=""
              className="aspect-[558/408] w-full object-cover transition group-hover:scale-105"
              width={558}
              height={408}
            />
            <div className="p-4">
              <p className="font-semibold text-zinc-900 dark:text-zinc-50">{b.title}</p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">{b.subtitle}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
