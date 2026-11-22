import clsx from 'clsx'

const variants = {
  primary:
    'bg-[var(--color-primary)] text-[var(--color-on-primary)] shadow-sm hover:bg-[var(--color-primary-hover)] hover:text-[var(--color-on-primary)]',
  accent:
    'bg-[var(--color-accent)] text-white shadow-sm hover:bg-[var(--color-accent-strong)] hover:text-white',
  secondary:
    'border border-[var(--color-border-strong)] bg-[var(--color-surface)] text-[var(--color-text)] shadow-sm hover:bg-[var(--color-surface-subtle)]',
  ghost: 'text-[var(--color-text)] hover:bg-[var(--color-surface-subtle)]',
  danger: 'bg-[var(--color-danger)] text-white shadow-sm hover:bg-red-800 hover:text-white',
}

const sizes = {
  sm: 'min-h-9 px-3 py-1.5 text-sm',
  md: 'min-h-11 px-4 py-2 text-sm',
  lg: 'min-h-12 px-6 py-3 text-base',
}

/** Class names shared by `<Button>` and `<LinkButton>`. */
export function buttonStyles({ variant = 'primary', size = 'md', fullWidth, className } = {}) {
  return clsx(
    'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] disabled:pointer-events-none disabled:opacity-50',
    fullWidth && 'w-full',
    variants[variant],
    sizes[size],
    className
  )
}
