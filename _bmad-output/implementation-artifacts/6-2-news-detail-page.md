# Story 6.2: News Detail Page

Status: done

## Story

As a khách hàng,
I want to read full news articles,
so that I can learn about VIES events and updates.

## Acceptance Criteria

1. **Given** `/news/{slug}` page, **When** trang load với valid slug, **Then** hiện: title, publishedAt date, featuredImage, content (richText rendered)
2. **Given** news detail page, **Then** related news (3 bài mới nhất, trừ bài hiện tại)
3. **Given** news detail page, **Then** breadcrumb: Home > Tin tức > [Title]
4. **Given** `/news/{slug}` with invalid slug, **Then** 404 page hiện
5. **Given** news detail page, **Then** SEO metadata (title, description, og:image) từ plugin-seo data

## Tasks / Subtasks

- [x] Task 1: Refactor news detail page to match service detail pattern (AC: #1, #3)
  - [x] 1.1 Refactor `src/app/(frontend)/[locale]/news/[slug]/page.tsx`
  - [x] 1.2 Use `next/image` for featuredImage (like service detail page)
  - [x] 1.3 Use `RichTextContent` component for content rendering
  - [x] 1.4 Use proper i18n translations (no hardcoded strings)
  - [x] 1.5 Use consistent container pattern `max-w-[var(--container-max)]`
  - [x] 1.6 Remove inline icons, use shared icons from `@/components/layout/icons`

- [x] Task 2: Improve related news section (AC: #2)
  - [x] 2.1 Reuse `NewsCard` component for related news display
  - [x] 2.2 Show 3 most recent articles excluding current article
  - [x] 2.3 Position in sidebar (desktop) or below content (mobile)
  - [x] 2.4 Use proper i18n key `news.relatedNews`

- [x] Task 3: Enhance SEO metadata (AC: #5)
  - [x] 3.1 Update `generateMetadata` to use locale properly
  - [x] 3.2 Include og:image from featuredImage
  - [x] 3.3 Set canonical URL
  - [x] 3.4 Format title as "{Article Title} | VIES"

- [x] Task 4: Verify 404 handling (AC: #4)
  - [x] 4.1 Ensure `notFound()` called when article not found
  - [x] 4.2 Test with invalid slug

## Dev Notes

### Critical Implementation Guidance

**DO:**
- Follow service detail page pattern ([services/[slug]/page.tsx:49-174](src/app/(frontend)/[locale]/services/[slug]/page.tsx))
- Use `RichTextContent` component (already exists in [RichTextContent.tsx](src/components/product/RichTextContent.tsx))
- Use `next/image` with proper sizes for featured image
- Use NewsCard component for related news section
- Use consistent design tokens (`py-xl`, `gap-lg`, `max-w-[var(--container-max)]`)
- Use all i18n keys from `news` namespace

**DON'T:**
- Don't create custom rich text renderer - use existing `RichTextContent`
- Don't use `<img>` tags - use `next/image`
- Don't hardcode strings - use translations from vi.json/en.json
- Don't define inline icons - import from shared icons file
- Don't add CTASection (not in requirements for news)

### Architecture Compliance

**Data Fetching Pattern** (from [architecture.md:625-640](/_bmad-output/planning-artifacts/architecture.md#L625-L640)):
```typescript
import { getPayload } from 'payload'
import config from '@/payload.config'

const payload = await getPayload({ config: await config })

// News by slug - publishedOnly access handles draft filtering
const { docs } = await payload.find({
  collection: 'news',
  where: { slug: { equals: slug } },
  limit: 1,
  locale: locale as Locale,
  depth: 1, // Populate featuredImage
})

// Related news - exclude current article
const relatedNews = await payload.find({
  collection: 'news',
  where: { id: { not_equals: article.id } },
  sort: '-publishedAt',
  limit: 3,
  locale: locale as Locale,
})
```

**Component Classification:**
- News detail page: Server Component
- NewsCard (related news): Server Component (data via props)

### News Collection Schema

From [News.ts:22-68](src/collections/News.ts):
- `title`: text, localized, required
- `slug`: text, unique, indexed
- `excerpt`: textarea, localized
- `content`: richText, localized
- `featuredImage`: upload → media
- `publishedAt`: date, indexed

### Patterns to Follow

**Service Detail Page Pattern** (from [services/[slug]/page.tsx](src/app/(frontend)/[locale]/services/[slug]/page.tsx)):
```typescript
// Image extraction pattern
const imageUrl =
  typeof service.featuredImage === 'object' && service.featuredImage
    ? service.featuredImage.sizes?.large?.url ?? service.featuredImage.url
    : null
const imageAlt =
  typeof service.featuredImage === 'object' && service.featuredImage
    ? service.featuredImage.alt || service.title
    : service.title

// Hero image with next/image
<div className="w-full aspect-[21/9] md:aspect-[3/1] relative overflow-hidden">
  <Image
    src={imageUrl}
    alt={imageAlt}
    fill
    priority
    className="object-cover"
    sizes="100vw"
  />
</div>

// Content with RichTextContent
<RichTextContent
  data={service.content}
  className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-p:text-gray-600"
/>
```

**NewsCard Component** (from [NewsCard.tsx](src/components/ui/NewsCard.tsx)):
- Already created in Story 6.1
- Can be reused for related news section
- Accepts `news` and `locale` props

### i18n Keys Available

From [vi.json](messages/vi.json):
```json
{
  "news": {
    "title": "Tin tức",
    "publishedAt": "Đăng ngày",
    "relatedNews": "Bài viết liên quan",
    "loadMore": "Xem thêm tin tức",
    "shareArticle": "Chia sẻ bài viết",
    "backToNews": "Quay lại tin tức"
  }
}
```

Add missing keys if needed:
```json
{
  "news": {
    "shareArticle": "Chia sẻ bài viết"
  }
}
```

### Date Formatting

Use `toLocaleDateString` with locale (same pattern as NewsCard):
```typescript
const formattedDate = news.publishedAt
  ? new Date(news.publishedAt).toLocaleDateString(
      locale === 'vi' ? 'vi-VN' : 'en-US',
      { year: 'numeric', month: 'long', day: 'numeric' }
    )
  : null
```

### Refactored Page Structure

```typescript
// src/app/(frontend)/[locale]/news/[slug]/page.tsx
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import { getTranslations } from 'next-intl/server'
import config from '@/payload.config'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { NewsCard } from '@/components/ui/NewsCard'
import { RichTextContent } from '@/components/product/RichTextContent'
import { CalendarIcon } from '@/components/layout/icons'
import type { Locale } from '@/i18n/config'

// 1. generateMetadata with proper locale and og:image
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Fetch article, return proper metadata with og:image
}

// 2. Main page component
export default async function NewsDetailPage({ params }: Props) {
  // Fetch article with locale
  // Fetch related news (3, excluding current)
  // 404 if not found

  return (
    <>
      {/* Breadcrumb: Home > Tin tức > [Title] */}
      <Breadcrumb items={[
        { label: tNav('breadcrumb.news'), href: `/${locale}/news` },
        { label: article.title },
      ]} />

      {/* Hero Image with next/image */}
      <section className="bg-white">
        {imageUrl && (
          <div className="w-full aspect-[21/9] md:aspect-[16/9] relative overflow-hidden">
            <Image src={imageUrl} alt={imageAlt} fill priority className="object-cover" sizes="100vw" />
          </div>
        )}

        {/* Article header: date, title */}
        <div className="mx-auto max-w-[var(--container-max)] px-md py-lg">
          <time className="text-sm text-text-muted flex items-center gap-1 mb-md">
            <CalendarIcon className="w-4 h-4" />
            {formattedDate}
          </time>
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

      {/* Content with RichTextContent */}
      <section className="py-xl bg-white">
        <div className="mx-auto max-w-[var(--container-max)] px-md">
          {article.content && (
            <RichTextContent
              data={article.content}
              className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-p:text-gray-600"
            />
          )}
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
              {relatedNews.docs.map(news => (
                <NewsCard key={news.id} news={news} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
```

### Project Structure Notes

**Files to modify:**
- `src/app/(frontend)/[locale]/news/[slug]/page.tsx` - Refactor to match service detail pattern

**Existing components to reuse:**
- `src/components/ui/Breadcrumb.tsx` - Breadcrumb navigation
- `src/components/ui/NewsCard.tsx` - For related news display
- `src/components/product/RichTextContent.tsx` - Rich text rendering
- `src/components/layout/icons.tsx` - CalendarIcon and other icons

**i18n files to update (if keys missing):**
- `messages/vi.json` - Add shareArticle, backToNews keys
- `messages/en.json` - Add shareArticle, backToNews keys

### Design Tokens

From [styles.css](src/app/(frontend)/styles.css):
- Container: `max-w-[var(--container-max)]` (1280px)
- Section padding: `py-xl` (32px)
- Content padding: `px-md` (16px)
- Grid gap: `gap-lg` (24px)
- Colors: `text-gray-900`, `text-text-muted`, `bg-gray-50`

### Image Optimization

Use `next/image` with appropriate sizes:
```typescript
// Hero image (full width)
<Image
  src={imageUrl}
  alt={imageAlt}
  fill
  priority  // Load immediately for LCP
  className="object-cover"
  sizes="100vw"
/>
```

### Previous Story Intelligence (6.1)

From Story 6.1 implementation:
- `NewsCard` component already created and working
- `CalendarIcon` added to shared icons
- Date formatting pattern established
- Server Action pattern for loading more news

### FR Coverage

This story covers:
- **NW-02**: News detail page with full article content

### References

- [epics.md:617-632](/_bmad-output/planning-artifacts/epics.md#L617-L632) - Story 6.2 requirements
- [architecture.md:685-692](/_bmad-output/planning-artifacts/architecture.md#L685-L692) - News page structure
- [prd.md](/_bmad-output/planning-artifacts/prd.md) - News FRs (NW-02)
- [services/[slug]/page.tsx](src/app/(frontend)/[locale]/services/[slug]/page.tsx) - Detail page pattern
- [NewsCard.tsx](src/components/ui/NewsCard.tsx) - Card component
- [RichTextContent.tsx](src/components/product/RichTextContent.tsx) - Rich text renderer
- [News.ts](src/collections/News.ts) - Collection schema

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- TypeScript check: passed
- Build: passed (all 35 pages generated)
- 404 handling test: verified (returns HTTP 404 for invalid slug)

### Completion Notes List

- **Task 1**: Complete refactor of news detail page following service detail pattern:
  - Replaced custom `renderContent()` function with `RichTextContent` component
  - Replaced placeholder div with `next/image` for featured image
  - Removed 7 inline icon definitions, now imports from shared icons
  - Changed container pattern from `container mx-auto px-4` to `max-w-[var(--container-max)] px-md`
  - Replaced hardcoded strings with i18n translations
  - Added proper locale to all PayloadCMS queries

- **Task 2**: Related news section refactored:
  - Now uses `NewsCard` component instead of manual rendering
  - Shows 3 most recent articles excluding current (unchanged logic)
  - Positioned below content in responsive grid layout
  - Uses `t('relatedNews')` i18n key

- **Task 3**: SEO metadata enhanced:
  - `generateMetadata` now includes locale in PayloadCMS query
  - Added og:image from featuredImage
  - Added canonical URL as `alternates.canonical`
  - Title formatted as "{Article Title} | VIES"
  - Added OpenGraph type and publishedTime

- **Task 4**: 404 handling verified:
  - `notFound()` called when article not found
  - Tested with curl: invalid slug returns HTTP 404

### File List

- `src/app/(frontend)/[locale]/news/[slug]/page.tsx` (modified - complete refactor)

### Code Review Fixes Applied

- [MEDIUM] Hardcoded domain in Facebook share URL → Now uses `process.env.NEXT_PUBLIC_SITE_URL` (page.tsx:178)
- [MEDIUM] Canonical URL was relative → Now uses absolute URL with siteUrl (page.tsx:56)
- [MEDIUM] Incorrect File List documentation → Removed false claims about i18n file changes
- [LOW] Missing draft filtering comment → Added clarifying comment (page.tsx:68)

## Change Log

| Date | Changes |
|------|---------|
| 2026-02-05 | Code review fixes applied - hardcoded URLs, canonical URL, documentation accuracy |
| 2026-02-05 | Story 6.2 implemented - News detail page refactored to match service detail pattern |
