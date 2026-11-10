import { getPayload } from 'payload'
import { getTranslations } from 'next-intl/server'
import config from '@/payload.config'
import { locales, type Locale } from '@/i18n/config'
import { getSiteUrl } from '@/lib/seo/schema'
import { buildRss } from '@/lib/seo/rss'

export const dynamic = 'force-dynamic'

const LANG: Record<Locale, string> = { vi: 'vi-VN', en: 'en-US' }

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ locale: string }> },
) {
  const { locale } = await params
  if (!(locales as readonly string[]).includes(locale)) {
    return new Response('Not found', { status: 404 })
  }
  const loc = locale as Locale
  const siteUrl = getSiteUrl()
  const t = await getTranslations({ locale: loc, namespace: 'news' })
  const payload = await getPayload({ config: await config })

  // Local API mặc định bỏ qua access control, nên lọc _status tường minh để bài nháp không lọt vào feed.
  const { docs } = await payload.find({
    collection: 'news',
    locale: loc,
    sort: '-publishedAt',
    limit: 20,
    depth: 0,
    where: { _status: { equals: 'published' } },
  })

  const xml = buildRss({
    title: `VIES - ${t('title')}`,
    link: `${siteUrl}/${loc}/news`,
    description: t('description'),
    language: LANG[loc],
    selfUrl: `${siteUrl}/${loc}/news/feed.xml`,
    items: docs.map((d) => ({
      title: d.title,
      link: `${siteUrl}/${loc}/news/${d.slug}`,
      description: d.excerpt,
      pubDate: d.publishedAt ?? d.createdAt,
    })),
  })

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=600, stale-while-revalidate=3600',
    },
  })
}
