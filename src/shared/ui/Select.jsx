import clsx from 'clsx'
const fieldClass =
  'w-full rounded-md border border-zinc-700 bg-zinc-950 px-4 py-3 text-base text-zinc-100 shadow-sm transition-colors focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 disabled:opacity-50 dark:border-zinc-700'
export function Select({ id, label, error, children, className = '', ...rest }) {
  return (
    <div className={clsx('mb-4 flex flex-col gap-1', className)}>
      <label htmlFor={id} className="text-xs font-medium tracking-wider text-zinc-500 uppercase">
        {label}
      </label>
      <select
        id={id}
        className={clsx(
          fieldClass,
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500'
        )}
        aria-invalid={!!error}
        {...rest}
      >
        {children}
      </select>
      {error ? (
        <span className="text-sm text-red-400" role="alert">
          {error}
        </span>
      ) : null}
    </div>
  )
}
