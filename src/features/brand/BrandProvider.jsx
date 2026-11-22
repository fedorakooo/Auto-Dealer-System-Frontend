import { useLayoutEffect, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { BrandContext } from '@/features/brand/brandContext.js'
import {
  applyDocument,
  applyTheme,
  normalizeBrand,
  resolveLanguage,
} from '@/features/brand/brandUtils.js'
import { fetchBrand } from '@/features/brand/brandService.js'
import { QK } from '@/constants/queryKeys.js'
import { configureFormatting } from '@/lib/format.js'
import { setLanguage } from '@/shared/i18n/index.js'
import { useLanguageStore } from '@/shared/i18n/languageStore.js'
import { Spinner } from '@/shared/ui/Spinner.jsx'

/** Loads the deployment brand once and applies it (theme, document head, formatting, language). */
export function BrandProvider({ children }) {
  const query = useQuery({
    queryKey: QK.brand,
    queryFn: fetchBrand,
    staleTime: Infinity,
    gcTime: Infinity,
    retry: 1,
  })
  const chosenLanguage = useLanguageStore((s) => s.language)
  const loaded = query.isSuccess || query.isError
  const brand = useMemo(() => normalizeBrand(query.data), [query.data])
  const { language, locale } = resolveLanguage(brand, chosenLanguage)

  if (query.isError && import.meta.env.DEV) {
    console.warn('[brand] GET /brand failed, using neutral defaults', query.error)
  }

  // Formatting and i18n are module-level: configure them before children render.
  if (loaded) {
    setLanguage(language)
    configureFormatting({
      locale,
      currency: brand.locale.currency,
      timeZone: brand.locale.timezone,
    })
  }

  useLayoutEffect(() => {
    if (!loaded) return
    applyTheme(brand.theme)
    applyDocument(brand, language)
  }, [brand, loaded, language])

  if (!loaded) {
    return (
      <div className="grid min-h-screen place-items-center bg-[var(--color-bg)]">
        <Spinner />
      </div>
    )
  }

  // Keyed by language: a switch re-renders every translated string (t() is not a hook).
  return (
    <BrandContext.Provider value={brand} key={language}>
      {children}
    </BrandContext.Provider>
  )
}
