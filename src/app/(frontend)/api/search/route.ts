import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { locales, defaultLocale, type Locale } from '@/i18n/config'

const MAX_QUERY_LENGTH = 100

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const query = searchParams.get('q')?.trim().slice(0, MAX_QUERY_LENGTH) ?? ''
  const localeParam = searchParams.get('locale') ?? defaultLocale
  const locale: Locale = locales.includes(localeParam as Locale)
    ? (localeParam as Locale)
    : defaultLocale

  if (query.length < 2) {
    return NextResponse.json({ results: [] })
  }

  try {
    const payload = await getPayload({ config: await config })

    const { docs } = await payload.find({
      collection: 'products',
      where: {
        or: [
          { name: { contains: query } },
          { sku: { contains: query } },
        ],
      },
      limit: 6,
      locale,
      select: {
        name: true,
        sku: true,
        slug: true,
        brand: true,
        images: true,
      },
    })

    const results = docs.map((doc) => ({
      id: doc.id,
      name: doc.name,
      sku: doc.sku,
      slug: doc.slug,
      brand: typeof doc.brand === 'object' && doc.brand ? doc.brand.name : null,
      thumbnail:
        typeof doc.images?.[0]?.image === 'object' && doc.images[0].image
          ? doc.images[0].image.sizes?.thumbnail?.url ?? doc.images[0].image.url
          : null,
    }))

    return NextResponse.json({ results })
  } catch {
    return NextResponse.json({ results: [], error: 'Internal server error' }, { status: 500 })
  }
}
