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

  const news = await payload.find({
    collection: 'news',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  if (!news.docs[0]) return { title: 'News Not Found' }

  return {
    title: news.docs[0].title,
    description: news.docs[0].excerpt || news.docs[0].title,
  }
}

export default async function NewsDetailPage({ params }: Props) {
  const { locale, slug } = await params
  const t = await getTranslations({ locale, namespace: 'news' })
  const tCommon = await getTranslations({ locale, namespace: 'common' })

  const payload = await getPayload({ config: await config })

  const newsResult = await payload.find({
    collection: 'news',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const article = newsResult.docs[0]
  if (!article) notFound()

  // Get related news
  const relatedNews = await payload.find({
    collection: 'news',
    where: {
      id: { not_equals: article.id },
      _status: { equals: 'published' },
    },
    sort: '-publishedAt',
    limit: 3,
  })

  // Format date based on locale
  const formatDate = (date: string) => {
    const d = new Date(date)
    if (locale === 'vi') {
      return d.toLocaleDateString('vi-VN', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })
    }
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  }

  // Render rich text content
  const renderContent = (content: any) => {
    if (typeof content === 'string') {
      return <p>{content}</p>
    }
    if (content?.root?.children) {
      return content.root.children.map((node: any, idx: number) => {
        if (node.type === 'paragraph') {
          const text = node.children?.map((child: any) => child.text).join('') || ''
          return <p key={idx} className="mb-4">{text}</p>
        }
        if (node.type === 'heading') {
          const text = node.children?.map((child: any) => child.text).join('') || ''
          const Tag = `h${node.tag || 2}` as keyof React.JSX.IntrinsicElements
          return <Tag key={idx} className="font-bold text-gray-900 mt-6 mb-3">{text}</Tag>
        }
        if (node.type === 'list') {
          const ListTag = node.listType === 'number' ? 'ol' : 'ul'
          return (
            <ListTag key={idx} className={`mb-4 ml-6 ${node.listType === 'number' ? 'list-decimal' : 'list-disc'}`}>
              {node.children?.map((item: any, itemIdx: number) => (
                <li key={itemIdx}>{item.children?.map((child: any) => child.text).join('')}</li>
              ))}
            </ListTag>
          )
        }
        return null
      })
    }
    return <p className="text-gray-600">{locale === 'vi' ? 'Nội dung đang được cập nhật.' : 'Content is being updated.'}</p>
  }

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
            <Link href={`/${locale}/news`} className="text-gray-500 hover:text-primary">
              {t('title')}
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 font-medium truncate">{article.title}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <article className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* Featured Image */}
              <div className="aspect-[16/9] bg-gray-100 flex items-center justify-center">
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                  <NewspaperIcon className="w-32 h-32 text-gray-300" />
                </div>
              </div>

              {/* Article Content */}
              <div className="p-6 lg:p-10">
                {/* Meta */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4" />
                    {formatDate(article.publishedAt || article.createdAt)}
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
                  {article.title}
                </h1>

                {/* Excerpt */}
                {article.excerpt && (
                  <p className="text-lg text-gray-600 mb-8 leading-relaxed border-l-4 border-primary pl-4">
                    {article.excerpt}
                  </p>
                )}

                {/* Content */}
                <div className="prose prose-lg max-w-none text-gray-600">
                  {renderContent(article.content)}
                </div>

                {/* Share */}
                <div className="mt-10 pt-8 border-t">
                  <h4 className="font-semibold text-gray-900 mb-4">
                    {locale === 'vi' ? 'Chia sẻ bài viết' : 'Share this article'}
                  </h4>
                  <div className="flex gap-3">
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://v-ies.com/${locale}/news/${article.slug}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
                    >
                      <FacebookIcon className="w-5 h-5" />
                    </a>
                    <a
                      href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(`https://v-ies.com/${locale}/news/${article.slug}`)}&text=${encodeURIComponent(article.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-sky-500 text-white rounded-lg flex items-center justify-center hover:bg-sky-600 transition-colors"
                    >
                      <TwitterIcon className="w-5 h-5" />
                    </a>
                    <a
                      href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(`https://v-ies.com/${locale}/news/${article.slug}`)}&title=${encodeURIComponent(article.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-blue-700 text-white rounded-lg flex items-center justify-center hover:bg-blue-800 transition-colors"
                    >
                      <LinkedInIcon className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="mt-6 flex justify-between">
              <Link
                href={`/${locale}/news`}
                className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                {locale === 'vi' ? 'Quay lại tin tức' : 'Back to news'}
              </Link>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            {/* Related News */}
            {relatedNews.docs.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                <h3 className="font-semibold text-gray-900 mb-6">
                  {locale === 'vi' ? 'Tin tức liên quan' : 'Related News'}
                </h3>
                <div className="space-y-6">
                  {relatedNews.docs.map((news) => (
                    <Link
                      key={news.id}
                      href={`/${locale}/news/${news.slug}`}
                      className="block group"
                    >
                      <div className="aspect-[16/9] bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                        <NewspaperIcon className="w-8 h-8 text-gray-300" />
                      </div>
                      <h4 className="font-medium text-gray-900 group-hover:text-primary transition-colors line-clamp-2 text-sm">
                        {news.title}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(news.publishedAt || news.createdAt)}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
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

function ArrowLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
  )
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
    </svg>
  )
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}
