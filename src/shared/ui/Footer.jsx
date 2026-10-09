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
    <footer className="border-t border-white/10 bg-slate-950 text-white">
      <Container className="py-12 sm:py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]">
          <div className="max-w-xs">
            <Link
              to={ROUTES.home}
              className="inline-flex items-center gap-3 text-white hover:text-white"
            >
              <span
                className="grid h-10 w-10 place-items-center rounded-lg border border-white/15 bg-white/5 text-xs font-bold"
                aria-hidden="true"
              >
                AD
              </span>
              <span className="text-sm font-semibold tracking-[0.12em]">AUTO DEALER</span>
            </Link>
            <p className="mt-4 text-sm leading-6 text-slate-400">
              Каталог автомобилей, дилерские центры и сервисные услуги в едином цифровом
              пространстве.
            </p>
          </div>
          <div>
            <h3 className="text-xs font-semibold tracking-[0.18em] text-white uppercase">
              Навигация
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-400">
              <li>
                <Link to={ROUTES.models} className="hover:text-white">
                  Модельный ряд
                </Link>
              </li>
              <li>
                <Link to={ROUTES.vehicles} className="hover:text-white">
                  Автомобили в наличии
                </Link>
              </li>
              <li>
                <Link to={ROUTES.company} className="hover:text-white">
                  Компания и контакты
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold tracking-[0.18em] text-white uppercase">
              Время работы
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-400">
              <li>Пн–Пт: 09:00 – 20:00</li>
              <li>Сб–Вс: 10:00 – 16:00</li>
              <li className="pt-1 text-xs text-slate-500">Сервис: уточняйте в салоне</li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold tracking-[0.18em] text-white uppercase">
              Контакты
            </h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-400">
              <li>
                <a href={`tel:${CONTACT_PHONE_E164}`} className="hover:text-white">
                  {CONTACT_PHONE_DISPLAY}
                </a>
              </li>
              <li>
                <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-white">
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li className="pt-1">г. Минск, ул. Примерная, 1</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
          <p className="mb-0 text-slate-500">© {new Date().getFullYear()} Auto Dealer System</p>
          <p className="mb-0 text-slate-500">Минск · Беларусь</p>
        </div>
      </Container>
    </footer>
  )
}
