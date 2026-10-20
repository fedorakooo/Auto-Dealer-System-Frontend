import { useId } from 'react'
import clsx from 'clsx'

export const fieldControlClass =
  'w-full rounded-md border border-[var(--color-border-strong)] bg-[var(--color-surface)] px-3.5 py-2.5 text-base text-[var(--color-text)] shadow-sm placeholder:text-slate-400 transition-colors hover:border-slate-400 focus:border-[var(--color-focus)] focus:ring-2 focus:ring-[var(--color-info-subtle)] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-[var(--color-danger)] aria-[invalid=true]:focus:ring-[var(--color-danger-subtle)]'

/**
 * Shared label / hint / error shell for form controls. `className` replaces the default `mb-4`
 * (Tailwind cannot resolve conflicting margin utilities by class order). `children` is a render prop that
 * receives the props every control must spread (`id`, `aria-invalid`, `aria-describedby`).
 */
export function Field({ id, label, error, hint, className, required, children }) {
  const generatedId = useId()
  const controlId = id ?? generatedId
  const describedBy = error ? `${controlId}-error` : hint ? `${controlId}-hint` : undefined

  return (
    <div className={clsx('flex flex-col gap-1.5', className ?? 'mb-4')}>
      <label htmlFor={controlId} className="text-sm font-medium text-[var(--color-text)]">
        {label}
        {required ? (
          <span className="ml-0.5 text-[var(--color-danger)]" aria-hidden="true">
            *
          </span>
        ) : null}
      </label>
      {children({
        id: controlId,
        'aria-invalid': error ? true : undefined,
        'aria-describedby': describedBy,
        'aria-required': required || undefined,
      })}
      {error ? (
        <span id={`${controlId}-error`} className="text-sm text-[var(--color-danger)]" role="alert">
          {error}
        </span>
      ) : null}
      {hint && !error ? (
        <span id={`${controlId}-hint`} className="text-sm text-[var(--color-text-muted)]">
          {hint}
        </span>
      ) : null}
    </div>
  )
}
