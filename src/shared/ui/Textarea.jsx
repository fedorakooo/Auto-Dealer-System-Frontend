import clsx from 'clsx'
const fieldClass =
  'min-h-[96px] w-full rounded-md border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 shadow-sm placeholder:text-zinc-500 transition-colors focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 disabled:opacity-50 dark:border-zinc-700'
export function Textarea({ id, label, error, hint, rows = 4, className = '', ...rest }) {
  return (
    <div className={clsx('mb-4 flex flex-col gap-1', className)}>
      <label htmlFor={id} className="text-xs font-medium tracking-wider text-zinc-500 uppercase">
        {label}
      </label>
      <textarea
        id={id}
        rows={rows}
        className={clsx(
          fieldClass,
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500'
        )}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        {...rest}
      />
      {error ? (
        <span id={`${id}-error`} className="text-sm text-red-400" role="alert">
          {error}
        </span>
      ) : null}
      {hint && !error ? (
        <span id={`${id}-hint`} className="text-sm text-zinc-500">
          {hint}
        </span>
      ) : null}
    </div>
  )
}
export function TextArea(props) {
  return <Textarea {...props} />
}
