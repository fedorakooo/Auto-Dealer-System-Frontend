import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '@/features/auth/hooks/useAuth.js'
import { ROUTES } from '@/constants/routes.js'
import { USER_ROLES } from '@/constants/roles.js'
import { canAccessStaff } from '@/constants/roles.js'
import styles from '@/pages/AccountLayout.module.css'

const navLink = ({ isActive }) =>
  isActive ? `${styles.navItem} ${styles.navItemActive}` : styles.navItem

export function AccountLayout() {
  const { user } = useAuth()
  const customer = user?.role === USER_ROLES.customer
  const staff = user && canAccessStaff(user.role)

  return (
    <div className={styles.grid}>
      <aside className={styles.aside}>
        <nav className={styles.nav} aria-label="Кабинет">
          <NavLink to={ROUTES.account} end className={navLink}>
            Профиль
          </NavLink>
          {customer ? (
            <>
              <NavLink to={ROUTES.orders} className={navLink}>
                Заказы
              </NavLink>
              <NavLink to={ROUTES.favorites} className={navLink}>
                Избранное
              </NavLink>
              <NavLink to={ROUTES.testDrives} className={navLink}>
                Тест-драйвы
              </NavLink>
              <NavLink to={ROUTES.customOrders} className={navLink}>
                Индивидуальный заказ
              </NavLink>
            </>
          ) : null}
          {staff ? (
            <>
              <NavLink to={ROUTES.staffUsers} className={navLink}>
                Пользователи (staff)
              </NavLink>
              <NavLink to={ROUTES.staffOrders} className={navLink}>
                Заказы (staff)
              </NavLink>
              <NavLink to={ROUTES.logs} className={navLink}>
                Логи
              </NavLink>
            </>
          ) : null}
        </nav>
      </aside>
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  )
}
