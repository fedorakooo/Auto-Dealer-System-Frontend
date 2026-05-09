import clsx from 'clsx'
export function Loader({ className, label = 'Загрузка…' }) {
  return (
    <div className={clsx('flex items-center justify-center gap-3 py-8', className)} role="status">
      <span
        className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-600 dark:border-t-zinc-100"
        aria-hidden
      />
      <span className="text-sm text-zinc-600 dark:text-zinc-400">{label}</span>
    </div>
  )
}
