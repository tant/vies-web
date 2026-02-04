import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@/payload.config'

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ brand?: string; category?: string; search?: string; page?: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'products' })

  return {
    title: t('title'),
  }
}

export default async function ProductsPage({ params, searchParams }: Props) {
  const { locale } = await params
  const { brand, category, search, page = '1' } = await searchParams
  const t = await getTranslations({ locale, namespace: 'products' })
  const tCommon = await getTranslations({ locale, namespace: 'common' })

  const payload = await getPayload({ config: await config })
  const currentPage = parseInt(page)
  const limit = 12

  // Build where clause
  const where: any = { _status: { equals: 'published' } }
  if (brand) {
    const brandDoc = await payload.find({ collection: 'brands', where: { slug: { equals: brand } }, limit: 1 })
    if (brandDoc.docs[0]) {
      where.brand = { equals: brandDoc.docs[0].id }
    }
  }
  if (category) {
    const catDoc = await payload.find({ collection: 'categories', where: { slug: { equals: category } }, limit: 1 })
    if (catDoc.docs[0]) {
      where.categories = { contains: catDoc.docs[0].id }
    }
  }
  if (search) {
    where.or = [
      { name: { contains: search } },
      { sku: { contains: search } },
    ]
  }

  const [products, brands, categories] = await Promise.all([
    payload.find({
      collection: 'products',
      where,
      limit,
      page: currentPage,
    }),
    payload.find({ collection: 'brands', limit: 20 }),
    payload.find({ collection: 'categories', limit: 20 }),
  ])

  const totalPages = Math.ceil(products.totalDocs / limit)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{t('title')}</h1>
          <p className="text-blue-100">
            {locale === 'vi'
              ? `Hiển thị ${products.totalDocs} sản phẩm`
              : `Showing ${products.totalDocs} products`}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="lg:w-64 shrink-0">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">{t('filter')}</h3>

              {/* Search */}
              <form className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {tCommon('search')}
                </label>
                <input
                  type="text"
                  name="search"
                  defaultValue={search}
                  placeholder={locale === 'vi' ? 'Tìm theo tên, SKU...' : 'Search by name, SKU...'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </form>

              {/* Brands */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">{t('brand')}</h4>
                <div className="space-y-2">
                  <Link
                    href={`/${locale}/products${category ? `?category=${category}` : ''}`}
                    className={`block px-3 py-2 rounded-lg text-sm transition-colors ${!brand ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
                  >
                    {locale === 'vi' ? 'Tất cả' : 'All'}
                  </Link>
                  {brands.docs.map((b) => (
                    <Link
                      key={b.id}
                      href={`/${locale}/products?brand=${b.slug}${category ? `&category=${category}` : ''}`}
                      className={`block px-3 py-2 rounded-lg text-sm transition-colors ${brand === b.slug ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
                    >
                      {b.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Categories */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">{t('category')}</h4>
                <div className="space-y-2">
                  <Link
                    href={`/${locale}/products${brand ? `?brand=${brand}` : ''}`}
                    className={`block px-3 py-2 rounded-lg text-sm transition-colors ${!category ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
                  >
                    {locale === 'vi' ? 'Tất cả' : 'All'}
                  </Link>
                  {categories.docs.map((c) => (
                    <Link
                      key={c.id}
                      href={`/${locale}/products?category=${c.slug}${brand ? `&brand=${brand}` : ''}`}
                      className={`block px-3 py-2 rounded-lg text-sm transition-colors ${category === c.slug ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {products.docs.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <p className="text-gray-500">{tCommon('noResults')}</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.docs.map((product) => (
                    <Link
                      key={product.id}
                      href={`/${locale}/product/${product.slug}`}
                      className="card overflow-hidden group"
                    >
                      <div className="aspect-[4/3] bg-gray-100 flex items-center justify-center">
                        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                          <BearingIcon className="w-10 h-10 text-gray-400" />
                        </div>
                      </div>
                      <div className="p-5">
                        {product.sku && (
                          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                            {product.sku}
                          </span>
                        )}
                        <h3 className="font-semibold text-gray-900 mt-2 group-hover:text-primary transition-colors line-clamp-2">
                          {product.name}
                        </h3>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            {typeof product.brand === 'object' && product.brand?.name}
                          </span>
                          <span className="text-primary font-medium text-sm">
                            {tCommon('readMore')} →
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center gap-2">
                    {currentPage > 1 && (
                      <Link
                        href={`/${locale}/products?page=${currentPage - 1}${brand ? `&brand=${brand}` : ''}${category ? `&category=${category}` : ''}`}
                        className="px-4 py-2 bg-white rounded-lg shadow-sm hover:bg-gray-50"
                      >
                        ←
                      </Link>
                    )}
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <Link
                        key={p}
                        href={`/${locale}/products?page=${p}${brand ? `&brand=${brand}` : ''}${category ? `&category=${category}` : ''}`}
                        className={`px-4 py-2 rounded-lg shadow-sm ${p === currentPage ? 'bg-primary text-white' : 'bg-white hover:bg-gray-50'}`}
                      >
                        {p}
                      </Link>
                    ))}
                    {currentPage < totalPages && (
                      <Link
                        href={`/${locale}/products?page=${currentPage + 1}${brand ? `&brand=${brand}` : ''}${category ? `&category=${category}` : ''}`}
                        className="px-4 py-2 bg-white rounded-lg shadow-sm hover:bg-gray-50"
                      >
                        →
                      </Link>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
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
