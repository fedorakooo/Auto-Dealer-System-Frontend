import { Outlet } from 'react-router-dom'
import { Navbar } from '@/shared/ui/Navbar.jsx'
import { Footer } from '@/shared/ui/Footer.jsx'
import { Container } from '@/shared/ui/Container.jsx'
export function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <Navbar />
      <main className="flex-1">
        <Container className="py-8">
          <Outlet />
        </Container>
      </main>
      <Footer />
    </div>
  )
}
