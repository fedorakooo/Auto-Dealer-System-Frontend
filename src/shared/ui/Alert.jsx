import clsx from 'clsx'
import { Icon } from '@/shared/ui/Icon.jsx'

const variants = {
  danger: {
    box: 'border-red-200 bg-[var(--color-danger-subtle)] text-[var(--color-danger)]',
    icon: 'alert',
  },
  success: {
    box: 'border-green-200 bg-[var(--color-success-subtle)] text-[var(--color-success)]',
    icon: 'check',
  },
  warning: {
    box: 'border-amber-200 bg-[var(--color-warning-subtle)] text-[var(--color-warning)]',
    icon: 'alert',
  },
  info: {
    box: 'border-blue-200 bg-[var(--color-info-subtle)] text-[var(--color-info)]',
    icon: 'info',
  },
}

export function Alert({ variant = 'info', title, children, className }) {
  const { box, icon } = variants[variant]
  return (
    <div
      role={variant === 'danger' ? 'alert' : 'status'}
      className={clsx(
        'mb-4 flex items-start gap-3 rounded-lg border px-4 py-3 text-sm',
        box,
        className
      )}
    >
      <Icon name={icon} className="mt-0.5 h-4 w-4" />
      <div className="min-w-0">
        {title ? <p className="mb-0.5 font-semibold text-current">{title}</p> : null}
        <div className="[&>p]:mb-0 [&>p]:text-current">{children}</div>
      </div>
    </div>
  )
}
