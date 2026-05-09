import { Link } from 'react-router-dom'
import { Button } from '@/shared/ui/Button.jsx'
import { ROUTES } from '@/constants/routes.js'

export function HomeIntro() {
  return (
    <section className="border-b border-zinc-200 bg-gradient-to-b from-zinc-50 to-white py-16 dark:border-zinc-800 dark:from-zinc-950 dark:to-zinc-900">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold tracking-[0.25em] text-zinc-500 uppercase">
          Premium selection
        </p>
        <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-zinc-900 md:text-4xl dark:text-zinc-50">
          Автомобили, которые соответствуют вашим ожиданиям
        </h1>
        <p className="mt-4 max-w-2xl text-zinc-600 dark:text-zinc-400">
          Каталог в наличии, модельный ряд и сервис записи на тест-драйв — в одном интерфейсе Auto
          Dealer System.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to={ROUTES.vehicles}>
            <Button type="button">Смотреть автомобили</Button>
          </Link>
          <Link to={ROUTES.models}>
            <Button type="button" variant="secondary">
              Модельный ряд
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
