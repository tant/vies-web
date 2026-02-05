import { cache } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import config from '@/payload.config'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { ProductCard } from '@/components/ui/ProductCard'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Locale } from '@/i18n/config'

type Props = {
  params: Promise<{ locale: string; slug: string }>
  searchParams: Promise<{ page?: string }>
}

// Cached brand fetch to dedupe requests between generateMetadata and page component
const getBrand = cache(async (slug: string, locale: Locale) => {
  const payload = await getPayload({ config: await config })
  const { docs } = await payload.find({
    collection: 'brands',
    where: { slug: { equals: slug } },
    limit: 1,
    locale,
    depth: 1,
  })
  return docs[0] ?? null
})

// Task 4: SEO and metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const brand = await getBrand(slug, locale as Locale)

  if (!brand) {
    return {
      title: locale === 'vi' ? 'Không tìm thấy thương hiệu' : 'Brand Not Found',
    }
  }

  // Task 4.2: Extract logo for og:image
  const logoUrl =
    typeof brand.logo === 'object' && brand.logo
      ? brand.logo.sizes?.medium?.url ?? brand.logo.url
      : null

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://v-ies.com'

  // Task 4.1 & 4.3: Title format and description
  const description =
    locale === 'vi'
      ? `Sản phẩm ${brand.name} - VIES cung cấp vòng bi và linh kiện công nghiệp chính hãng`
      : `${brand.name} products - VIES supplies genuine bearings and industrial components`

  return {
    title: `${brand.name} | VIES`,
    description,
    alternates: {
      canonical: `${siteUrl}/${locale}/brands/${slug}`,
    },
    openGraph: {
      title: brand.name,
      description,
      type: 'website',
      images: logoUrl ? [{ url: logoUrl }] : undefined,
    },
  }
}

export default async function BrandDetailPage({ params, searchParams }: Props) {
  const { locale, slug } = await params
  const { page = '1' } = await searchParams
  const currentPage = parseInt(page, 10)

  const tCommon = await getTranslations({ locale, namespace: 'common' })
  const tNav = await getTranslations({ locale, namespace: 'nav' })
  const tProducts = await getTranslations({ locale, namespace: 'products' })

  // Use cached brand fetch (deduped with generateMetadata)
  const brand = await getBrand(slug, locale as Locale)
  if (!brand) notFound()

  const payload = await getPayload({ config: await config })

  // Task 3: Fetch products with pagination
  const limit = 12
  const {
    docs: products,
    totalDocs,
    hasNextPage,
    nextPage,
  } = await payload.find({
    collection: 'products',
    where: { brand: { equals: brand.id } },
    limit,
    page: currentPage,
    sort: 'name',
    locale: locale as Locale,
    depth: 1, // Task 2.3: Populate brand relationship for ProductCard
  })

  // Task 1.3: Extract logo URL from Media relationship
  const logoUrl =
    typeof brand.logo === 'object' && brand.logo
      ? brand.logo.sizes?.medium?.url ?? brand.logo.url
      : null

  return (
    <>
      {/* Task 1.1 & 1.2: Breadcrumb component - Home > Thương hiệu > [Brand Name] */}
      <Breadcrumb
        items={[{ label: tNav('breadcrumb.brands'), href: `/${locale}/products` }, { label: brand.name }]}
      />

      <div className="min-h-screen bg-background">
        {/* Task 1.6: BrandHeader section */}
        <div className="bg-white border-b border-border">
          <div className="mx-auto max-w-[var(--container-max)] px-md py-lg">
            <div className="flex items-center gap-lg">
              {/* Task 1.3: Brand logo from Media relationship */}
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={`${brand.name} logo`}
                  className="w-20 h-20 object-contain bg-white rounded-lg border border-border p-2"
                />
              ) : (
                <div className="w-20 h-20 bg-white rounded-lg border border-border flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">{brand.name.slice(0, 3)}</span>
                </div>
              )}
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{brand.name}</h1>
                <p className="text-text-muted mt-1">
                  {tProducts('productCount', { count: totalDocs })}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-[var(--container-max)] px-md py-lg">
          {/* Task 1.4 & 1.5: Brand Description section */}
          {(brand.description || brand.website) && (
            <div className="bg-white rounded-lg shadow-sm p-md mb-lg">
              <h2 className="text-xl font-semibold text-gray-900 mb-md">
                {tCommon('about')} {brand.name}
              </h2>
              {/* Task 1.4: Render description using RichText */}
              {brand.description && (
                <div className="prose prose-gray max-w-none">
                  <RichText data={brand.description} />
                </div>
              )}
              {/* Task 1.5: Website link with external link icon */}
              {brand.website && (
                <a
                  href={brand.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:underline mt-md"
                >
                  {tProducts('officialWebsite')}
                  <ExternalLinkIcon className="w-4 h-4" aria-hidden="true" />
                </a>
              )}
            </div>
          )}

          {/* Task 2: Product grid section with ProductCard */}
          <h2 className="text-2xl font-bold text-gray-900 mb-md">
            {tProducts('brandProducts', { brand: brand.name })}
          </h2>

          {products.length === 0 ? (
            // Empty state
            <div className="bg-white rounded-lg shadow-sm p-xl text-center">
              <p className="text-text-muted">{tCommon('noResults')}</p>
            </div>
          ) : (
            <>
              {/* Task 2.1 & 2.2: ProductCard grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-md">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} locale={locale} />
                ))}
              </div>

              {/* Task 3.4 & 3.5: Load More pagination */}
              {hasNextPage && (
                <div className="mt-lg text-center">
                  <Link
                    href={`/${locale}/brands/${slug}?page=${nextPage}`}
                    className="inline-flex items-center justify-center px-md py-sm border border-border rounded-lg text-text hover:border-primary transition-colors"
                  >
                    {tCommon('loadMore')}
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}

// Task 1.5: External link icon component
function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
      />
    </svg>
  )
}
