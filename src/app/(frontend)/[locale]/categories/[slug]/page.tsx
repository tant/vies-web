import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'

type Props = { params: Promise<{ locale: string; slug: string }> }

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const payload = await getPayload({ config: await config })
  const cat = await payload.find({ collection: 'categories', where: { slug: { equals: slug } }, limit: 1 })
  if (!cat.docs[0]) return { title: 'Category Not Found' }
  return { title: cat.docs[0].name }
}

export default async function CategoryDetailPage({ params }: Props) {
  const { locale, slug } = await params
  const tCommon = await getTranslations({ locale, namespace: 'common' })
  const payload = await getPayload({ config: await config })

  const catResult = await payload.find({ collection: 'categories', where: { slug: { equals: slug } }, limit: 1 })
  const category = catResult.docs[0]
  if (!category) notFound()

  const products = await payload.find({
    collection: 'products',
    where: { categories: { contains: category.id } },
    limit: 12,
  })

  // Get subcategories
  const subcategories = await payload.find({
    collection: 'categories',
    where: { parent: { equals: category.id } },
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary text-white py-12">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-2 text-sm mb-4 text-blue-200">
            <Link href={`/${locale}`} className="hover:text-white">{tCommon('home')}</Link>
            <span>/</span>
            <Link href={`/${locale}/products`} className="hover:text-white">{tCommon('products')}</Link>
            <span>/</span>
            <span className="text-white">{category.name}</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold">{category.name}</h1>
          <p className="text-blue-100 mt-2">
            {products.totalDocs} {locale === 'vi' ? 'sản phẩm' : 'products'}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Description */}
        {category.description && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <p className="text-gray-600">
              {typeof category.description === 'string' ? category.description : ''}
            </p>
          </div>
        )}

        {/* Subcategories */}
        {subcategories.docs.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {locale === 'vi' ? 'Danh mục con' : 'Subcategories'}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {subcategories.docs.map((sub) => (
                <Link key={sub.id} href={`/${locale}/categories/${sub.slug}`} className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow text-center">
                  <span className="font-medium text-gray-900">{sub.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Products */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {locale === 'vi' ? 'Sản phẩm trong danh mục' : 'Products in this category'}
        </h2>

        {products.docs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <p className="text-gray-500">{tCommon('noResults')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.docs.map((product) => (
              <Link key={product.id} href={`/${locale}/product/${product.slug}`} className="bg-white rounded-xl shadow-sm overflow-hidden group">
                <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                    <GearIcon className="w-8 h-8 text-gray-400" />
                  </div>
                </div>
                <div className="p-4">
                  {product.sku && (
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">{product.sku}</span>
                  )}
                  <h3 className="font-semibold text-gray-900 mt-2 group-hover:text-primary transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                  {typeof product.brand === 'object' && product.brand && (
                    <p className="text-sm text-gray-500 mt-1">{product.brand.name}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {products.totalDocs > 12 && (
          <div className="mt-8 text-center">
            <Link href={`/${locale}/products?category=${slug}`} className="inline-block bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-semibold transition-colors">
              {locale === 'vi' ? 'Xem tất cả sản phẩm' : 'View all products'}
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

function GearIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}
