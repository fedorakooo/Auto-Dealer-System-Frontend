export const ORDER_STATUSES = [
  'pending_payment',
  'processing',
  'ready_for_pickup',
  'completed',
  'cancelled',
]
export const CUSTOM_ORDER_STATUSES = [
  'pending_approval',
  'confirmed',
  'sent_to_factory',
  'in_production',
  'shipped',
  'delivered',
  'cancelled',
]
export const TEST_DRIVE_STATUSES = ['requested', 'confirmed', 'completed', 'cancelled']
export const VEHICLE_IN_STOCK = 'in_stock'
export const VEHICLE_STATUSES = [VEHICLE_IN_STOCK, 'reserved', 'sold', 'service', 'unavailable']
/** Vehicle statuses staff may set by hand; 'reserved' and 'sold' are driven by orders. */
export const MANUAL_VEHICLE_STATUSES = [VEHICLE_IN_STOCK, 'service', 'unavailable']
export const PAYMENT_METHODS = ['bank_transfer', 'bank_card', 'cash', 'loan', 'lease']
export const PAYMENT_STATUSES = ['paid', 'pending', 'authorized', 'failed', 'refunded']
export const APPOINTMENT_STATUSES = [
  'requested',
  'confirmed',
  'in_progress',
  'completed',
  'cancelled',
]
