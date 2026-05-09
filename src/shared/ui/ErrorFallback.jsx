import clsx from 'clsx'
import { Button } from '@/shared/ui/Button.jsx'
export function ErrorFallback({ title = 'Что-то пошло не так', message, onRetry, className }) {
  return (
    <div
      className={clsx(
        'rounded-xl border border-red-900/50 bg-red-950/30 px-6 py-8 dark:border-red-900/40',
        className
      )}
      role="alert"
    >
      <h3 className="text-lg font-semibold text-red-200">{title}</h3>
      {message ? <p className="mt-2 text-sm text-red-300/90">{message}</p> : null}
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
