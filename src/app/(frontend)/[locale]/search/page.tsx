import { getTranslations } from 'next-intl/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { SearchBar } from '@/components/ui/SearchBar'
import { SearchResults } from '@/components/search/SearchResults'
import { SearchIcon, PhoneIcon } from '@/components/layout/icons'
import { formatTelHref } from '@/lib/utils'
import { getDefaultOgImage } from '@/lib/seo/getDefaultOgImage'
import type { Media, Brand } from '@/payload-types'
import type { Locale } from '@/i18n/config'

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ q?: string }>
}

export async function generateMetadata({ params, searchParams }: Props) {
  const { locale } = await params
  const { q } = await searchParams
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://v-ies.com'

  const baseTitle = locale === 'vi' ? 'Tìm kiếm' : 'Search'
  const title = q ? `${baseTitle}: ${q} | VIES` : `${baseTitle} | VIES`
  const description = locale === 'vi'
    ? 'Tìm kiếm sản phẩm vòng bi, dầu mỡ công nghiệp tại VIES'
    : 'Search for bearings and industrial lubricants at VIES'

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/${locale}/search`,
    },
    openGraph: {
      title: baseTitle,
      description,
      type: 'website',
      images: [{ url: getDefaultOgImage() }],
    },
  }
}

export default async function SearchPage({ params, searchParams }: Props) {
  const { locale } = await params
  const { q = '' } = await searchParams
  const tSearch = await getTranslations({ locale, namespace: 'search' })
  const tNav = await getTranslations({ locale, namespace: 'nav' })

  const payload = await getPayload({ config: await config })
  const consultPhone = '0908748304'
  const limit = 12

  // Fetch initial results if query exists
  let products = { docs: [] as any[], totalDocs: 0 }

  if (q.trim()) {
    // Note: publishedOnly access control handles draft filtering
    products = await payload.find({
      collection: 'products',
      locale: locale as Locale,
      where: {
        or: [{ name: { contains: q } }, { sku: { contains: q } }],
      },
      limit,
      page: 1,
      depth: 1,
    })
  }

  // Transform products for client component
  const initialResults = products.docs.map((product) => {
    // Get first image from images array
    const firstImage = product.images?.[0]?.image as Media | null
    const brand = product.brand as Brand | null

    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      sku: product.sku || null,
      brand: brand ? { id: brand.id, name: brand.name } : null,
      image: firstImage?.sizes?.thumbnail
        ? { url: firstImage.sizes.thumbnail.url || '', alt: firstImage.alt || '' }
        : null,
    }
  })

  return (
    <>
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: tNav('breadcrumb.search') }]} />

      {/* Header with SearchBar */}
      <div className="bg-primary text-white py-8 md:py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">
            {tNav('breadcrumb.search')}
          </h1>
          <div className="max-w-2xl">
            <SearchBar variant="hero" consultPhone={consultPhone} />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        {q.trim() ? (
          <>
            {/* Results count */}
            <p className="text-gray-600 mb-6">
              {tSearch('resultsCount', { count: products.totalDocs, query: q })}
            </p>

            {products.docs.length === 0 ? (
              /* No results found */
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <SearchIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-700 font-medium mb-2">
                  {tSearch('noResults')}
                </p>
                <p className="text-gray-500 text-sm">
                  {tSearch('noResultsHint', { phone: consultPhone })}
                </p>
                <a
                  href={formatTelHref(consultPhone)}
                  className="inline-flex items-center gap-2 mt-4 text-primary hover:underline font-medium"
                  aria-label={`${tSearch('noResultsHint', { phone: consultPhone })}`}
                >
                  <PhoneIcon className="w-4 h-4" />
                  {consultPhone}
                </a>
              </div>
            ) : (
              /* Results grid with Load More */
              <SearchResults
                initialResults={initialResults}
                totalDocs={products.totalDocs}
                query={q}
                locale={locale}
              />
            )}
          </>
        ) : (
          /* No query - empty search state */
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <SearchIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-700 font-medium mb-2">
              {tSearch('enterKeywords')}
            </p>
            <p className="text-gray-500 text-sm">{tSearch('hints')}</p>
          </div>
        )}
      </div>
    </>
  )
}
