import { Link } from 'react-router-dom'
import { Icon } from '@/shared/ui/Icon.jsx'
import { buttonStyles } from '@/shared/ui/buttonStyles.js'

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  type = 'button',
  fullWidth,
  loading = false,
  disabled,
  children,
  ...rest
}) {
  return (
    <button
      type={type}
      className={buttonStyles({ variant, size, fullWidth, className })}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading ? (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
          aria-hidden="true"
        />
      ) : null}
      {children}
    </button>
  )
}

/** Router link styled as a button; avoids invalid `<a><button/></a>` nesting. */
export function LinkButton({
  to,
  variant = 'primary',
  size = 'md',
  fullWidth,
  className,
  icon,
  children,
  ...rest
}) {
  return (
    <Link to={to} className={buttonStyles({ variant, size, fullWidth, className })} {...rest}>
      {children}
      {icon ? <Icon name={icon} className="h-4 w-4" /> : null}
    </Link>
  )
}
