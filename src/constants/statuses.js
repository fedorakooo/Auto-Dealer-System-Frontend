import { t } from '@/shared/i18n/index.js'

/** Badge tone per backend status code; labels live in the `status` namespace and are translated at call time. */
export const STATUS_META = {
  paid: 'success',
  completed: 'success',
  delivered: 'success',
  ready_for_pickup: 'success',
  confirmed: 'info',
  in_stock: 'info',
  authorized: 'info',
  diagnosis: 'info',
  in_progress: 'info',
  processing: 'info',
  in_production: 'info',
  sent_to_factory: 'info',
  shipped: 'info',
  pending: 'warning',
  pending_payment: 'warning',
  pending_approval: 'warning',
  requested: 'warning',
  reserved: 'warning',
  refunded: 'neutral',
  sold: 'neutral',
  service: 'neutral',
  unavailable: 'neutral',
  cancelled: 'danger',
  failed: 'danger',
}

/** Returns [badge tone, translated label]; unknown codes fall back to the raw code. */
export function getStatusMeta(status) {
  const key = String(status || '').toLowerCase()
  const tone = STATUS_META[key]
  if (!tone) return ['neutral', status || t('status.unknown')]
  return [tone, t(`status.${key}`)]
}

export function statusLabel(status) {
  return getStatusMeta(status)[1]
}
