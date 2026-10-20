import clsx from 'clsx'
import { Icon } from '@/shared/ui/Icon.jsx'

export function EmptyState({ title, description, action, icon = 'box', className }) {
  return (
    <div
      className={clsx(
        'rounded-xl border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface-subtle)] px-8 py-12 text-center',
        className
      )}
    >
      <span className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-[var(--color-surface)] text-[var(--color-text-muted)] shadow-sm">
        <Icon name={icon} className="h-6 w-6" />
      </span>
      <h3 className="mb-0 text-lg font-semibold text-[var(--color-text)]">{title}</h3>
      {description ? (
        <p className="mx-auto mt-2 mb-0 max-w-md text-sm text-[var(--color-text-muted)]">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  )
}
