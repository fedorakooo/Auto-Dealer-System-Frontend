import clsx from 'clsx'
export function EmptyState({ title, description, action, className }) {
  return (
    <div
      className={clsx(
        'rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface-subtle)] px-8 py-12 text-center',
        className
      )}
    >
      <h3 className="text-lg font-semibold text-[var(--color-text)]">{title}</h3>
      {description ? <p className="mt-2 text-sm text-[var(--color-text-muted)]">{description}</p> : null}
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  )
}
