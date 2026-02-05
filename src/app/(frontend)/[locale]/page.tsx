import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { BrandLogoBar } from '@/components/ui/BrandLogoBar'
import { SearchBar } from '@/components/ui/SearchBar'
import {
  CheckCircleIcon,
  ArrowRightIcon,
  GearIcon,
} from '@/components/layout/icons'
import { CTASection } from '@/components/ui/CTASection'
import type { Locale } from '@/i18n/config'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home' })

  return {
    title: t('hero.title'),
    description: t('hero.subtitle'),
  }
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home' })
  const tCommon = await getTranslations({ locale, namespace: 'common' })

  // Fetch data from Payload
  const payload = await getPayload({ config: await config })

  const [brands, categories, siteSettings] = await Promise.all([
    payload.find({
      collection: 'brands',
      limit: 20,
      sort: 'name',
      locale: locale as Locale,
      depth: 1,
    }),
    payload.find({
      collection: 'categories',
      limit: 6,
      locale: locale as Locale,
    }),
    payload.findGlobal({
      slug: 'site-settings',
      locale: locale as Locale,
    }),
  ])

  // Extract contact info from SiteSettings
  const primaryPhone = siteSettings.contact?.phone?.[0]?.number || '0963048317'
  const zaloLink = siteSettings.social?.zalo || `https://zalo.me/${primaryPhone.replace(/\D/g, '')}`

  // Quick search hints - localized labels AND queries
  const searchHints = [
    { label: '6205', query: '6205' },
    { label: '22210', query: '22210' },
    { label: 'SKF', query: 'SKF' },
    { label: 'FAG', query: 'FAG' },
    { label: t('quickSearch.ballBearings'), query: locale === 'vi' ? 'vòng bi cầu' : 'ball bearing' },
    { label: t('quickSearch.rollerBearings'), query: locale === 'vi' ? 'vòng bi đũa' : 'roller bearing' },
  ]

  // Service highlights
  const serviceHighlights = [
    t('dualSection.services.consultation'),
    t('dualSection.services.vibrationAnalysis'),
    t('dualSection.services.installation'),
  ]

  return (
    <>
      {/* Hero Section - Search First (Direction A) */}
      <section className="bg-bg py-16 lg:py-20">
        <div className="container mx-auto px-4 text-center">
          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-text mb-3">
            {t('hero.title')}
          </h1>

          {/* Subtitle */}
          <p className="text-base md:text-lg text-text-muted mb-8">
            {t('hero.subtitle')}
          </p>

          {/* SearchBar - Hero variant (640px như design) */}
          <div className="max-w-[640px] ml-auto mr-auto">
            <SearchBar variant="hero" consultPhone={primaryPhone} />
          </div>

          {/* Quick search hints */}
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {searchHints.map((hint) => (
              <Link
                key={hint.query}
                href={`/${locale}/search?q=${encodeURIComponent(hint.query)}`}
                className="px-3 py-1 text-sm bg-primary/10 text-primary hover:bg-primary/20 rounded transition-colors"
              >
                {hint.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Dual Section - Services & Products */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-0 rounded-xl overflow-hidden shadow-lg">
            {/* Services Panel - Steel Blue */}
            <div className="bg-primary p-8 lg:p-12 text-white">
              <h2 className="text-2xl lg:text-3xl font-bold mb-4">
                {t('dualSection.services.title')}
              </h2>
              <p className="text-white/80 mb-6">
                {t('dualSection.services.description')}
              </p>
              <ul className="space-y-3 mb-8">
                {serviceHighlights.map((highlight) => (
                  <li key={highlight} className="flex items-center gap-3">
                    <CheckCircleIcon className="w-5 h-5 flex-shrink-0 text-accent" aria-hidden="true" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={`/${locale}/services`}
                className="inline-flex items-center gap-2 bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
              >
                {t('dualSection.services.cta')}
                <ArrowRightIcon className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>

            {/* Products Panel - White */}
            <div className="bg-white p-8 lg:p-12">
              <h2 className="text-2xl lg:text-3xl font-bold text-text mb-4">
                {t('dualSection.products.title')}
              </h2>
              <p className="text-text-muted mb-6">
                {t('dualSection.products.description')}
              </p>

              {/* Category Grid */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                {categories.docs.slice(0, 6).map((category) => (
                  <Link
                    key={category.id}
                    href={`/${locale}/products?category=${category.slug}`}
                    className="flex items-center gap-2 p-3 bg-bg-alt rounded-lg hover:bg-primary/10 transition-colors group focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                  >
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <GearIcon className="w-4 h-4 text-primary" aria-hidden="true" />
                    </div>
                    <span className="font-medium text-text text-sm group-hover:text-primary transition-colors truncate">
                      {category.name}
                    </span>
                  </Link>
                ))}
              </div>

              <Link
                href={`/${locale}/products`}
                className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                {t('dualSection.products.cta')}
                <ArrowRightIcon className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Brands Logo Bar */}
      <BrandLogoBar brands={brands.docs} locale={locale} />

      {/* CTA Section */}
      <CTASection
        title={t('ctaTitle')}
        subtitle={t('ctaSubtitle')}
        phone={primaryPhone}
        zaloLink={zaloLink}
        callLabel={tCommon('callNow')}
        zaloLabel={tCommon('zaloChat')}
      />
    </>
  )
}
