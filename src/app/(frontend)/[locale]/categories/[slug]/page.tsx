import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { cache } from 'react'
import type { Metadata } from 'next'
import config from '@/payload.config'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { ProductCard } from '@/components/ui/ProductCard'
import type { Locale } from '@/i18n/config'

type Props = {
  params: Promise<{ locale: string; slug: string }>
  searchParams: Promise<{ page?: string }>
}

// Cached category fetch to avoid duplicate DB calls between generateMetadata and page
const getCategory = cache(async (slug: string, locale: Locale) => {
  const payload = await getPayload({ config: await config })
  const { docs } = await payload.find({
    collection: 'categories',
    where: { slug: { equals: slug } },
    limit: 1,
    locale,
    depth: 1,
  })
  return docs[0] ?? null
})

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const category = await getCategory(slug, locale as Locale)

  if (!category) {
    return {
      title: locale === 'vi' ? 'Không tìm thấy danh mục' : 'Category Not Found',
    }
  }

  // Extract image for og:image
  const imageUrl =
    typeof category.image === 'object' && category.image
      ? category.image.sizes?.medium?.url ?? category.image.url
      : null

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://v-ies.com'
  const description = `${locale === 'vi' ? 'Sản phẩm' : 'Products in'} ${category.name} - VIES`

  return {
    title: `${category.name} | VIES`,
    description,
    alternates: {
      canonical: `${siteUrl}/${locale}/categories/${slug}`,
    },
    openGraph: {
      title: category.name,
      description,
      images: imageUrl ? [{ url: imageUrl }] : undefined,
    },
  }
}

export default async function CategoryDetailPage({ params, searchParams }: Props) {
  const { locale, slug } = await params
  const { page = '1' } = await searchParams
  const currentPage = parseInt(page, 10) || 1
  const limit = 12

  const payload = await getPayload({ config: await config })

  // Fetch category with image populated (uses cached function)
  const category = await getCategory(slug, locale as Locale)
  if (!category) notFound()

  // Fetch products with pagination
  const productsResult = await payload.find({
    collection: 'products',
    where: { categories: { contains: category.id } },
    limit,
    page: currentPage,
    sort: 'name',
    locale: locale as Locale,
    depth: 1,
  })
  const { docs: products, totalDocs, hasNextPage, nextPage } = productsResult

  // Fetch subcategories with images (limit to prevent excessive results)
  const subcategoriesResult = await payload.find({
    collection: 'categories',
    where: { parent: { equals: category.id } },
    sort: 'order',
    limit: 20,
    locale: locale as Locale,
    depth: 1,
  })
  const subcategories = subcategoriesResult.docs

  // Extract category image
  const categoryImageUrl =
    typeof category.image === 'object' && category.image
      ? category.image.sizes?.medium?.url ?? category.image.url
      : null
  const categoryImageAlt =
    typeof category.image === 'object' && category.image
      ? category.image.alt || category.name
      : category.name

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          { label: locale === 'vi' ? 'Danh mục' : 'Categories', href: `/${locale}/products` },
          { label: category.name },
        ]}
      />

      {/* Category Header */}
      <div className="bg-primary text-white py-12">
        <div className="mx-auto max-w-[var(--container-max)] px-md">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Category Image */}
            {categoryImageUrl && (
              <div className="w-full md:w-48 flex-shrink-0">
                <img
                  src={categoryImageUrl}
                  alt={categoryImageAlt}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}

            {/* Category Info */}
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold">{category.name}</h1>
              <p className="text-blue-100 mt-2">
                {totalDocs} {locale === 'vi' ? 'sản phẩm' : 'products'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[var(--container-max)] px-md py-12">
        {/* Category Description */}
        {category.description && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="prose prose-gray max-w-none">
              <RichText data={category.description} />
            </div>
          </div>
        )}

        {/* Subcategories */}
        {subcategories.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-text mb-4">
              {locale === 'vi' ? 'Danh mục con' : 'Subcategories'}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {subcategories.map((sub) => {
                const subImageUrl =
                  typeof sub.image === 'object' && sub.image
                    ? sub.image.sizes?.thumbnail?.url ?? sub.image.url
                    : null
                const subImageAlt =
                  typeof sub.image === 'object' && sub.image ? sub.image.alt || sub.name : sub.name

                return (
                  <Link
                    key={sub.id}
                    href={`/${locale}/categories/${sub.slug}`}
                    className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow text-center group"
                  >
                    {subImageUrl ? (
                      <img
                        src={subImageUrl}
                        alt={subImageAlt}
                        className="w-full h-24 object-cover rounded-lg mb-3"
                      />
                    ) : (
                      <div className="w-full h-24 bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                        <CategoryIcon className="w-10 h-10 text-gray-400" />
                      </div>
                    )}
                    <span className="font-medium text-text group-hover:text-primary transition-colors">
                      {sub.name}
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* Products Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
          <h2 className="text-2xl font-bold text-text">
            {locale === 'vi' ? 'Sản phẩm trong danh mục' : 'Products in this category'}
          </h2>
          {totalDocs > 0 && (
            <p className="text-sm text-text-muted">
              {locale === 'vi'
                ? `Hiển thị ${(currentPage - 1) * limit + 1}-${Math.min(currentPage * limit, totalDocs)} / ${totalDocs} sản phẩm`
                : `Showing ${(currentPage - 1) * limit + 1}-${Math.min(currentPage * limit, totalDocs)} of ${totalDocs} products`}
            </p>
          )}
        </div>

        {products.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <p className="text-text-muted">
              {locale === 'vi' ? 'Không có sản phẩm nào' : 'No products found'}
            </p>
          </div>
        ) : (
          <>
            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} locale={locale} />
              ))}
            </div>

            {/* Load More Button */}
            {hasNextPage && (
              <div className="mt-8 text-center">
                <Link
                  href={`/${locale}/categories/${slug}?page=${nextPage}`}
                  className="inline-flex items-center justify-center px-6 py-3 border border-border rounded-lg text-text hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 transition-colors"
                >
                  {locale === 'vi' ? 'Xem thêm' : 'Load More'}
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function CategoryIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
      />
    </svg>
  )
}
