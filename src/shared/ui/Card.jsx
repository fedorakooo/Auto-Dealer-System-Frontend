import clsx from 'clsx'
export function Card({ children, interactive, className }) {
  return (
    <article
      className={clsx(
        'overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900',
        interactive &&
          'cursor-pointer transition hover:border-zinc-400 hover:shadow-md dark:hover:border-zinc-600',
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
        'border-b border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950/50',
        className
      )}
    >
      {children}
    </div>
  )
}
export function CardHeader({ children, className }) {
  return (
    <div className={clsx('border-b border-zinc-100 px-5 py-4 dark:border-zinc-800', className)}>
      {children}
    </div>
  )
}
export function CardBody({ children, className }) {
  return <div className={clsx('px-5 py-4', className)}>{children}</div>
}
