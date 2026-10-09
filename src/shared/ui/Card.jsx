import clsx from 'clsx'
export function Card({ children, interactive, className }) {
  return (
    <article
      className={clsx(
        'overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-card)]',
        interactive &&
          'cursor-pointer transition hover:-translate-y-0.5 hover:border-[var(--color-primary-hover)] hover:shadow-[var(--shadow-card-hover)] motion-reduce:hover:translate-y-0',
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
