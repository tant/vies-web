import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'
import type { Media } from '@/payload-types'

type BrandItem = {
  id: number
  name: string
  slug: string
  logo?: number | Media | null
}

type Props = {
  brands: BrandItem[]
  locale: string
}

// Official brand logos served as static assets from /public, keyed by brand slug.
const BRAND_LOGOS: Record<string, string> = {
  skf: '/images/brands/skf.svg',
  fag: '/images/brands/fag.svg',
  ntn: '/images/brands/ntn.svg',
  timken: '/images/brands/timken.svg',
  optibelt: '/images/brands/optibelt.svg',
  tsubaki: '/images/brands/tsubaki.png',
  bando: '/images/brands/bando.svg',
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
            // Prefer the official static logo; fall back to the CMS logo relationship
            const logoUrl =
              BRAND_LOGOS[brand.slug] ??
              (typeof brand.logo === 'object' && brand.logo
                ? brand.logo.sizes?.thumbnail?.url ?? brand.logo.url
                : null)

            const logoAlt =
              typeof brand.logo === 'object' && brand.logo
                ? brand.logo.alt || `${brand.name} logo`
                : `${brand.name} logo`

            return (
              <Link
                key={brand.id}
                href={`/brands/${brand.slug}`}
                className="snap-start flex-shrink-0 flex items-center justify-center p-4 bg-white border border-border rounded-lg hover:border-primary hover:shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                aria-label={brand.name}
              >
                {logoUrl ? (
                  <Image
                    src={logoUrl}
                    alt={logoAlt}
                    width={120}
                    height={48}
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
