import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import clsx from 'clsx'
import { useAuth } from '@/features/auth/hooks/useAuth.js'
import { ROUTES } from '@/constants/routes.js'
import { canAccessStaff } from '@/constants/roles.js'
import { Button } from '@/shared/ui/Button.jsx'
import { useUiStore } from '@/app/store/uiStore.js'
import { CONTACT_PHONE_DISPLAY, CONTACT_PHONE_E164 } from '@/shared/config/contact.js'
const linkClass = ({ isActive }) =>
  clsx(
    'rounded-md px-2 py-1 text-sm font-medium transition-colors',
    isActive
      ? 'text-zinc-900 dark:text-white'
      : 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white'
  )
export function Navbar({ variant = 'default' }) {
  const { user, logout } = useAuth()
  const staff = user && canAccessStaff(user.role)
  const [megaOpen, setMegaOpen] = useState(false)
  const setMobileMenuOpen = useUiStore((s) => s.setMobileMenuOpen)
  const mobileOpen = useUiStore((s) => s.mobileMenuOpen)
  return (
    <header
      className={clsx(
        'sticky top-0 z-40 border-b border-zinc-200/80 bg-white/90 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90',
        variant === 'minimal' && 'border-transparent bg-transparent'
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          to={ROUTES.home}
          className="text-sm font-semibold text-zinc-900 transition-colors hover:text-zinc-600 dark:text-zinc-50 dark:hover:text-zinc-300"
        >
          Главная
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Основное меню">
          <div
            className="relative"
            onMouseEnter={() => setMegaOpen(true)}
            onMouseLeave={() => setMegaOpen(false)}
          >
            <button
              type="button"
              className="rounded-md px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"
              aria-expanded={megaOpen}
            >
              Каталог
            </button>
            {megaOpen ? (
              <div className="absolute top-full left-0 z-50 mt-1 w-[min(100vw-2rem,36rem)] rounded-xl border border-zinc-200 bg-white p-4 shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <Link
                    to={ROUTES.vehicles}
                    className="rounded-lg border border-zinc-100 p-3 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800"
                  >
                    <span className="font-medium text-zinc-900 dark:text-zinc-50">
                      Автомобили в наличии
                    </span>
                    <span className="mt-1 block text-xs text-zinc-500">
                      Фильтры по цене и модели
                    </span>
                  </Link>
                  <Link
                    to={ROUTES.models}
                    className="rounded-lg border border-zinc-100 p-3 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800"
                  >
                    <span className="font-medium text-zinc-900 dark:text-zinc-50">
                      Модельный ряд
                    </span>
                    <span className="mt-1 block text-xs text-zinc-500">
                      Характеристики и комплектации
                    </span>
                  </Link>
                  <Link
                    to={ROUTES.testDrives}
                    className="rounded-lg border border-zinc-100 p-3 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800"
                  >
                    <span className="font-medium text-zinc-900 dark:text-zinc-50">Тест-драйв</span>
                    <span className="mt-1 block text-xs text-zinc-500">Запись в кабинете</span>
                  </Link>
                  <Link
                    to={ROUTES.dealerships}
                    className="rounded-lg border border-zinc-100 p-3 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800"
                  >
                    <span className="font-medium text-zinc-900 dark:text-zinc-50">Салоны</span>
                    <span className="mt-1 block text-xs text-zinc-500">Адреса и контакты</span>
                  </Link>
                </div>
              </div>
            ) : null}
          </div>

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
            className="hidden text-sm font-medium text-zinc-700 md:inline dark:text-zinc-200"
          >
            {CONTACT_PHONE_DISPLAY}
          </a>
          {user ? (
            <>
              <span className="hidden max-w-[140px] truncate text-xs text-zinc-500 lg:inline">
                {user.email}
              </span>
              <Button type="button" variant="ghost" size="sm" onClick={() => logout()}>
                Выход
              </Button>
            </>
          ) : (
            <>
              <Link to={ROUTES.login}>
                <Button type="button" variant="ghost" size="sm">
                  Вход
                </Button>
              </Link>
              <Link to={ROUTES.register}>
                <Button type="button" variant="secondary" size="sm">
                  Регистрация
                </Button>
              </Link>
            </>
          )}
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-zinc-200 lg:hidden dark:border-zinc-700"
            aria-label="Меню"
            onClick={() => setMobileMenuOpen(!mobileOpen)}
          >
            <span className="sr-only">Открыть меню</span>
            <span className="flex flex-col gap-1">
              <span className="h-0.5 w-5 bg-zinc-900 dark:bg-zinc-100" />
              <span className="h-0.5 w-5 bg-zinc-900 dark:bg-zinc-100" />
              <span className="h-0.5 w-5 bg-zinc-900 dark:bg-zinc-100" />
            </span>
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-zinc-200 bg-white px-4 py-4 lg:hidden dark:border-zinc-800 dark:bg-zinc-950">
          <nav className="flex flex-col gap-2 text-sm">
            <NavLink to={ROUTES.vehicles} onClick={() => setMobileMenuOpen(false)}>
              Автомобили
            </NavLink>
            <NavLink to={ROUTES.models} onClick={() => setMobileMenuOpen(false)}>
              Модели
            </NavLink>
            <NavLink to={ROUTES.dealerships} onClick={() => setMobileMenuOpen(false)}>
              Салоны
            </NavLink>
            <NavLink to={ROUTES.company} onClick={() => setMobileMenuOpen(false)}>
              Компания
            </NavLink>
            {user ? (
              <NavLink to={ROUTES.account} onClick={() => setMobileMenuOpen(false)}>
                Кабинет
              </NavLink>
            ) : null}
            {staff ? (
              <NavLink to={ROUTES.staffUsers} onClick={() => setMobileMenuOpen(false)}>
                Staff
              </NavLink>
            ) : null}
            {staff ? (
              <NavLink to={ROUTES.logs} onClick={() => setMobileMenuOpen(false)}>
                Логи и отчёты
              </NavLink>
            ) : null}
            <a
              href={`tel:${CONTACT_PHONE_E164}`}
              className="mt-4 block border-t border-zinc-200 pt-4 text-center text-sm font-medium text-zinc-800 dark:border-zinc-800 dark:text-zinc-200"
            >
              {CONTACT_PHONE_DISPLAY}
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  )
}
