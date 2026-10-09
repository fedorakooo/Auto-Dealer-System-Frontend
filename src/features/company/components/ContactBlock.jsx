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
        <h2 className="text-lg font-semibold text-[var(--color-text)]">Связаться</h2>
        <ul className="mt-3 space-y-2 text-sm text-[var(--color-text-muted)]">
          <li>
            Телефон:{' '}
            <a
              href={`tel:${CONTACT_PHONE_E164}`}
              className="font-medium text-[var(--color-text)]"
            >
              {CONTACT_PHONE_DISPLAY}
            </a>
          </li>
          <li>
            Email:{' '}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-medium text-[var(--color-text)]"
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
