import clsx from 'clsx'
export function Spinner({ label = 'Загрузка', className }) {
  return (
    <div className={clsx('flex justify-center py-12', className)} role="status" aria-live="polite">
      <span className="sr-only">{label}</span>
      <div
        className="h-10 w-10 animate-spin rounded-full border-2 border-zinc-700 border-t-zinc-200 dark:border-zinc-600 dark:border-t-zinc-100"
        aria-hidden
      />
    </div>
  )
}
