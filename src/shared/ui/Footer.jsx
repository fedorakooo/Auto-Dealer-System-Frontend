import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes.js'
import { Container } from '@/shared/ui/Container.jsx'
import { Brand } from '@/shared/ui/Brand.jsx'
import { Icon } from '@/shared/ui/Icon.jsx'
import {
  CONTACT_ADDRESS,
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_E164,
  WORKING_HOURS,
} from '@/shared/config/contact.js'

const footerLinkClass = 'text-slate-400 transition-colors hover:text-white'
const headingClass = 'mb-0 text-xs font-semibold tracking-[0.18em] text-white uppercase'

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950 text-white">
      <Container className="py-12 sm:py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]">
          <div className="max-w-xs">
            <Brand showTagline={false} alwaysShowName />
            <p className="mt-4 mb-0 text-sm leading-6 text-slate-400">
              Каталог автомобилей, дилерские центры и сервисные услуги в едином цифровом
              пространстве.
            </p>
          </div>

          <nav aria-label="Навигация в подвале">
            <h2 className={headingClass}>Навигация</h2>
            <ul className="m-0 mt-4 list-none space-y-3 p-0 text-sm">
              <li>
                <Link to={ROUTES.models} className={footerLinkClass}>
                  Модельный ряд
                </Link>
              </li>
              <li>
                <Link to={ROUTES.vehicles} className={footerLinkClass}>
                  Автомобили в наличии
                </Link>
              </li>
              <li>
                <Link to={ROUTES.dealerships} className={footerLinkClass}>
                  Дилерские центры
                </Link>
              </li>
              <li>
                <Link to={ROUTES.company} className={footerLinkClass}>
                  Компания и контакты
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <h2 className={headingClass}>Время работы</h2>
            <ul className="m-0 mt-4 list-none space-y-3 p-0 text-sm text-slate-400">
              {WORKING_HOURS.map((row) => (
                <li key={row.days}>
                  {row.days}: {row.hours}
                </li>
              ))}
              <li className="pt-1 text-xs text-slate-500">Сервис: уточняйте в салоне</li>
            </ul>
          </div>

          <div>
            <h2 className={headingClass}>Контакты</h2>
            <ul className="m-0 mt-4 list-none space-y-3 p-0 text-sm">
              <li className="flex items-center gap-2">
                <Icon name="phone" className="h-4 w-4 text-slate-500" />
                <a href={`tel:${CONTACT_PHONE_E164}`} className={footerLinkClass}>
                  {CONTACT_PHONE_DISPLAY}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Icon name="mail" className="h-4 w-4 text-slate-500" />
                <a href={`mailto:${CONTACT_EMAIL}`} className={footerLinkClass}>
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li className="flex items-start gap-2 text-slate-400">
                <Icon name="mapPin" className="mt-0.5 h-4 w-4 text-slate-500" />
                {CONTACT_ADDRESS}
              </li>
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
