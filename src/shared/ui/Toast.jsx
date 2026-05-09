import { useEffect } from 'react'
import clsx from 'clsx'
export function Toast({ open, onClose, children, variant = 'info' }) {
  useEffect(() => {
    if (!open) return
    const t = window.setTimeout(onClose, 4500)
    return () => window.clearTimeout(t)
  }, [open, onClose])
  if (!open) return null
  const styles = {
    info: 'border-zinc-200 bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900',
    success: 'border-emerald-600 bg-emerald-600 text-white',
    error: 'border-red-600 bg-red-600 text-white',
  }
  return (
    <div
      className="pointer-events-none fixed bottom-6 left-1/2 z-[100] w-[min(100%-2rem,28rem)] -translate-x-1/2"
      role="status"
    >
      <div
        className={clsx(
          'pointer-events-auto rounded-lg border px-4 py-3 text-sm shadow-lg',
          styles[variant]
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div>{children}</div>
          <button
            type="button"
            className="shrink-0 rounded px-1 opacity-80 hover:opacity-100"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  )
}
