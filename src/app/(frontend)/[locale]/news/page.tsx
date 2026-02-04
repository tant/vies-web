import { getTranslations } from 'next-intl/server'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@/payload.config'

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ page?: string }>
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'news' })

  return {
    title: t('title'),
  }
}

export default async function NewsPage({ params, searchParams }: Props) {
  const { locale } = await params
  const { page = '1' } = await searchParams
  const t = await getTranslations({ locale, namespace: 'news' })
  const tCommon = await getTranslations({ locale, namespace: 'common' })

  const payload = await getPayload({ config: await config })
  const currentPage = parseInt(page)
  const limit = 9

  const news = await payload.find({
    collection: 'news',
    where: { _status: { equals: 'published' } },
    sort: '-publishedAt',
    limit,
    page: currentPage,
  })

  const totalPages = Math.ceil(news.totalDocs / limit)

  // Format date based on locale
  const formatDate = (date: string) => {
    const d = new Date(date)
    if (locale === 'vi') {
      return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
    }
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-primary text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{t('title')}</h1>
          <p className="text-blue-100">
            {locale === 'vi'
              ? 'Cập nhật tin tức và kiến thức ngành công nghiệp'
              : 'Latest industry news and insights'}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {news.docs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <NewspaperIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">{tCommon('noResults')}</p>
          </div>
        ) : (
          <>
            {/* Featured Article (first one) */}
            {currentPage === 1 && news.docs[0] && (
              <div className="mb-12">
                <Link
                  href={`/${locale}/news/${news.docs[0].slug}`}
                  className="block bg-white rounded-xl shadow-sm overflow-hidden group"
                >
                  <div className="grid lg:grid-cols-2">
                    <div className="aspect-[16/10] lg:aspect-auto bg-gray-100 flex items-center justify-center">
                      <div className="w-full h-full min-h-[300px] flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                        <NewspaperIcon className="w-24 h-24 text-gray-300" />
                      </div>
                    </div>
                    <div className="p-8 lg:p-12 flex flex-col justify-center">
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                        <CalendarIcon className="w-4 h-4" />
                        {formatDate(news.docs[0].publishedAt || news.docs[0].createdAt)}
                      </div>
                      <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors">
                        {news.docs[0].title}
                      </h2>
                      {news.docs[0].excerpt && (
                        <p className="text-gray-600 mb-6 line-clamp-3">{news.docs[0].excerpt}</p>
                      )}
                      <span className="text-primary font-semibold inline-flex items-center gap-2">
                        {tCommon('readMore')}
                        <ArrowRightIcon className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* News Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {news.docs.slice(currentPage === 1 ? 1 : 0).map((article) => (
                <Link
                  key={article.id}
                  href={`/${locale}/news/${article.slug}`}
                  className="bg-white rounded-xl shadow-sm overflow-hidden group"
                >
                  <div className="aspect-[16/10] bg-gray-100 flex items-center justify-center">
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5">
                      <NewspaperIcon className="w-16 h-16 text-gray-300" />
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                      <CalendarIcon className="w-4 h-4" />
                      {formatDate(article.publishedAt || article.createdAt)}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    {article.excerpt && (
                      <p className="text-gray-600 text-sm line-clamp-2">{article.excerpt}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center gap-2">
                {currentPage > 1 && (
                  <Link
                    href={`/${locale}/news?page=${currentPage - 1}`}
                    className="px-4 py-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 flex items-center gap-1"
                  >
                    <ChevronLeftIcon className="w-4 h-4" />
                    {locale === 'vi' ? 'Trước' : 'Previous'}
                  </Link>
                )}

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Link
                    key={p}
                    href={`/${locale}/news?page=${p}`}
                    className={`px-4 py-2 rounded-lg shadow-sm ${
                      p === currentPage
                        ? 'bg-primary text-white'
                        : 'bg-white hover:bg-gray-50'
                    }`}
                  >
                    {p}
                  </Link>
                ))}

                {currentPage < totalPages && (
                  <Link
                    href={`/${locale}/news?page=${currentPage + 1}`}
                    className="px-4 py-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 flex items-center gap-1"
                  >
                    {locale === 'vi' ? 'Sau' : 'Next'}
                    <ChevronRightIcon className="w-4 h-4" />
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

// Icons
function NewspaperIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
    </svg>
  )
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  )
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  )
}

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  )
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  )
}
