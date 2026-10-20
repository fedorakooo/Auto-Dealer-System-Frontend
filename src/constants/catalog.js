/** Filter option lists and display labels for catalog attributes (value → Russian label). */
export const BODY_TYPES = [
  { value: 'sedan', label: 'Седан' },
  { value: 'suv', label: 'SUV' },
  { value: 'hatchback', label: 'Хэтчбек' },
]

export const FUEL_TYPES = [
  { value: 'petrol', label: 'Бензин' },
  { value: 'diesel', label: 'Дизель' },
  { value: 'electric', label: 'Электро' },
  { value: 'hybrid', label: 'Гибрид' },
]

export const TRANSMISSION_TYPES = [
  { value: 'automatic', label: 'Автомат' },
  { value: 'manual', label: 'Механика' },
]

export const SORT_OPTIONS = [
  { value: 'price', label: 'Цена' },
  { value: 'production_year', label: 'Год выпуска' },
]

export const ROLE_LABELS = {
  customer: 'Покупатель',
  employee: 'Сотрудник',
  admin: 'Администратор',
}

export const FILTER_LABELS = {
  model_name: 'Модель',
  body_type: 'Кузов',
  fuel_type: 'Топливо',
  transmission_type: 'Трансмиссия',
  sort_by: 'Сортировка',
}

const OPTION_GROUPS = {
  body_type: BODY_TYPES,
  fuel_type: FUEL_TYPES,
  transmission_type: TRANSMISSION_TYPES,
  sort_by: SORT_OPTIONS,
}

/** Human readable "Label: value" text for an active catalog filter chip. */
export function describeFilter(name, value) {
  const option = OPTION_GROUPS[name]?.find((item) => item.value === value)
  return `${FILTER_LABELS[name] ?? name}: ${option?.label ?? value}`
}
