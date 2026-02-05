import { getPayload } from 'payload'
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import config from '@/payload.config'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { NewsCard } from '@/components/ui/NewsCard'
import { NewsLoadMore } from './NewsLoadMore'
import { getDefaultOgImage } from '@/lib/seo/getDefaultOgImage'
import type { Locale } from '@/i18n/config'
import type { News } from '@/payload-types'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'news' })
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://v-ies.com'

  return {
    title: `${t('title')} | VIES`,
    description: t('description'),
    alternates: {
      canonical: `${siteUrl}/${locale}/news`,
    },
    openGraph: {
      title: t('title'),
      description: t('description'),
      type: 'website',
      images: [{ url: getDefaultOgImage() }],
    },
  }
}

// Server Action for loading more news
async function loadMoreNews(page: number, locale: string): Promise<{ docs: News[]; hasNextPage: boolean }> {
  'use server'
  const payload = await getPayload({ config: await config })
  const { docs, hasNextPage } = await payload.find({
    collection: 'news',
    locale: locale as Locale,
    sort: '-publishedAt',
    limit: 6,
    page,
    depth: 1, // Populate featuredImage
  })
  return { docs: docs as News[], hasNextPage }
}

export default async function NewsPage({ params }: Props) {
  const { locale } = await params

  const t = await getTranslations({ locale, namespace: 'news' })
  const tNav = await getTranslations({ locale, namespace: 'nav' })
  const tCommon = await getTranslations({ locale, namespace: 'common' })

  const payload = await getPayload({ config: await config })

  // Fetch news sorted by -publishedAt (newest first) with limit 6
  const { docs: initialNews, hasNextPage: initialHasNextPage } = await payload.find({
    collection: 'news',
    sort: '-publishedAt',
    locale: locale as Locale,
    limit: 6,
    depth: 1, // Populate featuredImage
  })

  return (
    <>
      {/* Breadcrumb: Home > Tin tức */}
      <Breadcrumb
        items={[{ label: tNav('breadcrumb.news') }]}
      />

      <div className="min-h-screen bg-background">
        {/* Page Header */}
        <div className="bg-white border-b border-border">
          <div className="mx-auto max-w-[var(--container-max)] px-md py-lg">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              {t('title')}
            </h1>
            <p className="text-text-muted mt-2 text-lg">
              {t('description')}
            </p>
          </div>
        </div>

        {/* News Grid with Load More */}
        <div className="mx-auto max-w-[var(--container-max)] px-md py-xl">
          {initialNews.length === 0 ? (
            // Empty state
            <div className="bg-white rounded-lg shadow-sm p-xl text-center">
              <p className="text-text-muted">{tCommon('noResults')}</p>
            </div>
          ) : (
            <NewsLoadMore
              initialNews={initialNews as News[]}
              initialHasNextPage={initialHasNextPage}
              locale={locale}
              loadMoreAction={loadMoreNews}
              loadMoreText={t('loadMore')}
            />
          )}
        </div>
      </div>
    </>
  )
}
