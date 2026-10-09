import clsx from 'clsx'
import { Button } from '@/shared/ui/Button.jsx'
export function ErrorFallback({ title = 'Что-то пошло не так', message, onRetry, className }) {
  return (
    <div
      className={clsx(
        'rounded-xl border border-[var(--color-danger)] bg-[var(--color-danger-subtle)] px-6 py-8',
        className
      )}
      role="alert"
    >
      <h3 className="text-lg font-semibold text-[var(--color-danger)]">{title}</h3>
      {message ? <p className="mt-2 text-sm text-[var(--color-danger)]">{message}</p> : null}
      {onRetry ? (
        <div className="mt-6">
          <Button type="button" variant="secondary" onClick={onRetry}>
            Повторить
          </Button>
        </div>
      ) : null}
    </div>
  )
}
