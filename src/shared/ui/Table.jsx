import clsx from 'clsx'
import { EmptyState } from '@/shared/ui/EmptyState.jsx'

/**
 * Generic read-only table. `columns` items: { key, header, render?(row), className? }.
 * Wrapped in a scroll container so wide tables never break the page layout.
 */
export function DataTable({
  columns,
  rows,
  getRowKey,
  caption,
  emptyMessage = 'Нет данных',
  className,
}) {
  if (!rows.length) {
    return <EmptyState title={emptyMessage} className="py-8" />
  }
  return (
    <div
      className={clsx(
        'overflow-x-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]',
        className
      )}
    >
      <table className="w-full min-w-max text-left text-sm">
        {caption ? <caption className="sr-only">{caption}</caption> : null}
        <thead className="bg-[var(--color-surface-subtle)] text-xs tracking-wider text-[var(--color-text-muted)] uppercase">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                className={clsx('px-4 py-3 font-semibold', column.className)}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--color-border)]">
          {rows.map((row, index) => (
            <tr
              key={getRowKey(row, index)}
              className="transition-colors hover:bg-[var(--color-surface-subtle)]"
            >
              {columns.map((column) => (
                <td key={column.key} className={clsx('px-4 py-3 align-top', column.className)}>
                  {column.render ? column.render(row) : (row[column.key] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
