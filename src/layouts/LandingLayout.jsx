import { Outlet } from 'react-router-dom'
import { Navbar } from '@/shared/ui/Navbar.jsx'
import { Footer } from '@/shared/ui/Footer.jsx'
export function LandingLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      <Navbar variant="minimal" />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
