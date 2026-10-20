import { useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import clsx from 'clsx'
import { useAuth } from '@/features/auth/hooks/useAuth.js'
import { ROUTES } from '@/constants/routes.js'
import { canAccessStaff } from '@/constants/roles.js'
import { useUiStore } from '@/app/store/uiStore.js'
import { CONTACT_PHONE_DISPLAY, CONTACT_PHONE_E164 } from '@/shared/config/contact.js'
import { PUBLIC_NAV } from '@/shared/config/navigation.js'
import { Brand } from '@/shared/ui/Brand.jsx'
import { Icon } from '@/shared/ui/Icon.jsx'

const linkClass = ({ isActive }) =>
  clsx(
    'relative rounded-md px-3 py-2 text-sm font-medium transition-colors after:absolute after:right-3 after:bottom-0 after:left-3 after:h-px after:origin-left after:bg-[var(--color-accent)] after:transition-transform',
    isActive
      ? 'font-semibold text-white after:scale-x-100'
      : 'text-[var(--color-on-primary-muted)] after:scale-x-0 hover:text-white'
  )

const ghostActionClass =
  'inline-flex min-h-11 items-center gap-2 rounded-md px-3 text-sm font-medium text-white transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'

export function Navbar({ variant = 'default' }) {
  const { user, logout } = useAuth()
  const { pathname } = useLocation()
  const staff = Boolean(user && canAccessStaff(user.role))
  const mobileOpen = useUiStore((s) => s.mobileMenuOpen)
  const setMobileMenuOpen = useUiStore((s) => s.setMobileMenuOpen)

  const links = [
    ...PUBLIC_NAV,
    ...(user ? [{ to: ROUTES.account, label: 'Кабинет' }] : []),
    ...(staff ? [{ to: ROUTES.staffDashboard, label: 'Сотрудникам' }] : []),
  ]

  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname, setMobileMenuOpen])

  useEffect(() => {
    if (!mobileOpen) return
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setMobileMenuOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [mobileOpen, setMobileMenuOpen])

  return (
    <header
      className={clsx(
        'app-navbar sticky top-0 z-40 border-b border-white/10 bg-[color:rgba(15,23,42,0.96)] text-white backdrop-blur-xl',
        variant === 'minimal' && 'border-transparent'
      )}
    >
      <div className="mx-auto flex min-h-[4.5rem] max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Brand />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Основное меню">
          {links.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={`tel:${CONTACT_PHONE_E164}`}
            className="hidden items-center gap-2 rounded-md px-2 py-2 text-sm font-medium text-[var(--color-on-primary-muted)] transition hover:text-white xl:inline-flex"
          >
            <Icon name="phone" className="h-4 w-4" />
            {CONTACT_PHONE_DISPLAY}
          </a>
          {user ? (
            <>
              <span
                className="hidden max-w-[160px] truncate text-xs text-[var(--color-on-primary-muted)] lg:inline"
                title={user.email}
              >
                {user.email}
              </span>
              <button type="button" className={ghostActionClass} onClick={() => logout()}>
                <Icon name="logout" className="h-4 w-4" />
                <span className="hidden sm:inline">Выход</span>
                <span className="sr-only sm:hidden">Выход</span>
              </button>
            </>
          ) : (
            <>
              <Link to={ROUTES.login} className={ghostActionClass}>
                Вход
              </Link>
              <Link
                to={ROUTES.register}
                className="hidden min-h-11 items-center rounded-md bg-[var(--color-accent)] px-4 text-sm font-semibold text-white transition hover:bg-[var(--color-accent-strong)] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:inline-flex"
              >
                Регистрация
              </Link>
            </>
          )}
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-white/20 text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white lg:hidden"
            aria-label={mobileOpen ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMobileMenuOpen(!mobileOpen)}
          >
            <Icon name={mobileOpen ? 'close' : 'menu'} />
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div
          id="mobile-navigation"
          className="border-t border-white/10 bg-[var(--color-primary)] px-4 py-4 shadow-xl lg:hidden"
        >
          <nav className="flex flex-col gap-1 text-sm" aria-label="Мобильное меню">
            {links.map((item) => (
              <NavLink key={item.to} to={item.to} className={linkClass}>
                {item.label}
              </NavLink>
            ))}
            {user ? null : (
              <Link
                to={ROUTES.register}
                className="mt-2 inline-flex min-h-11 items-center justify-center rounded-md bg-[var(--color-accent)] px-4 text-sm font-semibold text-white hover:text-white"
              >
                Регистрация
              </Link>
            )}
            <a
              href={`tel:${CONTACT_PHONE_E164}`}
              className="mt-3 flex items-center justify-center gap-2 border-t border-white/10 pt-4 text-sm font-medium text-white"
            >
              <Icon name="phone" className="h-4 w-4" />
              {CONTACT_PHONE_DISPLAY}
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  )
}
