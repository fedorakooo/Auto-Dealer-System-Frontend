import clsx from 'clsx'
export function PageHeader({ kicker, title, subtitle, className }) {
  return (
    <header className={clsx('mb-8', className)}>
      {kicker ? (
        <p className="mb-2 text-xs font-medium tracking-[0.12em] text-[var(--color-text-muted)] uppercase">
          {kicker}
        </p>
      ) : null}
      <h1 className="mb-2 font-semibold tracking-tight text-[var(--color-text)]">{title}</h1>
      {subtitle ? <p className="max-w-2xl text-[var(--color-text-muted)]">{subtitle}</p> : null}
    </header>
  )
}
