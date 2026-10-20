import clsx from 'clsx'
import { Button } from '@/shared/ui/Button.jsx'
import { Icon } from '@/shared/ui/Icon.jsx'

export function ErrorFallback({ title = 'Что-то пошло не так', message, onRetry, className }) {
  return (
    <div
      className={clsx(
        'rounded-xl border border-red-200 bg-[var(--color-danger-subtle)] px-6 py-8',
        className
      )}
      role="alert"
    >
      <div className="flex items-start gap-4">
        <Icon name="alert" className="mt-0.5 h-6 w-6 text-[var(--color-danger)]" />
        <div>
          <h3 className="mb-0 text-lg font-semibold text-[var(--color-danger)]">{title}</h3>
          {message ? (
            <p className="mt-2 mb-0 text-sm text-[var(--color-danger)]">{message}</p>
          ) : null}
          {onRetry ? (
            <div className="mt-5">
              <Button variant="secondary" onClick={onRetry}>
                Повторить
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
