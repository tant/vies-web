// JSON-LD structured data generators (schema.org) for SEO rich results.
// Pure functions returning plain objects; render them with <JsonLd data={...} />.

export const getSiteUrl = () =>
  (process.env.NEXT_PUBLIC_SITE_URL || 'https://vies.com.vn').replace(/\/$/, '')

const LEGAL_NAME_VI = 'Công ty TNHH Thương mại và Dịch vụ VIES'
const TAX_ID = '0318321326'

type Phone = { number?: string | null }
type Contact = {
  phone?: Phone[] | null
  email?: string | null
  address?: string | null
}
type Social = {
  facebook?: string | null
  zalo?: string | null
  youtube?: string | null
}

export function organizationSchema(opts: { contact?: Contact | null; social?: Social | null } = {}) {
  const site = getSiteUrl()
  const phones = (opts.contact?.phone ?? []).map((p) => p?.number).filter(Boolean) as string[]
  const sameAs = [opts.social?.facebook, opts.social?.youtube, opts.social?.zalo].filter(Boolean) as string[]
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${site}/#organization`,
    name: LEGAL_NAME_VI,
    alternateName: 'VIES',
    url: site,
    logo: `${site}/images/logo/vies-logo.jpg`,
    image: `${site}/images/logo/vies-logo.jpg`,
    ...(opts.contact?.email ? { email: opts.contact.email } : {}),
    ...(phones.length ? { telephone: phones[0] } : {}),
    taxID: TAX_ID,
    vatID: TAX_ID,
    ...(opts.contact?.address
      ? {
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Số 16 đường DD3-1',
            addressLocality: 'Phường Đông Hưng Thuận',
            addressRegion: 'Thành phố Hồ Chí Minh',
            addressCountry: 'VN',
          },
        }
      : {}),
    ...(phones.length
      ? {
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: phones[0],
            contactType: 'sales',
            areaServed: 'VN',
            availableLanguage: ['vi', 'en'],
          },
        }
      : {}),
    ...(sameAs.length ? { sameAs } : {}),
  }
}

export function websiteSchema() {
  const site = getSiteUrl()
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${site}/#website`,
    url: site,
    name: 'VIES',
    publisher: { '@id': `${site}/#organization` },
    inLanguage: ['vi', 'en'],
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${site}/search?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  }
}

export function productSchema(opts: {
  name: string
  description?: string | null
  image?: string | null
  sku?: string | null
  brand?: string | null
  category?: string | null
  url: string
}) {
  const site = getSiteUrl()
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: opts.name,
    ...(opts.description ? { description: opts.description } : {}),
    ...(opts.image ? { image: opts.image } : {}),
    ...(opts.sku ? { sku: opts.sku, mpn: opts.sku } : {}),
    ...(opts.brand ? { brand: { '@type': 'Brand', name: opts.brand } } : {}),
    ...(opts.category ? { category: opts.category } : {}),
    url: opts.url,
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      priceCurrency: 'VND',
      url: opts.url,
      seller: { '@id': `${site}/#organization` },
    },
  }
}

export function articleSchema(opts: {
  title: string
  description?: string | null
  image?: string | null
  url: string
  datePublished?: string | null
  dateModified?: string | null
}) {
  const site = getSiteUrl()
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: opts.title,
    ...(opts.description ? { description: opts.description } : {}),
    ...(opts.image ? { image: [opts.image] } : {}),
    mainEntityOfPage: opts.url,
    url: opts.url,
    ...(opts.datePublished ? { datePublished: opts.datePublished } : {}),
    ...(opts.dateModified || opts.datePublished
      ? { dateModified: opts.dateModified || opts.datePublished }
      : {}),
    author: { '@id': `${site}/#organization` },
    publisher: { '@id': `${site}/#organization` },
  }
}
