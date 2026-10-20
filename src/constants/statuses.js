/** Presentation metadata for backend status codes: [badge tone, Russian label]. */
export const STATUS_META = {
  paid: ['success', 'Оплачен'],
  completed: ['success', 'Завершён'],
  delivered: ['success', 'Доставлен'],
  ready_for_pickup: ['success', 'Готов к выдаче'],
  confirmed: ['info', 'Подтверждён'],
  in_stock: ['info', 'В наличии'],
  authorized: ['info', 'Авторизован'],
  diagnosis: ['info', 'Диагностика'],
  in_progress: ['info', 'В работе'],
  processing: ['info', 'В обработке'],
  in_production: ['info', 'В производстве'],
  sent_to_factory: ['info', 'Отправлен на завод'],
  shipped: ['info', 'В пути'],
  pending: ['warning', 'Ожидает'],
  pending_payment: ['warning', 'Ожидает оплаты'],
  pending_approval: ['warning', 'Ожидает одобрения'],
  requested: ['warning', 'Запрошен'],
  reserved: ['warning', 'Зарезервирован'],
  refunded: ['neutral', 'Возвращён'],
  sold: ['neutral', 'Продан'],
  service: ['neutral', 'Сервис'],
  unavailable: ['neutral', 'Недоступен'],
  cancelled: ['danger', 'Отменён'],
  failed: ['danger', 'Ошибка'],
}

export function getStatusMeta(status) {
  const key = String(status || '').toLowerCase()
  return STATUS_META[key] ?? ['neutral', status || 'Не указан']
}

export function statusLabel(status) {
  return getStatusMeta(status)[1]
}
