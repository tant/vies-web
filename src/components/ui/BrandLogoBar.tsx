import Image from 'next/image'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import type { Brand } from '@/payload-types'

type Props = {
  brands: Brand[]
  locale: string
}

export async function BrandLogoBar({ brands, locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'home' })

  // Don't render if no brands
  if (!brands || brands.length === 0) {
    return null
  }

  return (
    <section className="bg-white py-16 lg:py-20" aria-labelledby="partner-brands-heading">
      <div className="container mx-auto px-4">
        <h2
          id="partner-brands-heading"
          className="text-center text-xl md:text-2xl font-semibold text-gray-900 mb-8"
        >
          {t('ourBrands')}
        </h2>

        {/* Mobile: horizontal scroll, Desktop: flex wrap centered */}
        <div className="flex overflow-x-auto md:overflow-visible md:flex-wrap md:justify-center gap-6 md:gap-8 pb-4 md:pb-0 -mx-md px-md md:mx-0 md:px-0 snap-x snap-mandatory md:snap-none">
          {brands.map((brand) => {
            // Extract logo URL from Media relationship
            const logoUrl =
              typeof brand.logo === 'object' && brand.logo
                ? brand.logo.sizes?.thumbnail?.url ?? brand.logo.url
                : null

            const logoAlt =
              typeof brand.logo === 'object' && brand.logo
                ? brand.logo.alt || `${brand.name} logo`
                : `${brand.name} logo`

            return (
              <Link
                key={brand.id}
                href={`/${locale}/brands/${brand.slug}`}
                className="snap-start flex-shrink-0 flex items-center justify-center p-4 bg-white border border-border rounded-lg hover:border-primary hover:shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                aria-label={brand.name}
              >
                {logoUrl ? (
                  <Image
                    src={logoUrl}
                    alt={logoAlt}
                    width={120}
                    height={48}
                    unoptimized
                    className="h-10 md:h-12 w-auto min-w-[80px] object-contain"
                  />
                ) : (
                  <span className="text-lg md:text-xl font-bold text-primary h-10 md:h-12 flex items-center px-2">
                    {brand.name.slice(0, 3).toUpperCase()}
                  </span>
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
