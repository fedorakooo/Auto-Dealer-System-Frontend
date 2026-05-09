import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth.js'
import { ROUTES } from '@/constants/routes.js'
import { Button } from '@/shared/ui/Button.jsx'
import { canAccessStaff } from '@/constants/roles.js'
import styles from '@/components/layout/MainNav.module.css'

const linkStyle = ({ isActive }) => (isActive ? { color: 'var(--color-accent-strong)' } : undefined)

export function MainNav() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)

  const staff = user && canAccessStaff(user.role)

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to={ROUTES.home} className={styles.brand} onClick={() => setOpen(false)}>
          Auto Dealer
          <span>Luxury Drive</span>
        </Link>

        <nav className={styles.nav} aria-label="Основное меню">
          <NavLink to={ROUTES.vehicles} style={linkStyle}>
            Автомобили
          </NavLink>
          <NavLink to={ROUTES.models} style={linkStyle}>
            Модели
          </NavLink>
          <NavLink to={ROUTES.dealerships} style={linkStyle}>
            Салоны
          </NavLink>
          {user ? (
            <NavLink to={ROUTES.account} style={linkStyle}>
              Кабинет
            </NavLink>
          ) : null}
          {staff ? (
            <NavLink to={ROUTES.staffUsers} style={linkStyle}>
              Сотрудники
            </NavLink>
          ) : null}
          {staff ? (
            <NavLink to={ROUTES.logs} style={linkStyle}>
              Логи и отчёты
            </NavLink>
          ) : null}
        </nav>

        <div className={styles.actions}>
          {user ? (
            <>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                {user.email}
              </span>
              <Button type="button" variant="ghost" onClick={() => logout()}>
                Выход
              </Button>
            </>
          ) : (
            <>
              <Link to={ROUTES.login}>
                <Button type="button" variant="ghost">
                  Вход
                </Button>
              </Link>
              <Link to={ROUTES.register}>
                <Button type="button" variant="secondary">
                  Регистрация
                </Button>
              </Link>
            </>
          )}
          <button
            type="button"
            className={styles.burger}
            aria-label="Открыть меню"
            onClick={() => setOpen(true)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {open ? (
        <>
          <button
            type="button"
            className={styles.drawerBackdrop}
            aria-label="Закрыть"
            onClick={() => setOpen(false)}
          />
          <div className={styles.drawer}>
            <NavLink to={ROUTES.vehicles} onClick={() => setOpen(false)}>
              Автомобили
            </NavLink>
            <NavLink to={ROUTES.models} onClick={() => setOpen(false)}>
              Модели
            </NavLink>
            <NavLink to={ROUTES.dealerships} onClick={() => setOpen(false)}>
              Салоны
            </NavLink>
            {user ? (
              <NavLink to={ROUTES.account} onClick={() => setOpen(false)}>
                Кабинет
              </NavLink>
            ) : null}
            {staff ? (
              <NavLink to={ROUTES.staffUsers} onClick={() => setOpen(false)}>
                Сотрудники
              </NavLink>
            ) : null}
            {staff ? (
              <NavLink to={ROUTES.logs} onClick={() => setOpen(false)}>
                Логи и отчёты
              </NavLink>
            ) : null}
          </div>
        </>
      ) : null}
    </header>
  )
}
