import { Link } from 'react-router-dom'
import { Icon } from '@/shared/ui/Icon.jsx'

/** `items`: [{ label, to? }]; the last item is the current page. */
export function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Навигационная цепочка" className="mb-4">
      <ol className="m-0 flex list-none flex-wrap items-center gap-1.5 p-0 text-sm text-[var(--color-text-muted)]">
        {items.map((item, index) => {
          const last = index === items.length - 1
          return (
            <li key={item.label} className="flex items-center gap-1.5">
              {item.to && !last ? (
                <Link to={item.to} className="hover:text-[var(--color-text)] hover:underline">
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={last ? 'page' : undefined}
                  className={last ? 'font-medium text-[var(--color-text)]' : undefined}
                >
                  {item.label}
                </span>
              )}
              {last ? null : <Icon name="chevronRight" className="h-3.5 w-3.5" />}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
