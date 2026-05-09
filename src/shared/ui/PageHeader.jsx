import clsx from 'clsx'
export function PageHeader({ kicker, title, subtitle, className }) {
  return (
    <header className={clsx('mb-8', className)}>
      {kicker ? (
        <p className="mb-2 text-xs font-medium tracking-[0.12em] text-zinc-500 uppercase">
          {kicker}
        </p>
      ) : null}
      <h1 className="mb-2 font-semibold tracking-tight text-zinc-50">{title}</h1>
      {subtitle ? <p className="max-w-2xl text-zinc-400">{subtitle}</p> : null}
    </header>
  )
}
