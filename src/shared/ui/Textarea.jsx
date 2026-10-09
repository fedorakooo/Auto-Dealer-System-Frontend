import clsx from 'clsx'
const fieldClass =
  'min-h-[96px] w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)] shadow-sm placeholder:text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-primary-hover)] focus:border-[var(--color-focus)] focus:outline-none focus:ring-2 focus:ring-[var(--color-info-subtle)] disabled:opacity-50'
export function Textarea({ id, label, error, hint, rows = 4, className = '', ...rest }) {
  return (
    <div className={clsx('mb-4 flex flex-col gap-1', className)}>
      <label htmlFor={id} className="text-xs font-medium tracking-wider text-[var(--color-text-muted)] uppercase">
        {label}
      </label>
      <textarea
        id={id}
        rows={rows}
        className={clsx(
          fieldClass,
          error && 'border-[var(--color-danger)] focus:border-[var(--color-danger)] focus:ring-[var(--color-danger-subtle)]'
        )}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        {...rest}
      />
      {error ? (
        <span id={`${id}-error`} className="text-sm text-[var(--color-danger)]" role="alert">
          {error}
        </span>
      ) : null}
      {hint && !error ? (
        <span id={`${id}-hint`} className="text-sm text-[var(--color-text-muted)]">
          {hint}
        </span>
      ) : null}
    </div>
  )
}
export function TextArea(props) {
  return <Textarea {...props} />
}
