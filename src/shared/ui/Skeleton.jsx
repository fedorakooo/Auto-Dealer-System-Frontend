import clsx from 'clsx'

export function Skeleton({ className }) {
  return (
    <div
      className={clsx('animate-pulse rounded-lg bg-[var(--color-neutral-subtle)]', className)}
      aria-hidden="true"
    />
  )
}

export function CardGridSkeleton({ count = 6 }) {
  return (
    <div role="status" aria-label="Загрузка" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]"
        >
          <Skeleton className="aspect-[16/10] rounded-none" />
          <div className="space-y-3 p-4">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-9 w-full" />
          </div>
        </div>
      ))}
      <span className="sr-only">Загрузка…</span>
    </div>
  )
}
