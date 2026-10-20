import { NavLink, Outlet } from 'react-router-dom'
import clsx from 'clsx'
import { Icon } from '@/shared/ui/Icon.jsx'

const itemClass = ({ isActive }) =>
  clsx(
    'flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium whitespace-nowrap transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-focus)]',
    isActive
      ? 'bg-[var(--color-primary)] text-white shadow-sm hover:text-white'
      : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-subtle)] hover:text-[var(--color-text)]'
  )

/** Section shell: sticky navigation rail on desktop, horizontal scroller on mobile. */
export function SidebarLayout({ title, items }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[15rem_1fr] lg:items-start lg:gap-10">
      <aside className="lg:sticky lg:top-24">
        <p className="mb-3 hidden px-3 text-xs font-semibold tracking-[0.16em] text-[var(--color-text-muted)] uppercase lg:block">
          {title}
        </p>
        <nav
          className="-mx-4 flex gap-1 overflow-x-auto px-4 pb-2 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0 lg:pb-0"
          aria-label={title}
        >
          {items.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={itemClass}>
              <Icon name={item.icon} className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="min-w-0">
        <Outlet />
      </div>
    </div>
  )
}
