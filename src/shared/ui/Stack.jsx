import clsx from 'clsx'
export function Stack({ variant = 'col', children, className }) {
  return (
    <div
      className={clsx(
        variant === 'row' && 'flex flex-row flex-wrap items-center gap-4',
        variant === 'col' && 'flex flex-col gap-4',
        variant === 'grid' && 'grid grid-cols-1 gap-6',
        variant === 'grid2' && 'grid grid-cols-1 gap-6 sm:grid-cols-2',
        variant === 'grid3' && 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3',
        className
      )}
    >
      {children}
    </div>
  )
}
