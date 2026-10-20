import { DealershipCards } from '@/features/company/components/DealershipCards.jsx'
import { ContactBlock } from '@/features/company/components/ContactBlock.jsx'
import { PageHeader } from '@/shared/ui/PageHeader.jsx'

export function CompanyPage() {
  return (
    <div>
      <PageHeader
        kicker="О компании"
        title="Компания и представительства"
        subtitle="Адреса и контакты представительств, а также быстрый переход к карточке салона."
      />
      <div className="grid gap-10 lg:grid-cols-[1fr_20rem] lg:items-start">
        <section aria-labelledby="company-dealerships">
          <h2 id="company-dealerships" className="mb-4 text-lg">
            Дилерские центры
          </h2>
          <DealershipCards />
        </section>
        <ContactBlock />
      </div>
    </div>
  )
}
