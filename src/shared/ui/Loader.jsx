import clsx from 'clsx'
export function Loader({ className, label = 'Загрузка…' }) {
  return (
    <div className={clsx('flex items-center justify-center gap-3 py-8', className)} role="status">
      <span
        className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-border)] border-t-[var(--color-primary)]"
        aria-hidden
      />
      <span className="text-sm text-[var(--color-text-muted)]">{label}</span>
    </div>
  )
}
