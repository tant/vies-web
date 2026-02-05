import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import config from '@/payload.config'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { ProductCard } from '@/components/ui/ProductCard'
import { ProductGallery } from '@/components/product/ProductGallery'
import { SpecificationsTable } from '@/components/product/SpecificationsTable'
import { RichTextContent } from '@/components/product/RichTextContent'
import { QuoteRequestButton } from '@/components/ui/QuoteRequestForm'
import type { Product, Category } from '@/payload-types'
import type { Locale } from '@/i18n/config'

type Props = {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const payload = await getPayload({ config: await config })

  const { docs } = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug } },
    limit: 1,
    locale: locale as Locale,
  })

  const product = docs[0]

  if (!product) {
    return {
      title: locale === 'vi' ? 'Không tìm thấy sản phẩm' : 'Product Not Found',
    }
  }

  // Extract first image for og:image
  const firstImage = product.images?.[0]?.image
  const ogImageUrl =
    typeof firstImage === 'object' && firstImage
      ? firstImage.sizes?.medium?.url ?? firstImage.url
      : null

  const skuLabel = locale === 'vi' ? 'Mã' : 'SKU'
  const skuLabelFull = locale === 'vi' ? 'Mã sản phẩm' : 'Product code'

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://v-ies.com'

  const description = product.sku
    ? `${product.name} - ${skuLabel}: ${product.sku} - VIES`
    : `${product.name} - VIES`

  return {
    title: `${product.name} | VIES`,
    description,
    alternates: {
      canonical: `${siteUrl}/${locale}/product/${slug}`,
    },
    openGraph: {
      title: product.name,
      description,
      type: 'website',
      images: ogImageUrl ? [{ url: ogImageUrl }] : undefined,
    },
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { locale, slug } = await params
  const payload = await getPayload({ config: await config })
  const t = await getTranslations({ locale, namespace: 'products' })
  const tNav = await getTranslations({ locale, namespace: 'nav' })

  // Fetch product by slug with relationships populated (Task 1.2)
  const { docs } = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug } },
    limit: 1,
    locale: locale as Locale,
    depth: 2, // Populate brand and categories with their data
  })

  const product = docs[0]

  // Return 404 if product doesn't exist (Task 1.3)
  if (!product) {
    notFound()
  }

  // Extract brand data
  const brand = typeof product.brand === 'object' ? product.brand : null

  // Extract categories data
  const categories = (product.categories ?? [])
    .map((cat) => (typeof cat === 'object' ? cat : null))
    .filter((cat): cat is Category => cat !== null)

  // Extract images for gallery
  const images = product.images ?? []

  // Extract specifications
  const specifications = product.specifications ?? []

  // Fetch related products (same category, exclude current) (AC #5)
  const categoryIds = categories.map((cat) => cat.id)

  let relatedProducts: Product[] = []
  if (categoryIds.length > 0) {
    const { docs: related } = await payload.find({
      collection: 'products',
      where: {
        and: [{ categories: { in: categoryIds } }, { id: { not_equals: product.id } }],
      },
      limit: 4,
      locale: locale as Locale,
      depth: 1,
    })
    relatedProducts = related
  }

  return (
    <>
      {/* Breadcrumb (Task 1.4): Home > Sản phẩm > [Product Name] */}
      <Breadcrumb
        items={[
          { label: tNav('breadcrumb.products'), href: `/${locale}/products` },
          { label: product.name },
        ]}
      />

      {/* Main Content */}
      <div className="bg-white">
        <div className="mx-auto max-w-[var(--container-max)] px-md py-lg md:py-xl">
          {/* Product Detail Grid - Gallery + Info (Task 1.6) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg lg:gap-xl">
            {/* Left: Product Gallery (Task 2) */}
            <ProductGallery images={images} productName={product.name} />

            {/* Right: Product Info (Task 3) */}
            <div className="space-y-md">
              {/* Product Name (H1) - Task 3.1 */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{product.name}</h1>

              {/* SKU Badge - Task 3.2 */}
              {product.sku && (
                <div className="flex items-center gap-sm">
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                    {product.sku}
                  </span>
                </div>
              )}

              {/* Brand Link - Task 3.3 */}
              {brand && (
                <div className="flex items-center gap-sm">
                  <span className="text-gray-500">{t('brand')}:</span>
                  <Link
                    href={`/${locale}/products?brand=${brand.slug}`}
                    className="text-lg text-primary hover:underline font-medium"
                  >
                    {brand.name}
                  </Link>
                </div>
              )}

              {/* Categories Links - Task 3.4 */}
              {categories.length > 0 && (
                <div className="flex items-center gap-sm flex-wrap">
                  <span className="text-gray-500">{t('category')}:</span>
                  {categories.map((cat, index) => (
                    <span key={cat.id}>
                      <Link
                        href={`/${locale}/products?category=${cat.slug}`}
                        className="text-gray-600 hover:text-primary hover:underline"
                      >
                        {cat.name}
                      </Link>
                      {index < categories.length - 1 && (
                        <span className="text-gray-400 ml-1">,</span>
                      )}
                    </span>
                  ))}
                </div>
              )}

              {/* Quote Request Button - Opens modal form */}
              <div className="pt-md">
                <QuoteRequestButton
                  productName={product.name}
                  productSku={product.sku ?? undefined}
                  locale={locale}
                  label={t('requestQuote')}
                />
              </div>
            </div>
          </div>

          {/* Product Description Section (Task 5) - AC #3 */}
          {product.description && (
            <section className="mt-xl border-t border-border pt-xl">
              <h2 className="text-xl font-semibold mb-md">{t('description')}</h2>
              <RichTextContent data={product.description} className="prose prose-gray max-w-none" />
            </section>
          )}

          {/* Specifications Table (Task 4) - AC #2 */}
          {specifications.length > 0 && (
            <SpecificationsTable specifications={specifications} title={t('specifications')} />
          )}
        </div>
      </div>

      {/* Related Products Section (Task 6) - AC #5 */}
      {relatedProducts.length > 0 && (
        <section className="bg-gray-50 py-xl">
          <div className="mx-auto max-w-[var(--container-max)] px-md">
            <h2 className="text-2xl font-semibold mb-lg">{t('relatedProducts')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-md lg:gap-lg">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
