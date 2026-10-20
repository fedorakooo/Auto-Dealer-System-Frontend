import clsx from 'clsx'

const tones = {
  neutral: 'bg-[var(--color-neutral-subtle)] text-[var(--color-text-muted)]',
  success: 'bg-[var(--color-success-subtle)] text-[var(--color-success)]',
  warning: 'bg-[var(--color-warning-subtle)] text-[var(--color-warning)]',
  danger: 'bg-[var(--color-danger-subtle)] text-[var(--color-danger)]',
  info: 'bg-[var(--color-info-subtle)] text-[var(--color-info)]',
}

export function Badge({ tone = 'neutral', children, className }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap',
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  )
}
