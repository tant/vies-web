import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import config from '@/payload.config'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { NewsCard } from '@/components/ui/NewsCard'
import { RichTextContent } from '@/components/product/RichTextContent'
import { CalendarIcon, ArrowRightIcon, FacebookIcon } from '@/components/layout/icons'
import type { Locale } from '@/i18n/config'

type Props = {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const payload = await getPayload({ config: await config })

  const { docs } = await payload.find({
    collection: 'news',
    where: { slug: { equals: slug } },
    limit: 1,
    locale: locale as Locale,
    depth: 1,
  })

  const article = docs[0]
  if (!article) {
    const tMeta = await getTranslations({ locale: locale as Locale, namespace: 'meta' })
    return { title: tMeta('articleNotFound') }
  }

  // Extract og:image from featuredImage
  const imageUrl =
    typeof article.featuredImage === 'object' && article.featuredImage
      ? article.featuredImage.sizes?.large?.url ?? article.featuredImage.url
      : null

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://v-ies.com'

  return {
    title: article.title,
    description: article.excerpt ?? undefined,
    openGraph: {
      title: article.title,
      description: article.excerpt ?? undefined,
      images: imageUrl ? [{ url: imageUrl }] : undefined,
      type: 'article',
      publishedTime: article.publishedAt ?? undefined,
    },
    alternates: {
      canonical: `${siteUrl}/${locale}/news/${slug}`,
    },
  }
}

export default async function NewsDetailPage({ params }: Props) {
  const { locale, slug } = await params
  const payload = await getPayload({ config: await config })

  const t = await getTranslations({ locale, namespace: 'news' })
  const tNav = await getTranslations({ locale, namespace: 'nav' })

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://v-ies.com'

  // Fetch article by slug with locale (publishedOnly access handles draft filtering)
  const { docs } = await payload.find({
    collection: 'news',
    where: { slug: { equals: slug } },
    limit: 1,
    locale: locale as Locale,
    depth: 1, // Populate featuredImage
  })

  const article = docs[0]

  // 404 if not found
  if (!article) {
    notFound()
  }

  // Fetch related news (3 most recent, excluding current)
  const relatedNews = await payload.find({
    collection: 'news',
    where: { id: { not_equals: article.id } },
    sort: '-publishedAt',
    limit: 3,
    locale: locale as Locale,
    depth: 1,
  })

  // Extract image data (same pattern as service detail)
  const imageUrl =
    typeof article.featuredImage === 'object' && article.featuredImage
      ? article.featuredImage.sizes?.large?.url ?? article.featuredImage.url
      : null
  const imageAlt =
    typeof article.featuredImage === 'object' && article.featuredImage
      ? article.featuredImage.alt || article.title
      : article.title

  // Date formatting using locale
  const formattedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString(
        locale === 'vi' ? 'vi-VN' : 'en-US',
        { year: 'numeric', month: 'long', day: 'numeric' }
      )
    : null

  return (
    <>
      {/* Breadcrumb: Home > Tin tức > [Title] */}
      <Breadcrumb
        items={[
          { label: tNav('breadcrumb.news'), href: `/${locale}/news` },
          { label: article.title },
        ]}
      />

      {/* Hero Section with Featured Image */}
      <section className="bg-white">
        {imageUrl && (
          <div className="w-full aspect-[21/9] md:aspect-[16/9] relative overflow-hidden">
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          </div>
        )}

        {/* Article Header */}
        <div className="mx-auto max-w-[var(--container-max)] px-md py-lg md:py-xl">
          {formattedDate && (
            <time className="text-sm text-text-muted flex items-center gap-1 mb-md">
              <CalendarIcon className="w-4 h-4" aria-hidden="true" />
              {formattedDate}
            </time>
          )}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            {article.title}
          </h1>
          {article.excerpt && (
            <p className="text-lg text-text-muted mt-md max-w-3xl border-l-4 border-primary pl-4">
              {article.excerpt}
            </p>
          )}
        </div>
      </section>

      {/* Content Section */}
      {article.content && (
        <section className="py-xl bg-white">
          <div className="mx-auto max-w-[var(--container-max)] px-md">
            <RichTextContent
              data={article.content}
              className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-li:text-gray-600"
            />
          </div>
        </section>
      )}

      {/* Share Section */}
      <section className="bg-white border-t border-gray-100">
        <div className="mx-auto max-w-[var(--container-max)] px-md py-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-md">
            <h4 className="font-semibold text-gray-900">
              {t('shareArticle')}
            </h4>
            <div className="flex gap-3">
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`${siteUrl}/${locale}/news/${article.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors"
                aria-label="Facebook"
              >
                <FacebookIcon className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Back to news link */}
          <Link
            href={`/${locale}/news`}
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mt-lg"
          >
            <ArrowRightIcon className="w-4 h-4 rotate-180" />
            {t('backToNews')}
          </Link>
        </div>
      </section>

      {/* Related News */}
      {relatedNews.docs.length > 0 && (
        <section className="py-xl bg-gray-50">
          <div className="mx-auto max-w-[var(--container-max)] px-md">
            <h2 className="text-2xl font-semibold text-gray-900 mb-lg">
              {t('relatedNews')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
              {relatedNews.docs.map((news) => (
                <NewsCard key={news.id} news={news} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
