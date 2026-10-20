import { useId } from 'react'
import clsx from 'clsx'

/** Titled content surface used for forms, tables and dashboard blocks. */
export function Panel({ title, description, actions, children, className, padded = true }) {
  const titleId = useId()
  return (
    <section
      aria-labelledby={title ? titleId : undefined}
      className={clsx(
        'rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-panel)]',
        className
      )}
    >
      {title || actions ? (
        <header className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--color-border)] px-5 py-4 sm:px-6">
          <div>
            {title ? (
              <h2 id={titleId} className="mb-0 text-base font-semibold text-[var(--color-text)]">
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className="mt-1 mb-0 max-w-2xl text-sm text-[var(--color-text-muted)]">
                {description}
              </p>
            ) : null}
          </div>
          {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
        </header>
      ) : null}
      <div className={clsx(padded && 'p-5 sm:p-6')}>{children}</div>
    </section>
  )
}
