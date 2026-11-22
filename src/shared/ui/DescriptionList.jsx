import clsx from 'clsx'

/** `items`: [{ label, value }]. Empty values render an em dash. */
export function DescriptionList({ items, className }) {
  return (
    <dl className={clsx('grid gap-x-8 gap-y-4 sm:grid-cols-2', className)}>
      {items.map((item) => (
        <div key={item.label}>
          <dt className="text-xs font-semibold tracking-wider text-[var(--color-text-muted)] uppercase">
            {item.label}
          </dt>
          <dd className="m-0 mt-1 text-sm font-medium text-[var(--color-text)]">
            {item.value || item.value === 0 ? item.value : '—'}
          </dd>
        </div>
      ))}
    </dl>
  )
}
