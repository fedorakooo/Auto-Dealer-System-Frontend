import clsx from 'clsx'

export function PageHeader({ kicker, title, subtitle, actions, className }) {
  return (
    <header
      className={clsx(
        'mb-8 flex flex-col gap-4 border-b border-[var(--color-border)] pb-6 sm:flex-row sm:items-end sm:justify-between',
        className
      )}
    >
      <div className="min-w-0">
        {kicker ? (
          <p className="mb-2 flex items-center gap-2 text-xs font-semibold tracking-[0.16em] text-[var(--color-accent)] uppercase">
            <span className="h-px w-6 bg-[var(--color-accent)]" aria-hidden="true" />
            {kicker}
          </p>
        ) : null}
        <h1 className="mb-0 font-semibold tracking-tight text-[var(--color-text)]">{title}</h1>
        {subtitle ? (
          <p className="mt-2 mb-0 max-w-2xl text-[var(--color-text-muted)]">{subtitle}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </header>
  )
}
