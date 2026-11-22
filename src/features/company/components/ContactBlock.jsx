import { ContactList, SocialLinks } from '@/features/brand/components/ContactList.jsx'
import { Panel } from '@/shared/ui/Panel.jsx'
import { t } from '@/shared/i18n/index.js'

export function ContactBlock() {
  return (
    <Panel title={t('layout.contacts.contactUs')}>
      <ContactList
        showHours
        className="space-y-4 text-sm text-[var(--color-text-muted)]"
        linkClassName="link"
        iconClassName="text-[var(--color-accent)]"
      />
      <SocialLinks className="mt-4 text-sm" linkClassName="link" />
    </Panel>
  )
}
