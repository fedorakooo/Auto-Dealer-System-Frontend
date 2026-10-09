import clsx from 'clsx'
const fieldClass =
  'w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-base text-[var(--color-text)] shadow-sm transition-colors hover:border-[var(--color-primary-hover)] focus:border-[var(--color-focus)] focus:outline-none focus:ring-2 focus:ring-[var(--color-info-subtle)] disabled:opacity-50'
export function Select({ id, label, error, children, className = '', ...rest }) {
  return (
    <div className={clsx('mb-4 flex flex-col gap-1', className)}>
      <label htmlFor={id} className="text-xs font-medium tracking-wider text-[var(--color-text-muted)] uppercase">
        {label}
      </label>
      <select
        id={id}
        className={clsx(
          fieldClass,
          error && 'border-[var(--color-danger)] focus:border-[var(--color-danger)] focus:ring-[var(--color-danger-subtle)]'
        )}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        {...rest}
      >
        {children}
      </select>
      {error ? (
        <span id={`${id}-error`} className="text-sm text-[var(--color-danger)]" role="alert">
          {error}
        </span>
      ) : null}
    </div>
  )
}
