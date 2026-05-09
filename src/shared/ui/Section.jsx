import clsx from 'clsx'
export function Section({ children, className, title, subtitle }) {
  return (
    <section className={clsx('py-12 md:py-16', className)}>
      {(title || subtitle) && (
        <header className="mb-8 max-w-3xl">
          {title ? (
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-900 md:text-3xl dark:text-zinc-50">
              {title}
            </h2>
          ) : null}
          {subtitle ? <p className="mt-2 text-zinc-600 dark:text-zinc-400">{subtitle}</p> : null}
        </header>
      )}
      {children}
    </section>
  )
}
