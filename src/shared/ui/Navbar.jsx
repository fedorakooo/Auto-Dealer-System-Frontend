import { Link, NavLink } from 'react-router-dom'
import clsx from 'clsx'
import { useAuth } from '@/features/auth/hooks/useAuth.js'
import { ROUTES } from '@/constants/routes.js'
import { canAccessStaff } from '@/constants/roles.js'
import { useUiStore } from '@/app/store/uiStore.js'
import { CONTACT_PHONE_DISPLAY, CONTACT_PHONE_E164 } from '@/shared/config/contact.js'
const linkClass = ({ isActive }) =>
  clsx(
    'relative rounded-md px-3 py-2 text-sm font-medium transition-colors after:absolute after:right-3 after:bottom-0 after:left-3 after:h-px after:origin-left after:bg-[var(--color-accent)] after:transition-transform',
    isActive
      ? 'font-semibold text-[var(--color-on-primary)] after:scale-x-100'
      : 'text-[var(--color-on-primary-muted)] after:scale-x-0 hover:text-[var(--color-on-primary)]'
  )
export function Navbar({ variant = 'default' }) {
  const { user, logout } = useAuth()
  const staff = user && canAccessStaff(user.role)
  const setMobileMenuOpen = useUiStore((s) => s.setMobileMenuOpen)
  const mobileOpen = useUiStore((s) => s.mobileMenuOpen)
  return (
    <header
      className={clsx(
        'app-navbar sticky top-0 z-40 border-b border-white/10 bg-[color:rgba(15,23,42,0.96)] text-[var(--color-on-primary)] backdrop-blur-xl',
        variant === 'minimal' && 'border-transparent'
      )}
    >
      <div className="mx-auto flex min-h-[4.5rem] max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          to={ROUTES.home}
          className="group flex min-h-11 items-center gap-3 text-[var(--color-on-primary)] transition-colors hover:text-[var(--color-on-primary)]"
          aria-label="Auto Dealer — главная"
        >
          <span
            className="grid h-9 w-9 place-items-center rounded-lg border border-white/15 bg-white/5 text-xs font-bold tracking-tight transition group-hover:border-red-400/70 group-hover:bg-white/10"
            aria-hidden="true"
          >
            AD
          </span>
          <span className="hidden sm:block">
            <span className="block text-sm font-semibold tracking-[0.12em]">AUTO DEALER</span>
            <span className="mt-0.5 block text-[0.6rem] tracking-[0.2em] text-white/50 uppercase">
              Luxury drive
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Основное меню">
          <NavLink to={ROUTES.vehicles} className={linkClass}>
            Автомобили
          </NavLink>
          <NavLink to={ROUTES.models} className={linkClass}>
            Модели
          </NavLink>
          <NavLink to={ROUTES.dealerships} className={linkClass}>
            Салоны
          </NavLink>
          <NavLink to={ROUTES.company} className={linkClass}>
            Компания
          </NavLink>
          {user ? (
            <NavLink to={ROUTES.account} className={linkClass}>
              Кабинет
            </NavLink>
          ) : null}
          {staff ? (
            <NavLink to={ROUTES.staffUsers} className={linkClass}>
              Staff
            </NavLink>
          ) : null}
          {staff ? (
            <NavLink to={ROUTES.logs} className={linkClass}>
              Логи
            </NavLink>
          ) : null}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={`tel:${CONTACT_PHONE_E164}`}
            className="hidden rounded-md px-2 py-2 text-sm font-medium text-[var(--color-on-primary-muted)] transition hover:text-white xl:inline"
          >
            {CONTACT_PHONE_DISPLAY}
          </a>
          {user ? (
            <>
              <span className="hidden max-w-[140px] truncate text-xs text-[var(--color-on-primary-muted)] lg:inline">
                {user.email}
              </span>
              <button
                type="button"
                className="inline-flex min-h-11 items-center rounded-md px-3 text-sm font-medium text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                onClick={() => logout()}
              >
                Выход
              </button>
            </>
          ) : (
            <>
              <Link
                to={ROUTES.login}
                className="inline-flex min-h-11 items-center rounded-md px-3 text-sm font-medium text-white transition hover:bg-white/10 hover:text-white"
              >
                Вход
              </Link>
              <Link
                to={ROUTES.register}
                className="hidden min-h-11 items-center rounded-md bg-[var(--color-accent)] px-4 text-sm font-semibold text-white transition hover:bg-[var(--color-accent-strong)] hover:text-white sm:inline-flex"
              >
                Регистрация
              </Link>
            </>
          )}
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-[var(--color-on-primary-muted)] lg:hidden"
            aria-label={mobileOpen ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMobileMenuOpen(!mobileOpen)}
          >
            <span className="sr-only">Открыть меню</span>
            <span className="flex flex-col gap-1">
              <span className="h-0.5 w-5 bg-[var(--color-on-primary)]" />
              <span className="h-0.5 w-5 bg-[var(--color-on-primary)]" />
              <span className="h-0.5 w-5 bg-[var(--color-on-primary)]" />
            </span>
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div
          id="mobile-navigation"
          className="border-t border-white/10 bg-[var(--color-primary)] px-4 py-4 shadow-xl lg:hidden"
        >
          <nav className="flex flex-col gap-2 text-sm">
            <NavLink
              to={ROUTES.vehicles}
              className={linkClass}
              onClick={() => setMobileMenuOpen(false)}
            >
              Автомобили
            </NavLink>
            <NavLink
              to={ROUTES.models}
              className={linkClass}
              onClick={() => setMobileMenuOpen(false)}
            >
              Модели
            </NavLink>
            <NavLink
              to={ROUTES.dealerships}
              className={linkClass}
              onClick={() => setMobileMenuOpen(false)}
            >
              Салоны
            </NavLink>
            <NavLink
              to={ROUTES.company}
              className={linkClass}
              onClick={() => setMobileMenuOpen(false)}
            >
              Компания
            </NavLink>
            {user ? (
              <NavLink
                to={ROUTES.account}
                className={linkClass}
                onClick={() => setMobileMenuOpen(false)}
              >
                Кабинет
              </NavLink>
            ) : null}
            {staff ? (
              <NavLink
                to={ROUTES.staffUsers}
                className={linkClass}
                onClick={() => setMobileMenuOpen(false)}
              >
                Staff
              </NavLink>
            ) : null}
            {staff ? (
              <NavLink
                to={ROUTES.logs}
                className={linkClass}
                onClick={() => setMobileMenuOpen(false)}
              >
                Логи и отчёты
              </NavLink>
            ) : null}
            <a
              href={`tel:${CONTACT_PHONE_E164}`}
              className="mt-4 block border-t border-[var(--color-primary-hover)] pt-4 text-center text-sm font-medium text-[var(--color-on-primary)]"
            >
              {CONTACT_PHONE_DISPLAY}
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  )
}
