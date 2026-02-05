import { getTranslations } from 'next-intl/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { ProductsPageClient } from './ProductsPageClient'
import { SearchIcon, PhoneIcon } from '@/components/layout/icons'
import { formatTelHref } from '@/lib/utils'
import { getDefaultOgImage } from '@/lib/seo/getDefaultOgImage'
import type { Media, Brand, Category } from '@/payload-types'
import type { Locale } from '@/i18n/config'

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ brand?: string; category?: string; page?: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'products' })
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://v-ies.com'

  // SEO descriptions - static content for better SEO
  const descriptions: Record<string, string> = {
    vi: 'Khám phá các sản phẩm vòng bi, dầu mỡ công nghiệp chất lượng cao từ các thương hiệu hàng đầu như SKF, FAG, NSK.',
    en: 'Discover high-quality bearings and industrial lubricants from leading brands like SKF, FAG, NSK.',
  }

  return {
    title: `${t('title')} | VIES`,
    description: descriptions[locale] ?? descriptions.en,
    alternates: {
      canonical: `${siteUrl}/${locale}/products`,
    },
    openGraph: {
      title: t('title'),
      description: descriptions[locale] ?? descriptions.en,
      type: 'website',
      images: [{ url: getDefaultOgImage() }],
    },
  }
}

export default async function ProductsPage({ params, searchParams }: Props) {
  const { locale } = await params
  const { brand, category, page = '1' } = await searchParams
  const t = await getTranslations({ locale, namespace: 'products' })
  const tNav = await getTranslations({ locale, namespace: 'nav' })

  const payload = await getPayload({ config: await config })
  const tEmpty = await getTranslations({ locale, namespace: 'empty' })
  const currentPage = parseInt(page)
  const limit = 12
  // TODO: Move to site globals when available
  const consultPhone = '0908748304'

  // Parse comma-separated filter values (Task 2.2)
  const brandSlugs = brand?.split(',').filter(Boolean) || []
  const categorySlugs = category?.split(',').filter(Boolean) || []

  // Build Payload where clause (Task 2.4 - AND logic)
  // Note: _status filter removed - Products collection has `read: publishedOnly` access control
  const buildWhereClause = () => {
    const conditions: any[] = []

    // Brand filter - filter by brand slug
    if (brandSlugs.length > 0) {
      conditions.push({ 'brand.slug': { in: brandSlugs } })
    }

    // Category filter - categories is hasMany relationship
    if (categorySlugs.length > 0) {
      conditions.push({ 'categories.slug': { in: categorySlugs } })
    }

    return conditions.length > 0 ? { and: conditions } : undefined
  }

  // Fetch products and filter options (Task 2.2, 2.3)
  const [productsResult, brandsResult, categoriesResult] = await Promise.all([
    payload.find({
      collection: 'products',
      where: buildWhereClause(),
      limit,
      page: currentPage,
      sort: 'name',
      locale: locale as Locale,
      depth: 1,
    }),
    payload.find({
      collection: 'brands',
      limit: 100,
      sort: 'name',
      locale: locale as Locale,
    }),
    payload.find({
      collection: 'categories',
      limit: 100,
      sort: 'order',
      locale: locale as Locale,
    }),
  ])

  // Transform products for ProductCard (Task 2.6)
  const products = productsResult.docs.map((product) => {
    const firstImage = product.images?.[0]?.image as Media | null
    const productBrand = product.brand as Brand | null

    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      sku: product.sku || null,
      brand: productBrand ? { name: productBrand.name } : null,
      image: firstImage?.sizes?.thumbnail
        ? { url: firstImage.sizes.thumbnail.url || '', alt: firstImage.alt || '' }
        : null,
    }
  })

  // Transform brands and categories for filter (Task 2.3)
  const brands = brandsResult.docs.map((b) => ({
    id: b.id,
    name: b.name,
    slug: b.slug,
  }))

  const categories = categoriesResult.docs.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    parent: typeof c.parent === 'number' ? c.parent : c.parent?.id || null,
  }))

  // Active filters from URL
  const activeFilters = {
    brands: brandSlugs,
    categories: categorySlugs,
  }

  // Pagination info (Task 2.7)
  const hasMore = productsResult.hasNextPage
  const totalProducts = productsResult.totalDocs

  return (
    <>
      {/* Breadcrumb (Task 2.5) */}
      <Breadcrumb items={[{ label: tNav('breadcrumb.products') }]} />

      {/* Header */}
      <div className="bg-primary text-white py-8 md:py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{t('title')}</h1>
          <p className="text-blue-100">{t('productCount', { count: totalProducts })}</p>
        </div>
      </div>

      {/* Main Content (Task 2.5) */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        {products.length === 0 ? (
          /* Empty state (Task 2.8) */
          <div className="bg-white rounded-xl shadow-sm p-12 text-center max-w-md mx-auto">
            <SearchIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-700 font-medium mb-2">{tEmpty('noProducts')}</p>
            <p className="text-gray-500 text-sm">{tEmpty('noProductsHint')}</p>
            <a
              href={formatTelHref(consultPhone)}
              className="inline-flex items-center gap-2 mt-4 text-primary hover:underline font-medium"
            >
              <PhoneIcon className="w-4 h-4" />
              {tEmpty('contactEngineerPhone', { phone: consultPhone })}
            </a>
          </div>
        ) : (
          /* Products with filters (Task 2.5, 2.6) */
          <ProductsPageClient
            products={products}
            brands={brands}
            categories={categories}
            activeFilters={activeFilters}
            locale={locale}
            totalProducts={totalProducts}
            hasMore={hasMore}
            currentPage={currentPage}
          />
        )}
      </div>
    </>
  )
}
