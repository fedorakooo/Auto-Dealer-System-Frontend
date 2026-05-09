import { CompanyInfoSection } from '@/features/company/components/CompanyInfoSection.jsx'
import { DealershipCards } from '@/features/company/components/DealershipCards.jsx'
import { ContactBlock } from '@/features/company/components/ContactBlock.jsx'

export function CompanyPage() {
  return (
    <div>
      <CompanyInfoSection />
      <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
        <DealershipCards />
        <div className="space-y-6">
          <ContactBlock />
        </div>
      </div>
    </div>
  )
}
