import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { locales } from '@/i18n/config'

function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || 'https://v-ies.com'
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl()
  const payload = await getPayload({ config: await config })
  const now = new Date()

  const entries: MetadataRoute.Sitemap = []

  // Static routes for each locale
  for (const locale of locales) {
    // Homepage - priority 1.0, daily
    entries.push({
      url: `${siteUrl}/${locale}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    })

    // Listing pages - priority 0.8
    entries.push({
      url: `${siteUrl}/${locale}/products`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    })

    entries.push({
      url: `${siteUrl}/${locale}/services`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    })

    entries.push({
      url: `${siteUrl}/${locale}/news`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    })

    // Contact page - priority 0.6, monthly
    entries.push({
      url: `${siteUrl}/${locale}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    })

    // Search page - priority 0.5, weekly
    entries.push({
      url: `${siteUrl}/${locale}/search`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.5,
    })

    // Dedicated static pages (hardcoded routes not in Pages collection)
    // About page - priority 0.5, monthly
    entries.push({
      url: `${siteUrl}/${locale}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    })

    // FAQ page - priority 0.5, monthly
    entries.push({
      url: `${siteUrl}/${locale}/faq`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    })

    // Warranty page - priority 0.5, monthly
    entries.push({
      url: `${siteUrl}/${locale}/warranty`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    })

    // Privacy page - priority 0.5, yearly
    entries.push({
      url: `${siteUrl}/${locale}/privacy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.4,
    })

    // Terms page - priority 0.5, yearly
    entries.push({
      url: `${siteUrl}/${locale}/terms`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.4,
    })
  }

  // Dynamic routes from collections
  // Products - priority 0.7, weekly
  const { docs: products } = await payload.find({
    collection: 'products',
    limit: 0,
    select: { slug: true, updatedAt: true },
  })

  for (const product of products) {
    for (const locale of locales) {
      entries.push({
        url: `${siteUrl}/${locale}/product/${product.slug}`,
        lastModified: product.updatedAt ? new Date(product.updatedAt) : now,
        changeFrequency: 'weekly',
        priority: 0.7,
      })
    }
  }

  // Services - priority 0.7, monthly
  const { docs: services } = await payload.find({
    collection: 'services',
    limit: 0,
    select: { slug: true, updatedAt: true },
  })

  for (const service of services) {
    for (const locale of locales) {
      entries.push({
        url: `${siteUrl}/${locale}/services/${service.slug}`,
        lastModified: service.updatedAt ? new Date(service.updatedAt) : now,
        changeFrequency: 'monthly',
        priority: 0.7,
      })
    }
  }

  // News - priority 0.6, monthly, use publishedAt for lastmod
  const { docs: news } = await payload.find({
    collection: 'news',
    limit: 0,
    select: { slug: true, publishedAt: true, updatedAt: true },
  })

  for (const article of news) {
    for (const locale of locales) {
      entries.push({
        url: `${siteUrl}/${locale}/news/${article.slug}`,
        lastModified: article.publishedAt
          ? new Date(article.publishedAt)
          : article.updatedAt
            ? new Date(article.updatedAt)
            : now,
        changeFrequency: 'monthly',
        priority: 0.6,
      })
    }
  }

  // Brands - priority 0.6, weekly
  const { docs: brands } = await payload.find({
    collection: 'brands',
    limit: 0,
    select: { slug: true, updatedAt: true },
  })

  for (const brand of brands) {
    for (const locale of locales) {
      entries.push({
        url: `${siteUrl}/${locale}/brands/${brand.slug}`,
        lastModified: brand.updatedAt ? new Date(brand.updatedAt) : now,
        changeFrequency: 'weekly',
        priority: 0.6,
      })
    }
  }

  // Categories - priority 0.6, weekly
  const { docs: categories } = await payload.find({
    collection: 'categories',
    limit: 0,
    select: { slug: true, updatedAt: true },
  })

  for (const category of categories) {
    for (const locale of locales) {
      entries.push({
        url: `${siteUrl}/${locale}/categories/${category.slug}`,
        lastModified: category.updatedAt ? new Date(category.updatedAt) : now,
        changeFrequency: 'weekly',
        priority: 0.6,
      })
    }
  }

  // Pages (static pages like about, faq, etc.) - priority 0.5, monthly
  const { docs: pages } = await payload.find({
    collection: 'pages',
    limit: 0,
    select: { slug: true, updatedAt: true },
  })

  for (const page of pages) {
    for (const locale of locales) {
      entries.push({
        url: `${siteUrl}/${locale}/${page.slug}`,
        lastModified: page.updatedAt ? new Date(page.updatedAt) : now,
        changeFrequency: 'monthly',
        priority: 0.5,
      })
    }
  }

  return entries
}
