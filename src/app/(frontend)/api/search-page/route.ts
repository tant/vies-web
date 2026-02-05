import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { locales, defaultLocale, type Locale } from '@/i18n/config'
import type { Media, Brand } from '@/payload-types'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const q = searchParams.get('q') || ''
  const localeParam = searchParams.get('locale') || defaultLocale
  const locale: Locale = locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : defaultLocale
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
  const limit = Math.min(50, Math.max(1, parseInt(searchParams.get('limit') || '12', 10)))

  if (!q.trim()) {
    return NextResponse.json({
      results: [],
      totalDocs: 0,
      hasNextPage: false,
      nextPage: null,
    })
  }

  const payload = await getPayload({ config: await config })

  const products = await payload.find({
    collection: 'products',
    locale,
    where: {
      and: [
        {
          or: [
            { name: { contains: q.trim() } },
            { sku: { contains: q.trim() } },
          ],
        },
        { _status: { equals: 'published' } },
      ],
    },
    limit,
    page,
    depth: 1,
  })

  const results = products.docs.map((product) => {
    // Get first image from images array
    const firstImage = product.images?.[0]?.image as Media | null
    const brand = product.brand as Brand | null

    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      sku: product.sku || null,
      brand: brand ? { id: brand.id, name: brand.name } : null,
      image: firstImage?.sizes?.thumbnail
        ? { url: firstImage.sizes.thumbnail.url || '', alt: firstImage.alt || '' }
        : null,
    }
  })

  return NextResponse.json({
    results,
    totalDocs: products.totalDocs,
    hasNextPage: products.hasNextPage,
    nextPage: products.nextPage,
  })
}
