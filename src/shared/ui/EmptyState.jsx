import clsx from 'clsx'
export function EmptyState({ title, description, action, className }) {
  return (
    <div
      className={clsx(
        'rounded-xl border border-dashed border-zinc-700 bg-zinc-950/40 px-8 py-12 text-center dark:border-zinc-700',
        className
      )}
    >
      <h3 className="text-lg font-semibold text-zinc-100">{title}</h3>
      {description ? <p className="mt-2 text-sm text-zinc-500">{description}</p> : null}
      {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
    </div>
  )
}
