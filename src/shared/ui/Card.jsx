import clsx from 'clsx'

/** Set `interactive` when the card contains a stretched link (`after:absolute after:inset-0`). */
export function Card({ children, interactive, className }) {
  return (
    <article
      className={clsx(
        'relative overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-card)]',
        interactive &&
          'transition duration-200 focus-within:ring-2 focus-within:ring-[var(--color-focus)] hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[var(--shadow-card-hover)] motion-reduce:transition-none motion-reduce:hover:translate-y-0',
        className
      )}
    >
      {children}
    </article>
  )
}

export function CardMedia({ children, className }) {
  return (
    <div
      className={clsx(
        'border-b border-[var(--color-border)] bg-[var(--color-surface-subtle)]',
        className
      )}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className }) {
  return (
    <div className={clsx('border-b border-[var(--color-border)] px-5 py-4', className)}>
      {children}
    </div>
  )
}

export function CardBody({ children, className }) {
  return <div className={clsx('px-5 py-4', className)}>{children}</div>
}
