import clsx from 'clsx'

export function Spinner({ label = 'Загрузка', className }) {
  return (
    <div className={clsx('flex justify-center py-12', className)} role="status" aria-live="polite">
      <span className="sr-only">{label}</span>
      <div
        className="h-10 w-10 animate-spin rounded-full border-2 border-[var(--color-border-strong)] border-t-[var(--color-accent)]"
        aria-hidden="true"
      />
    </div>
  )
}
