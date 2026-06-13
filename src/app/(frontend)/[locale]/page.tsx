import { Suspense } from 'react'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { getPayload } from 'payload'
import { unstable_cache } from 'next/cache'
import config from '@/payload.config'
import { BrandLogoBar } from '@/components/ui/BrandLogoBar'
import { SearchBar } from '@/components/ui/SearchBar'
import { ProductCard } from '@/components/ui/ProductCard'
import { NewsCard } from '@/components/ui/NewsCard'
import {
  CheckCircleIcon,
  ArrowRightIcon,
  GearIcon,
} from '@/components/layout/icons'
import { CTASection } from '@/components/ui/CTASection'
import { getDefaultOgImage } from '@/lib/seo/getDefaultOgImage'
import { getHreflangAlternates } from '@/lib/seo/alternates'
import type { Locale } from '@/i18n/config'

export const dynamic = 'force-dynamic'

export function generateStaticParams() {
  return [{ locale: 'vi' }, { locale: 'en' }]
}

type Props = {
  params: Promise<{ locale: string }>
}

const getHomeData = unstable_cache(
  async (loc: string) => {
    const payload = await getPayload({ config: await config })
    const [brands, categories, featuredProducts, latestNews, siteSettings] = await Promise.all([
      payload.find({
        collection: 'brands',
        limit: 20,
        sort: 'name',
        locale: loc as Locale,
        depth: 1,
        select: { name: true, slug: true, logo: true },
      }),
      // Top-level product groups only (sub-categories are filtered out)
      payload.find({
        collection: 'categories',
        where: { parent: { exists: false } },
        limit: 8,
        sort: 'order',
        locale: loc as Locale,
        select: { name: true, slug: true },
      }),
      payload.find({
        collection: 'products',
        where: { featured: { equals: true }, _status: { equals: 'published' } },
        limit: 8,
        sort: '-createdAt',
        locale: loc as Locale,
        depth: 1,
      }),
      payload.find({
        collection: 'news',
        where: { _status: { equals: 'published' } },
        limit: 3,
        sort: '-publishedAt',
        locale: loc as Locale,
        depth: 1,
      }),
      payload.findGlobal({
        slug: 'site-settings',
        locale: loc as Locale,
        select: { contact: true, social: true },
      }),
    ])
    return { brands, categories, featuredProducts, latestNews, siteSettings }
  },
  ['home-data'],
  { revalidate: 3600, tags: ['home-data'] }
)

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home' })
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vies.com.vn'

  return {
    title: t('pageTitle'),
    description: t('hero.subtitle'),
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: getHreflangAlternates('').languages,
    },
    openGraph: {
      title: t('pageTitle'),
      description: t('hero.subtitle'),
      type: 'website',
      images: [{ url: getDefaultOgImage() }],
    },
  }
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home' })
  const tCommon = await getTranslations({ locale, namespace: 'common' })

  const { brands, categories, featuredProducts, latestNews, siteSettings } = await getHomeData(locale)

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
                href={`/search?q=${encodeURIComponent(hint.query)}`}
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
                href="/services"
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
                    href={`/products?category=${category.slug}`}
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
                href="/products"
                className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                {t('dualSection.products.cta')}
                <ArrowRightIcon className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.docs.length > 0 && (
        <section className="py-16 lg:py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-text">{t('featuredProducts')}</h2>
              <Link
                href="/products"
                className="inline-flex items-center gap-1 text-primary font-semibold hover:underline"
              >
                {tCommon('viewAll')}
                <ArrowRightIcon className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {featuredProducts.docs.map((product, i) => (
                <ProductCard key={product.id} product={product} locale={locale} priority={i < 4} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Partner Brands Logo Bar */}
      <Suspense fallback={<BrandLogoBarSkeleton />}>
        <BrandLogoBar brands={brands.docs} locale={locale} />
      </Suspense>

      {/* Latest News */}
      {latestNews.docs.length > 0 && (
        <section className="py-16 lg:py-20 bg-bg-alt">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-text">{t('latestNews')}</h2>
              <Link
                href="/news"
                className="inline-flex items-center gap-1 text-primary font-semibold hover:underline"
              >
                {tCommon('viewAll')}
                <ArrowRightIcon className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {latestNews.docs.map((article) => (
                <NewsCard key={article.id} news={article} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      )}

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

function BrandLogoBarSkeleton() {
  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="h-6 w-48 bg-gray-200 rounded mx-auto mb-8 animate-pulse" />
        <div className="flex justify-center gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="w-[120px] h-[48px] bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    </section>
  )
}
