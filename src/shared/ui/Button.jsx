import clsx from 'clsx'
const variants = {
  primary:
    'bg-[var(--color-primary)] text-[var(--color-on-primary)] hover:bg-[var(--color-primary-hover)]',
  secondary:
    'border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] hover:bg-[var(--color-surface-subtle)]',
  ghost: 'text-[var(--color-text)] hover:bg-[var(--color-surface-subtle)]',
  danger: 'bg-[var(--color-danger)] text-white hover:bg-[var(--color-accent-strong)]',
}
const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}
export function Button({
  variant = 'primary',
  size = 'md',
  className,
  type = 'button',
  fullWidth,
  ...rest
}) {
  return (
    <button
      type={type}
      className={clsx(
        'inline-flex min-h-11 items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] disabled:pointer-events-none disabled:opacity-50',
        fullWidth && 'w-full',
        variants[variant],
        sizes[size],
        className
      )}
      {...rest}
    />
  )
}
