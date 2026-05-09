import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes.js'
import { Container } from '@/shared/ui/Container.jsx'
import {
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_E164,
} from '@/shared/config/contact.js'

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
      <Container className="py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <h3 className="text-sm font-semibold tracking-wide text-zinc-900 uppercase dark:text-zinc-100">
              Навигация
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li>
                <Link to={ROUTES.models} className="hover:text-zinc-900 dark:hover:text-white">
                  Модельный ряд
                </Link>
              </li>
              <li>
                <Link to={ROUTES.vehicles} className="hover:text-zinc-900 dark:hover:text-white">
                  Автомобили в наличии
                </Link>
              </li>
              <li>
                <Link to={ROUTES.company} className="hover:text-zinc-900 dark:hover:text-white">
                  Компания и контакты
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wide text-zinc-900 uppercase dark:text-zinc-100">
              Время работы
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li>Пн–Пт: 09:00 – 20:00</li>
              <li>Сб–Вс: 10:00 – 16:00</li>
              <li className="pt-2 text-xs text-zinc-500">Сервис: уточняйте в салоне</li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wide text-zinc-900 uppercase dark:text-zinc-100">
              Контакты
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
              <li>
                <a
                  href={`tel:${CONTACT_PHONE_E164}`}
                  className="hover:text-zinc-900 dark:hover:text-white"
                >
                  {CONTACT_PHONE_DISPLAY}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="hover:text-zinc-900 dark:hover:text-white"
                >
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li className="pt-1">г. Минск, ул. Примерная, 1</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-zinc-200 pt-6 text-xs text-zinc-500 md:flex-row md:items-center md:justify-between dark:border-zinc-800 dark:text-zinc-500">
          <p>© {new Date().getFullYear()} Auto Dealer System</p>
        </div>
      </Container>
    </footer>
  )
}
