import { useRouteError } from 'react-router-dom'
import { Button } from '@/shared/ui/Button.jsx'

export function RouteErrorFallback() {
  const err = useRouteError()
  const message =
    err && typeof err === 'object' && 'statusText' in err
      ? String(err.statusText)
      : err instanceof Error
        ? err.message
        : String(err)

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-xl font-semibold text-[var(--color-text)]">Ошибка маршрута</h1>
      <p className="max-w-md text-sm text-[var(--color-text-muted)]">{message}</p>
      <Button type="button" onClick={() => window.location.assign('/')}>
        На главную
      </Button>
    </div>
  )
}
