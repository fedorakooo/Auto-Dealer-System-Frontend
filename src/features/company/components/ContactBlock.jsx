import { Icon } from '@/shared/ui/Icon.jsx'
import { Panel } from '@/shared/ui/Panel.jsx'
import {
  CONTACT_ADDRESS,
  CONTACT_EMAIL,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_E164,
  WORKING_HOURS,
} from '@/shared/config/contact.js'

export function ContactBlock() {
  return (
    <Panel title="Связаться с нами">
      <ul className="m-0 list-none space-y-4 p-0 text-sm">
        <li className="flex items-center gap-3">
          <Icon name="phone" className="text-[var(--color-accent)]" />
          <a href={`tel:${CONTACT_PHONE_E164}`} className="link">
            {CONTACT_PHONE_DISPLAY}
          </a>
        </li>
        <li className="flex items-center gap-3">
          <Icon name="mail" className="text-[var(--color-accent)]" />
          <a href={`mailto:${CONTACT_EMAIL}`} className="link">
            {CONTACT_EMAIL}
          </a>
        </li>
        <li className="flex items-start gap-3 text-[var(--color-text-muted)]">
          <Icon name="mapPin" className="text-[var(--color-accent)]" />
          {CONTACT_ADDRESS}
        </li>
        <li className="flex items-start gap-3 text-[var(--color-text-muted)]">
          <Icon name="clock" className="text-[var(--color-accent)]" />
          <span>
            {WORKING_HOURS.map((row) => (
              <span key={row.days} className="block">
                {row.days}: {row.hours}
              </span>
            ))}
          </span>
        </li>
      </ul>
    </Panel>
  )
}
