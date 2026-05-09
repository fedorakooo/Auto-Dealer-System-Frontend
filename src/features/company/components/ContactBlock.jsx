import { Card, CardBody } from '@/shared/ui/Card.jsx'
import {
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_E164,
} from '@/shared/config/contact.js'

export function ContactBlock() {
  return (
    <Card>
      <CardBody>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Связаться</h2>
        <ul className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
          <li>
            Телефон:{' '}
            <a
              href={`tel:${CONTACT_PHONE_E164}`}
              className="font-medium text-zinc-900 dark:text-zinc-100"
            >
              {CONTACT_PHONE_DISPLAY}
            </a>
          </li>
          <li>
            Email:{' '}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-medium text-zinc-900 dark:text-zinc-100"
            >
              {CONTACT_EMAIL}
            </a>
          </li>
          <li>Адрес: г. Минск, ул. Примерная, 1</li>
        </ul>
      </CardBody>
    </Card>
  )
}
