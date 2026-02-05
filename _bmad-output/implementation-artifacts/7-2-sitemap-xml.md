# Story 7.2: Sitemap.xml

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a marketing,
I want an auto-generated sitemap,
so that search engines can discover all pages.

## Acceptance Criteria

1. **Given** website deployed **When** crawler requests `/sitemap.xml` **Then** XML sitemap với all published pages: homepage, products, services, news, brands, categories, static pages

2. **Given** content changes in CMS **When** crawler requests `/sitemap.xml` **Then** sitemap auto-update reflects current published content

3. **Given** sitemap entries **When** sitemap renders **Then** include lastmod, changefreq, priority for each URL

**FRs:** SEO-03

## Tasks / Subtasks

- [x] Task 1: Create sitemap.ts file with Next.js Metadata API (AC: #1, #2)
  - [x] 1.1 Create `src/app/(frontend)/sitemap.ts` using Next.js sitemap convention
  - [x] 1.2 Import getPayload and config for CMS data access
  - [x] 1.3 Define helper function to get site URL from environment

- [x] Task 2: Implement static routes (AC: #1, #3)
  - [x] 2.1 Add homepage entries for both locales (vi, en) with priority 1.0, changefreq 'daily'
  - [x] 2.2 Add listing page entries (/products, /services, /news) with priority 0.8, changefreq 'daily'
  - [x] 2.3 Add contact page entry with priority 0.6, changefreq 'monthly'
  - [x] 2.4 Add search page entry with priority 0.5, changefreq 'weekly'

- [x] Task 3: Implement dynamic collection routes (AC: #1, #2, #3)
  - [x] 3.1 Fetch all published Products and add `/product/[slug]` entries with priority 0.7, changefreq 'weekly'
  - [x] 3.2 Fetch all published Services and add `/services/[slug]` entries with priority 0.7, changefreq 'monthly'
  - [x] 3.3 Fetch all published News and add `/news/[slug]` entries with priority 0.6, changefreq 'monthly', include lastmod from publishedAt
  - [x] 3.4 Fetch all Brands and add `/brands/[slug]` entries with priority 0.6, changefreq 'weekly'
  - [x] 3.5 Fetch all Categories and add `/categories/[slug]` entries with priority 0.6, changefreq 'weekly'
  - [x] 3.6 Fetch all published Pages and add `/[slug]` entries with priority 0.5, changefreq 'monthly'

- [x] Task 4: Multi-locale support (AC: #1)
  - [x] 4.1 Generate entries for both 'vi' and 'en' locales
  - [x] 4.2 Use locale prefix in URLs: `/${locale}/path`

- [x] Task 5: Add lastmod timestamps (AC: #3)
  - [x] 5.1 Use `updatedAt` field from documents where available
  - [x] 5.2 Use `publishedAt` for News articles
  - [x] 5.3 Use current date for static routes

- [x] Task 6: Create robots.ts file (Optional but recommended)
  - [x] 6.1 Create `src/app/robots.ts` (moved to app root for proper routing)
  - [x] 6.2 Allow all crawlers
  - [x] 6.3 Reference sitemap URL

- [x] Task 7: Build and test (AC: all)
  - [x] 7.1 Run `pnpm build` - ensure no TypeScript errors
  - [x] 7.2 Test `/sitemap.xml` endpoint returns valid XML
  - [x] 7.3 Validate sitemap with online validator tool
  - [x] 7.4 Verify all expected URLs are present

## Dev Notes

### Next.js 16 Sitemap Convention

Next.js App Router supports automatic sitemap generation via `sitemap.ts` file. The file should export a default function that returns an array of `MetadataRoute.Sitemap` entries.

**Location:** `src/app/(frontend)/sitemap.ts`

```typescript
import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Return array of sitemap entries
  return [
    {
      url: 'https://v-ies.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    // ... more entries
  ]
}
```

### Data Fetching Pattern

Use the established payload.find() pattern:

```typescript
import { getPayload } from 'payload'
import config from '@payload-config'

const payload = await getPayload({ config: await config })

// Fetch all published products (publishedOnly access handles draft filtering)
const { docs: products } = await payload.find({
  collection: 'products',
  limit: 0, // No limit - get all
  select: { slug: true, updatedAt: true },
})
```

**Important:** Use `limit: 0` to fetch ALL documents without pagination for sitemap generation.

### Site URL Configuration

```typescript
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://v-ies.com'
```

### Locale Configuration

From `src/i18n/config.ts`:
- Locales: `['vi', 'en']`
- Default: `'vi'`

Generate entries for both locales:
```typescript
import { locales } from '@/i18n/config'

// For each locale
for (const locale of locales) {
  entries.push({
    url: `${siteUrl}/${locale}/products`,
    // ...
  })
}
```

### Collections to Include

| Collection | Route Pattern | Priority | ChangeFreq |
|------------|--------------|----------|------------|
| Homepage | `/${locale}/` | 1.0 | daily |
| Products listing | `/${locale}/products` | 0.8 | daily |
| Product detail | `/${locale}/product/[slug]` | 0.7 | weekly |
| Services listing | `/${locale}/services` | 0.8 | weekly |
| Service detail | `/${locale}/services/[slug]` | 0.7 | monthly |
| News listing | `/${locale}/news` | 0.8 | daily |
| News detail | `/${locale}/news/[slug]` | 0.6 | monthly |
| Brand pages | `/${locale}/brands/[slug]` | 0.6 | weekly |
| Category pages | `/${locale}/categories/[slug]` | 0.6 | weekly |
| Contact | `/${locale}/contact` | 0.6 | monthly |
| Search | `/${locale}/search` | 0.5 | weekly |
| Static pages (about, faq, etc.) | `/${locale}/[...slug]` | 0.5 | monthly |

### Static Pages from Pages Collection

These are managed via the Pages collection in CMS and rendered by `[...slug]/page.tsx`:
- `/about`
- `/shipping`
- `/payment`
- `/warranty`
- `/faq`
- `/privacy`
- `/terms`

### Sitemap Entry Structure

```typescript
interface SitemapEntry {
  url: string           // Full URL including domain
  lastModified?: Date   // Last modification date
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  priority?: number     // 0.0 to 1.0, default is 0.5
}
```

### Complete Implementation Reference

```typescript
// src/app/(frontend)/sitemap.ts
import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { locales } from '@/i18n/config'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://v-ies.com'
  const payload = await getPayload({ config: await config })

  const entries: MetadataRoute.Sitemap = []

  // Static routes for each locale
  for (const locale of locales) {
    // Homepage
    entries.push({
      url: `${siteUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    })

    // Listing pages
    entries.push({
      url: `${siteUrl}/${locale}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    })
    // ... more static routes
  }

  // Dynamic routes from collections
  const { docs: products } = await payload.find({
    collection: 'products',
    limit: 0,
    select: { slug: true, updatedAt: true },
  })

  for (const product of products) {
    for (const locale of locales) {
      entries.push({
        url: `${siteUrl}/${locale}/product/${product.slug}`,
        lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      })
    }
  }

  // ... similar for other collections

  return entries
}
```

### Robots.ts Reference

```typescript
// src/app/(frontend)/robots.ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://v-ies.com'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
```

### Project Structure Notes

**File to create:**
- `src/app/(frontend)/sitemap.ts` - Main sitemap generator
- `src/app/(frontend)/robots.ts` - Robots.txt configuration (optional but recommended)

**Path convention:** Place in `(frontend)` route group so sitemap is served at `/sitemap.xml` (not `/[locale]/sitemap.xml`)

### Performance Considerations

- Use `select` to fetch only needed fields (slug, updatedAt)
- `limit: 0` fetches all documents - suitable for moderate catalog sizes (<1000 items)
- For very large catalogs (>1000 items), consider using `sitemap-index` pattern with multiple sitemaps
- Sitemap is regenerated on each request; consider ISR if needed for performance

### Testing Checklist

- [ ] `/sitemap.xml` returns valid XML
- [ ] All locale variations present (vi and en for each route)
- [ ] Homepage has priority 1.0
- [ ] All Products have entries
- [ ] All published Services have entries
- [ ] All published News have entries with publishedAt as lastmod
- [ ] All Brands have entries
- [ ] All Categories have entries
- [ ] All published Pages have entries
- [ ] Static routes (contact, search) included
- [ ] `/robots.txt` references sitemap URL
- [ ] Validate with Google Search Console sitemap tester

### Previous Story Intelligence (7.1 - SEO Meta Tags)

Story 7.1 established:
- Site URL pattern: `process.env.NEXT_PUBLIC_SITE_URL || 'https://v-ies.com'`
- Canonical URL format: `${siteUrl}/${locale}/${path}`
- SEO plugin configured for products, news, services, pages
- OG image pattern using media sizes

The sitemap should use the same URL patterns established in 7.1 for consistency.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 7.2] - Story requirements
- [Source: _bmad-output/planning-artifacts/architecture.md#Section 7] - Project structure
- [Source: src/i18n/config.ts] - Locale configuration (vi, en)
- [Source: src/payload.config.ts] - Collections configuration
- [Source: Next.js Docs] - Sitemap Metadata API: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap

## Dev Agent Record

### Agent Model Used

claude-opus-4-5-20251101

### Debug Log References

None

### Completion Notes List

- Created sitemap.ts with Next.js Metadata API convention for automatic /sitemap.xml generation
- Implemented static routes for homepage, products, services, news, contact, and search pages
- Implemented dynamic routes for Products, Services, News, Brands, Categories, and Pages collections
- Added multi-locale support generating entries for both 'vi' and 'en' locales
- Used updatedAt for lastmod timestamps, publishedAt for News articles, and current date for static routes
- Created robots.ts at app root for proper /robots.txt generation
- robots.txt allows all crawlers, disallows /admin/ and /api/, and references sitemap URL
- Build successful with no TypeScript errors
- Verified sitemap.xml returns valid XML with 104 URLs
- Verified robots.txt returns correct content

### File List

- `src/app/(frontend)/sitemap.ts` (modified) - Sitemap generator with static and dynamic routes - added 5 missing static pages, fixed changefreq
- `src/app/robots.ts` (new) - Robots.txt configuration

### Code Review Fixes Applied

- **HIGH:** Added 5 missing dedicated static pages to sitemap (about, faq, warranty, privacy, terms) - these hardcoded route files were not being included
- **MEDIUM:** Fixed services listing changefreq from 'daily' to 'weekly' per story spec

### Change Log

- 2026-02-05: Code review - added missing static pages, fixed services changefreq
- 2026-02-05: Initial implementation of sitemap.xml and robots.txt per story requirements
