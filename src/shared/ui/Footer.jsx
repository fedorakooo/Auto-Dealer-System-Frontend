import { Link } from 'react-router-dom'
import { ROUTES } from '@/constants/routes.js'
import { Container } from '@/shared/ui/Container.jsx'
import { Brand } from '@/shared/ui/Brand.jsx'
import { useBrand } from '@/features/brand/brandContext.js'
import { ContactList, SocialLinks } from '@/features/brand/components/ContactList.jsx'
import { t, localize } from '@/shared/i18n/index.js'

const footerLinkClass = 'text-slate-400 transition-colors hover:text-white'
const headingClass = 'mb-0 text-xs font-semibold tracking-[0.18em] text-white uppercase'

export function Footer() {
  const brand = useBrand()
  const { contacts } = brand
  return (
    <footer className="border-t border-white/10 bg-slate-950 text-white">
      <Container className="py-12 sm:py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1fr]">
          <div className="max-w-xs">
            <Brand showTagline={false} alwaysShowName />
            <p className="mt-4 mb-0 text-sm leading-6 text-slate-400">
              {t('layout.footer.tagline')}
            </p>
          </div>

          <nav aria-label={t('layout.footer.navLabel')}>
            <h2 className={headingClass}>{t('layout.footer.navigation')}</h2>
            <ul className="m-0 mt-4 list-none space-y-3 p-0 text-sm">
              <li>
                <Link to={ROUTES.models} className={footerLinkClass}>
                  {t('layout.footer.models')}
                </Link>
              </li>
              <li>
                <Link to={ROUTES.vehicles} className={footerLinkClass}>
                  {t('layout.footer.vehicles')}
                </Link>
              </li>
              <li>
                <Link to={ROUTES.dealerships} className={footerLinkClass}>
                  {t('layout.footer.dealerships')}
                </Link>
              </li>
              <li>
                <Link to={ROUTES.company} className={footerLinkClass}>
                  {t('layout.footer.company')}
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <h2 className={headingClass}>{t('layout.footer.workingHours')}</h2>
            <ul className="m-0 mt-4 list-none space-y-3 p-0 text-sm text-slate-400">
              {contacts.working_hours.map((row) => (
                <li key={localize(row.days)}>
                  {localize(row.days)}: {localize(row.hours)}
                </li>
              ))}
              {contacts.service_hours_note ? (
                <li className="pt-1 text-xs text-slate-500">
                  {localize(contacts.service_hours_note)}
                </li>
              ) : null}
            </ul>
          </div>

          <div>
            <h2 className={headingClass}>{t('layout.footer.contacts')}</h2>
            <ContactList
              className="mt-4 space-y-3 text-sm text-slate-400"
              linkClassName={footerLinkClass}
              iconClassName="h-4 w-4 text-slate-500"
            />
            <SocialLinks className="mt-4 text-sm" linkClassName={footerLinkClass} />
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
          <p className="mb-0 text-slate-500">
            © {new Date().getFullYear()} {brand.legal_name}
          </p>
          {contacts.location_line ? (
            <p className="mb-0 text-slate-500">{localize(contacts.location_line)}</p>
          ) : null}
        </div>
      </Container>
    </footer>
  )
}
