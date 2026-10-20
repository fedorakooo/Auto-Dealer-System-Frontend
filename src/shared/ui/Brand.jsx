import { Link } from 'react-router-dom'
import clsx from 'clsx'
import { ROUTES } from '@/constants/routes.js'

export function Brand({ className, showTagline = true, alwaysShowName = false }) {
  return (
    <Link
      to={ROUTES.home}
      className={clsx(
        'group flex min-h-11 items-center gap-3 text-white transition-colors hover:text-white',
        className
      )}
      aria-label="Auto Dealer — главная"
    >
      <span
        className="grid h-9 w-9 place-items-center rounded-lg bg-[var(--color-accent)] text-xs font-bold tracking-tight text-white shadow-[0_6px_16px_rgba(220,38,38,0.35)] transition group-hover:bg-[var(--color-accent-strong)]"
        aria-hidden="true"
      >
        AD
      </span>
      <span className={clsx(!alwaysShowName && 'hidden sm:block')}>
        <span className="block text-sm font-semibold tracking-[0.12em]">AUTO DEALER</span>
        {showTagline ? (
          <span className="mt-0.5 block text-[0.6rem] tracking-[0.2em] text-white/50 uppercase">
            Luxury drive
          </span>
        ) : null}
      </span>
    </Link>
  )
}
