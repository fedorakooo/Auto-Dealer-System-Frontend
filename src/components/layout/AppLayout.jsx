import { Outlet } from 'react-router-dom'
import { MainNav } from '@/components/layout/MainNav.jsx'
import { Footer } from '@/components/layout/Footer.jsx'
import { Container } from '@/shared/ui/Container.jsx'
import styles from '@/components/layout/AppLayout.module.css'

export function AppLayout() {
  return (
    <div className={styles.shell}>
      <MainNav />
      <main className={styles.main}>
        <Container>
          <Outlet />
        </Container>
      </main>
      <Footer />
    </div>
  )
}
