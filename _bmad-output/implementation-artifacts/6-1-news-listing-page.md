# Story 6.1: News Listing Page

Status: done

## Story

As a khách hàng,
I want to browse company news articles,
so that I can stay updated with VIES activities.

## Acceptance Criteria

1. **Given** `/news` page, **When** trang load, **Then** hiện danh sách bài viết sorted by publishedAt (mới nhất trước)
2. **Given** news listing, **Then** mỗi item hiện: featuredImage + title + excerpt + date
3. **Given** nhiều bài viết, **Then** pagination: Load More button (6 items per page)
4. **Given** `/news` page, **Then** breadcrumb: Home > Tin tức
5. **Given** không có bài viết, **Then** hiện empty state với message phù hợp

## Tasks / Subtasks

- [x] Task 1: Create NewsCard component (AC: #2)
  - [x] 1.1 Create `src/components/ui/NewsCard.tsx`
  - [x] 1.2 Accept `news` prop (News type from payload-types)
  - [x] 1.3 Display featuredImage (medium size), title, excerpt, publishedAt date
  - [x] 1.4 Format date using locale-appropriate format
  - [x] 1.5 Link entire card to `/[locale]/news/[slug]`
  - [x] 1.6 Add hover effects matching ServiceCard pattern

- [x] Task 2: Create News listing page (AC: #1, #3, #4, #5)
  - [x] 2.1 Create `src/app/(frontend)/[locale]/news/page.tsx`
  - [x] 2.2 Fetch news sorted by `-publishedAt` (newest first)
  - [x] 2.3 Implement initial load with limit 6
  - [x] 2.4 Add Breadcrumb: Home > Tin tức
  - [x] 2.5 Add page header with title and description
  - [x] 2.6 Render NewsCard grid (1 col mobile, 2 col tablet, 3 col desktop)
  - [x] 2.7 Add empty state when no articles

- [x] Task 3: Implement Load More pagination (AC: #3)
  - [x] 3.1 Create client component for Load More button state
  - [x] 3.2 Track current page and hasNextPage state
  - [x] 3.3 Fetch additional items on button click
  - [x] 3.4 Append new items to existing list
  - [x] 3.5 Hide button when no more items

- [x] Task 4: Add SEO metadata (AC: implicit)
  - [x] 4.1 Add generateMetadata function
  - [x] 4.2 Set title: "Tin tức | VIES" (localized)
  - [x] 4.3 Set meta description

## Dev Notes

### Critical Implementation Guidance

**DO:**
- Follow ServiceCard pattern exactly for NewsCard
- Use Server Component for page, Client Component only for Load More
- Sort by `-publishedAt` (descending = newest first)
- Use existing i18n keys from `news` namespace
- Use `payload.find()` with pagination (limit, page, hasNextPage)

**DON'T:**
- Don't create a separate API route - use Server Actions for Load More
- Don't reinvent date formatting - use `toLocaleDateString`
- Don't add CTASection on this page (not in requirements)
- Don't create custom empty state - use existing pattern

### Architecture Compliance

**Data Fetching Pattern** (from [architecture.md:625-640](/_bmad-output/planning-artifacts/architecture.md#L625-L640)):
```typescript
import { getPayload } from 'payload'
import config from '@payload-config'

const payload = await getPayload({ config: await config })

// News listing query - publishedOnly access handles draft filtering
const { docs, totalDocs, hasNextPage } = await payload.find({
  collection: 'news',
  locale,
  sort: '-publishedAt', // Newest first
  limit: 6,
  page: pageNumber,
})
```

**Component Classification:**
- NewsCard: Server Component (receives data via props)
- News listing page: Server Component (initial render)
- LoadMore button: Client Component (manages pagination state)

### News Collection Schema

From [News.ts:22-68](/src/collections/News.ts#L22-L68):
- `title`: text, localized, required
- `slug`: text, unique, indexed
- `excerpt`: textarea, localized
- `content`: richText, localized
- `featuredImage`: upload → media
- `publishedAt`: date, indexed

### Patterns to Follow

**ServiceCard Pattern** (from [ServiceCard.tsx:11-60](/src/components/ui/ServiceCard.tsx)):
```typescript
// Image extraction pattern
const imageUrl =
  typeof news.featuredImage === 'object' && news.featuredImage
    ? news.featuredImage.sizes?.medium?.url ?? news.featuredImage.url
    : null
```

**Services Page Pattern** (from [services/page.tsx:27-104](/src/app/(frontend)/[locale]/services/page.tsx)):
- Same structure: Breadcrumb → Header → Grid → CTASection
- Use `getTranslations` for i18n
- Use `generateMetadata` for SEO

### i18n Keys Available

From [vi.json:126-131](/messages/vi.json#L126-L131):
```json
{
  "news": {
    "title": "Tin tức",
    "publishedAt": "Đăng ngày",
    "relatedNews": "Bài viết liên quan",
    "loadMore": "Xem thêm tin tức"
  }
}
```

Also use:
- `nav.breadcrumb.news` for breadcrumb
- `common.noResults` for empty state
- `common.readMore` for card link text

### Date Formatting

Use `toLocaleDateString` with locale for date display:
```typescript
const formattedDate = new Date(news.publishedAt).toLocaleDateString(
  locale === 'vi' ? 'vi-VN' : 'en-US',
  { year: 'numeric', month: 'long', day: 'numeric' }
)
// VI: "05 tháng 2, 2026"
// EN: "February 5, 2026"
```

### NewsCard Component Structure

```typescript
// src/components/ui/NewsCard.tsx
import Link from 'next/link'
import type { News } from '@/payload-types'
import { CalendarIcon } from '@/components/layout/icons' // or create simple icon

export interface NewsCardProps {
  news: News
  locale: string
  readMoreText: string
}

export function NewsCard({ news, locale, readMoreText }: NewsCardProps) {
  // Image extraction (same as ServiceCard)
  const imageUrl = typeof news.featuredImage === 'object' && news.featuredImage
    ? news.featuredImage.sizes?.medium?.url ?? news.featuredImage.url
    : null

  // Date formatting
  const formattedDate = news.publishedAt
    ? new Date(news.publishedAt).toLocaleDateString(
        locale === 'vi' ? 'vi-VN' : 'en-US',
        { year: 'numeric', month: 'long', day: 'numeric' }
      )
    : null

  return (
    <article className="bg-white rounded-lg border border-border overflow-hidden group hover:border-primary transition-colors">
      <Link href={`/${locale}/news/${news.slug}`}>
        {/* Image 16:9 aspect */}
        <div className="aspect-[16/9] bg-gray-100 relative overflow-hidden">
          {imageUrl ? (
            <img src={imageUrl} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              {/* Placeholder icon */}
            </div>
          )}
        </div>
        {/* Content */}
        <div className="p-md">
          {formattedDate && (
            <time className="text-sm text-text-muted flex items-center gap-1 mb-2">
              <CalendarIcon className="w-4 h-4" />
              {formattedDate}
            </time>
          )}
          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary line-clamp-2 mb-2">
            {news.title}
          </h3>
          {news.excerpt && (
            <p className="text-text-muted line-clamp-3">{news.excerpt}</p>
          )}
        </div>
      </Link>
    </article>
  )
}
```

### Load More Implementation

Use Server Actions pattern (preferred over API routes):

```typescript
// In news/page.tsx - Server Action
async function loadMoreNews(page: number, locale: string) {
  'use server'
  const payload = await getPayload({ config: await config })
  const { docs, hasNextPage } = await payload.find({
    collection: 'news',
    locale: locale as Locale,
    sort: '-publishedAt',
    limit: 6,
    page,
  })
  return { docs, hasNextPage }
}

// Client component for Load More button
'use client'
export function NewsLoadMore({
  initialNews,
  initialHasNextPage,
  locale,
  loadMoreAction,
  loadMoreText
}: {
  initialNews: News[]
  initialHasNextPage: boolean
  locale: string
  loadMoreAction: (page: number, locale: string) => Promise<{ docs: News[], hasNextPage: boolean }>
  loadMoreText: string
}) {
  const [news, setNews] = useState(initialNews)
  const [hasNextPage, setHasNextPage] = useState(initialHasNextPage)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)

  const handleLoadMore = async () => {
    setLoading(true)
    const nextPage = page + 1
    const { docs, hasNextPage: morePages } = await loadMoreAction(nextPage, locale)
    setNews(prev => [...prev, ...docs])
    setHasNextPage(morePages)
    setPage(nextPage)
    setLoading(false)
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
        {news.map(item => <NewsCard key={item.id} news={item} locale={locale} />)}
      </div>
      {hasNextPage && (
        <div className="mt-xl text-center">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="px-lg py-md bg-primary text-white rounded-md hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? '...' : loadMoreText}
          </button>
        </div>
      )}
    </>
  )
}
```

### Project Structure Notes

Files to create:
- `src/components/ui/NewsCard.tsx` - News card component
- `src/app/(frontend)/[locale]/news/page.tsx` - News listing page

Directory already exists:
- `src/components/ui/` - contains ServiceCard, Button, etc.
- `src/app/(frontend)/[locale]/` - contains services/, products/, etc.

### Design Tokens

From [styles.css:768-803](/_bmad-output/planning-artifacts/architecture.md#L768-L803):
- Grid gap: `gap-lg` (24px)
- Container: `max-w-[var(--container-max)]` (1280px)
- Padding: `px-md py-xl`
- Card styling: `bg-white rounded-lg border border-border`

### FR Coverage

This story covers:
- **NW-01**: News listing page with sorted articles
- **NW-03**: Pagination (Load More)

### References

- [epics.md:600-615](/_bmad-output/planning-artifacts/epics.md#L600-L615) - Story 6.1 requirements
- [architecture.md:685-692](/_bmad-output/planning-artifacts/architecture.md#L685-L692) - News page structure
- [prd.md:149-156](/_bmad-output/planning-artifacts/prd.md#L149-L156) - News FRs (NW-01, NW-03)
- [ServiceCard.tsx](/src/components/ui/ServiceCard.tsx) - Card component pattern
- [services/page.tsx](/src/app/(frontend)/[locale]/services/page.tsx) - Listing page pattern
- [News.ts](/src/collections/News.ts) - Collection schema

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- Build verification passed after each component creation

### Completion Notes List

- Created NewsCard component following ServiceCard pattern with image extraction, locale-aware date formatting, and hover effects
- Rewrote existing news page to use Breadcrumb, NewsCard grid, and proper container max-width pattern
- Implemented Load More pagination using Server Actions (loadMoreNews) and client component (NewsLoadMore)
- Used useTransition hook for better UX during loading state
- CalendarIcon was already available from previous story (5-3-service-detail-page)
- SEO metadata includes localized title and description
- Empty state displays when no articles exist

### File List

**Created:**
- src/components/ui/NewsCard.tsx
- src/app/(frontend)/[locale]/news/NewsLoadMore.tsx

**Modified:**
- src/app/(frontend)/[locale]/news/page.tsx (rewrote with new pattern, i18n for description)
- src/app/(frontend)/styles.css (added max-width theme overrides per Tailwind CSS 4 best practice)
- messages/vi.json (added news.description key)
- messages/en.json (added news.description key)

### Code Review Fixes Applied

- HIGH: Corrected File List - removed false claim about icons.tsx modification (CalendarIcon was added in story 5-3)
- HIGH: Documented styles.css modification that was missing from File List
- MEDIUM: Replaced hardcoded page descriptions with i18n keys (news.description)
- MEDIUM: Added news.description to both vi.json and en.json

### Change Log

| Date | Change |
|------|--------|
| 2026-02-05 | Implemented Story 6.1: News Listing Page with NewsCard, Load More pagination, Breadcrumb, and SEO metadata |
| 2026-02-05 | Code Review: Fixed File List discrepancies, added i18n for page description |
