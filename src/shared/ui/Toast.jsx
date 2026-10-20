import { useEffect } from 'react'
import clsx from 'clsx'
import { Icon } from '@/shared/ui/Icon.jsx'

const VARIANTS = {
  info: { box: 'bg-slate-900 text-white', icon: 'info' },
  success: { box: 'bg-[var(--color-success)] text-white', icon: 'check' },
  error: { box: 'bg-[var(--color-danger)] text-white', icon: 'alert' },
}

export function Toast({ open, onClose, children, variant = 'info' }) {
  useEffect(() => {
    if (!open) return
    const timer = window.setTimeout(onClose, 4500)
    return () => window.clearTimeout(timer)
  }, [open, onClose])

  if (!open) return null
  const { box, icon } = VARIANTS[variant] ?? VARIANTS.info

  return (
    <div
      className="pointer-events-none fixed bottom-6 left-1/2 z-[1100] w-[min(100%-2rem,28rem)] -translate-x-1/2"
      role={variant === 'error' ? 'alert' : 'status'}
      aria-live={variant === 'error' ? 'assertive' : 'polite'}
    >
      <div
        className={clsx(
          'pointer-events-auto flex items-start gap-3 rounded-lg px-4 py-3 text-sm shadow-xl',
          box
        )}
      >
        <Icon name={icon} className="mt-0.5 h-4 w-4" />
        <div className="min-w-0 flex-1">{children}</div>
        <button
          type="button"
          className="-m-1 shrink-0 rounded p-1 opacity-80 hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          aria-label="Закрыть уведомление"
          onClick={onClose}
        >
          <Icon name="close" className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
