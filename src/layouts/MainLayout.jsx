import { Outlet } from 'react-router-dom'
import { Navbar } from '@/shared/ui/Navbar.jsx'
import { Footer } from '@/shared/ui/Footer.jsx'
import { Container } from '@/shared/ui/Container.jsx'
export function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-bg)] text-[var(--color-text)]">
      <a href="#main-content" className="skip-link">
        Перейти к содержимому
      </a>
      <Navbar />
      <main id="main-content" className="flex-1" tabIndex="-1">
        <Container className="py-8">
          <Outlet />
        </Container>
      </main>
      <Footer />
    </div>
  )
}
