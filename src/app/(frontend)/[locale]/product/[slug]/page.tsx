import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'

type Props = {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params
  const payload = await getPayload({ config: await config })

  const product = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  if (!product.docs[0]) return { title: 'Product Not Found' }

  return {
    title: product.docs[0].name,
    description: product.docs[0].sku ? `${product.docs[0].name} - SKU: ${product.docs[0].sku}` : product.docs[0].name,
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { locale, slug } = await params
  const t = await getTranslations({ locale, namespace: 'products' })
  const tCommon = await getTranslations({ locale, namespace: 'common' })
  const tContact = await getTranslations({ locale, namespace: 'contact' })

  const payload = await getPayload({ config: await config })

  const productResult = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const product = productResult.docs[0]
  if (!product) notFound()

  // Get related products
  const relatedProducts = await payload.find({
    collection: 'products',
    where: {
      id: { not_equals: product.id },
      ...(typeof product.brand === 'object' && product.brand?.id ? { brand: { equals: product.brand.id } } : {}),
    },
    limit: 4,
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm">
            <Link href={`/${locale}`} className="text-gray-500 hover:text-primary">
              {tCommon('home')}
            </Link>
            <span className="text-gray-400">/</span>
            <Link href={`/${locale}/products`} className="text-gray-500 hover:text-primary">
              {tCommon('products')}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-6 lg:p-8">
            {/* Image */}
            <div className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
                <BearingIcon className="w-16 h-16 text-gray-400" />
              </div>
            </div>

            {/* Info */}
            <div>
              {product.sku && (
                <span className="inline-block text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full mb-4">
                  SKU: {product.sku}
                </span>
              )}

              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              {typeof product.brand === 'object' && product.brand && (
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-gray-500">
                    {locale === 'vi' ? 'Thương hiệu:' : 'Brand:'}
                  </span>
                  <Link
                    href={`/${locale}/products?brand=${product.brand.slug}`}
                    className="font-semibold text-primary hover:underline"
                  >
                    {product.brand.name}
                  </Link>
                </div>
              )}

              {/* Specifications */}
              {product.specifications && product.specifications.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    {locale === 'vi' ? 'Thông số kỹ thuật' : 'Specifications'}
                  </h3>
                  <div className="bg-gray-50 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <tbody>
                        {product.specifications.map((spec, idx) => (
                          <tr key={idx} className="border-b border-gray-200 last:border-0">
                            <td className="px-4 py-3 font-medium text-gray-700 bg-gray-100 w-1/3">
                              {spec.key}
                            </td>
                            <td className="px-4 py-3 text-gray-900">
                              {spec.value}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="flex flex-wrap gap-4">
                <a
                  href="tel:+84963048317"
                  className="flex-1 min-w-[200px] bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <PhoneIcon className="w-5 h-5" />
                  {locale === 'vi' ? 'Gọi ngay' : 'Call Now'}
                </a>
                <Link
                  href={`/${locale}/contact?product=${product.slug}`}
                  className="flex-1 min-w-[200px] bg-secondary hover:bg-secondary-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors text-center"
                >
                  {t('requestQuote')}
                </Link>
              </div>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div className="border-t p-6 lg:p-8">
              <h3 className="font-semibold text-gray-900 mb-4">
                {locale === 'vi' ? 'Mô tả sản phẩm' : 'Product Description'}
              </h3>
              <div className="prose max-w-none text-gray-600">
                {typeof product.description === 'string' ? (
                  <p>{product.description}</p>
                ) : (
                  <p>{locale === 'vi' ? 'Liên hệ để biết thêm chi tiết.' : 'Contact us for more details.'}</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.docs.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {locale === 'vi' ? 'Sản phẩm liên quan' : 'Related Products'}
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.docs.map((p) => (
                <Link
                  key={p.id}
                  href={`/${locale}/product/${p.slug}`}
                  className="card overflow-hidden group"
                >
                  <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                      <BearingIcon className="w-8 h-8 text-gray-400" />
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 text-sm group-hover:text-primary transition-colors line-clamp-2">
                      {p.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function BearingIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  )
}
