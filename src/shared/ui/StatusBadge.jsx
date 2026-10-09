const palette = {
  paid: 'bg-[var(--color-success-subtle)] text-[var(--color-success)]',
  completed: 'bg-[var(--color-success-subtle)] text-[var(--color-success)]',
  confirmed: 'bg-[var(--color-info-subtle)] text-[var(--color-info)]',
  in_stock: 'bg-[var(--color-info-subtle)] text-[var(--color-info)]',
  pending: 'bg-[var(--color-warning-subtle)] text-[var(--color-warning)]',
  requested: 'bg-[var(--color-warning-subtle)] text-[var(--color-warning)]',
  diagnosis: 'bg-[var(--color-info-subtle)] text-[var(--color-info)]',
  in_progress: 'bg-[var(--color-info-subtle)] text-[var(--color-info)]',
  cancelled: 'bg-[var(--color-danger-subtle)] text-[var(--color-danger)]',
  failed: 'bg-[var(--color-danger-subtle)] text-[var(--color-danger)]',
  unavailable: 'bg-[var(--color-neutral-subtle)] text-[var(--color-text-muted)]',
}
const labels = {
  paid: 'Оплачен',
  completed: 'Завершён',
  confirmed: 'Подтверждён',
  in_stock: 'В наличии',
  pending: 'Ожидает',
  requested: 'Запрошена',
  diagnosis: 'Диагностика',
  in_progress: 'В работе',
  cancelled: 'Отменён',
  failed: 'Ошибка',
  unavailable: 'Недоступен',
}
export function StatusBadge({ status }) {
  const key = String(status || '').toLowerCase()
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${palette[key] || 'bg-[var(--color-neutral-subtle)] text-[var(--color-text-muted)]'}`}>{labels[key] || status || 'Не указан'}</span>
}
