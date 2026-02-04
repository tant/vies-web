import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@/payload.config'

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ q?: string; page?: string }>
}

export async function generateMetadata({ params, searchParams }: Props) {
  const { locale } = await params
  const { q } = await searchParams
  return {
    title: q ? `${locale === 'vi' ? 'Tìm kiếm' : 'Search'}: ${q}` : (locale === 'vi' ? 'Tìm kiếm' : 'Search'),
  }
}

export default async function SearchPage({ params, searchParams }: Props) {
  const { locale } = await params
  const { q = '', page = '1' } = await searchParams
  const tCommon = await getTranslations({ locale, namespace: 'common' })

  const payload = await getPayload({ config: await config })
  const currentPage = parseInt(page)
  const limit = 12

  let products = { docs: [] as any[], totalDocs: 0 }

  if (q.trim()) {
    products = await payload.find({
      collection: 'products',
      where: {
        or: [
          { name: { contains: q } },
          { sku: { contains: q } },
        ],
        status: { equals: 'published' },
      },
      limit,
      page: currentPage,
    })
  }

  const totalPages = Math.ceil(products.totalDocs / limit)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{tCommon('search')}</h1>

          {/* Search Form */}
          <form className="max-w-2xl">
            <div className="flex gap-2">
              <input
                type="text"
                name="q"
                defaultValue={q}
                placeholder={locale === 'vi' ? 'Nhập tên sản phẩm, mã SKU...' : 'Enter product name, SKU...'}
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button type="submit" className="bg-secondary hover:bg-secondary-dark px-6 py-3 rounded-lg font-semibold transition-colors">
                {tCommon('search')}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {q.trim() ? (
          <>
            <p className="text-gray-600 mb-6">
              {locale === 'vi'
                ? `Tìm thấy ${products.totalDocs} kết quả cho "${q}"`
                : `Found ${products.totalDocs} results for "${q}"`}
            </p>

            {products.docs.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <SearchIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">{tCommon('noResults')}</p>
                <p className="text-gray-400 text-sm">
                  {locale === 'vi' ? 'Thử tìm với từ khóa khác hoặc liên hệ với chúng tôi' : 'Try different keywords or contact us'}
                </p>
              </div>
            ) : (
              <>
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

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <Link
                        key={p}
                        href={`/${locale}/search?q=${encodeURIComponent(q)}&page=${p}`}
                        className={`px-4 py-2 rounded-lg shadow-sm ${p === currentPage ? 'bg-primary text-white' : 'bg-white hover:bg-gray-50'}`}
                      >
                        {p}
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <SearchIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              {locale === 'vi' ? 'Nhập từ khóa để tìm kiếm sản phẩm' : 'Enter keywords to search for products'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
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
