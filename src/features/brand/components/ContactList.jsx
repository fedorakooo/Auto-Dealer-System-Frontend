import clsx from 'clsx'
import { useBrand } from '@/features/brand/brandContext.js'
import { t, localize } from '@/shared/i18n/index.js'
import { Icon } from '@/shared/ui/Icon.jsx'

const SOCIAL_LABELS = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  telegram: 'Telegram',
  vk: 'VK',
  youtube: 'YouTube',
  x: 'X',
  tiktok: 'TikTok',
  whatsapp: 'WhatsApp',
}

/** Head-office contacts from the brand config; rows without data are skipped. */
export function ContactList({ className, linkClassName, iconClassName, showHours = false }) {
  const { contacts } = useBrand()
  return (
    <ul className={clsx('m-0 list-none p-0', className)}>
      {contacts.phone ? (
        <li className="flex items-center gap-3">
          <Icon name="phone" className={iconClassName} />
          <a href={`tel:${contacts.phone}`} className={linkClassName}>
            {contacts.phone_display || contacts.phone}
          </a>
        </li>
      ) : null}
      {contacts.email ? (
        <li className="flex items-center gap-3">
          <Icon name="mail" className={iconClassName} />
          <a href={`mailto:${contacts.email}`} className={linkClassName}>
            {contacts.email}
          </a>
        </li>
      ) : null}
      {contacts.address ? (
        <li className="flex items-start gap-3">
          <Icon name="mapPin" className={iconClassName} />
          {localize(contacts.address)}
        </li>
      ) : null}
      {showHours && contacts.working_hours.length ? (
        <li className="flex items-start gap-3">
          <Icon name="clock" className={iconClassName} />
          <span>
            {contacts.working_hours.map((row) => (
              <span key={localize(row.days)} className="block">
                {localize(row.days)}: {localize(row.hours)}
              </span>
            ))}
          </span>
        </li>
      ) : null}
    </ul>
  )
}

export function SocialLinks({ className, linkClassName }) {
  const { social } = useBrand()
  if (!social.length) return null
  return (
    <ul className={clsx('m-0 flex list-none flex-wrap gap-x-4 gap-y-2 p-0', className)}>
      {social.map((item) => (
        <li key={item.url}>
          <a href={item.url} target="_blank" rel="noopener noreferrer" className={linkClassName}>
            {item.type === 'website'
              ? t('layout.contacts.website')
              : (SOCIAL_LABELS[item.type] ?? item.type)}
          </a>
        </li>
      ))}
    </ul>
  )
}
