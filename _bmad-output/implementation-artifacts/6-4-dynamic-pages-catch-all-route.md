# Story 6.4: Dynamic Pages Catch-All Route

Status: done

## Story

As a admin,
I want CMS pages to automatically render on the frontend,
so that I can create/edit pages without code changes.

## Acceptance Criteria

1. **Given** `[...slug]/page.tsx` catch-all route exists, **When** user visits `/{locale}/about` (or shipping, payment, warranty, faq, privacy, terms), **Then** query Pages collection by slug and render page content
2. **Given** valid Pages collection document, **When** page renders, **Then** display title + content (richText) + layout blocks using RenderBlocks
3. **Given** page with layout blocks, **When** page renders, **Then** render all blocks correctly (HeroBlock, ContentBlock, CTABlock, FAQBlock, GalleryBlock)
4. **Given** any CMS page, **When** page renders, **Then** breadcrumb shows Home > [Page Title]
5. **Given** slug that doesn't exist or page not published, **When** user visits, **Then** return 404 page
6. **Given** page has SEO meta fields, **When** page renders, **Then** generate proper `<title>`, `<meta description>`, and Open Graph tags

## Tasks / Subtasks

- [x] Task 1: Create catch-all route file structure (AC: #1)
  - [x] 1.1 Create `src/app/(frontend)/[locale]/[...slug]/page.tsx`
  - [x] 1.2 Define Props type with `params: Promise<{ locale: string; slug: string[] }>`
  - [x] 1.3 Join slug array to single string for query: `slug.join('/')`

- [x] Task 2: Implement page data fetching (AC: #1, #5)
  - [x] 2.1 Get Payload instance with `getPayload({ config: await config })`
  - [x] 2.2 Query Pages collection: `where: { slug: { equals: slugString } }`, `locale`, `depth: 2`
  - [x] 2.3 Check if page exists, call `notFound()` if not found
  - [x] 2.4 Extract page data from first doc

- [x] Task 3: Implement generateMetadata for SEO (AC: #6)
  - [x] 3.1 Query page by slug (same as page component)
  - [x] 3.2 Return title from `page.meta?.title || page.title`
  - [x] 3.3 Return description from `page.meta?.description`
  - [x] 3.4 Add Open Graph tags (og:title, og:description, og:image from featuredImage)
  - [x] 3.5 Add canonical URL

- [x] Task 4: Render page content (AC: #2, #3)
  - [x] 4.1 Import Breadcrumb component
  - [x] 4.2 Render Breadcrumb with page title
  - [x] 4.3 Render page title as H1
  - [x] 4.4 Render content field using RichTextContent component (if exists)
  - [x] 4.5 Render layout blocks using RenderBlocks component (if exists)

- [x] Task 5: Style page layout (AC: #2)
  - [x] 5.1 Use container pattern: `max-w-[var(--container-max)] mx-auto px-md`
  - [x] 5.2 Add proper spacing between sections
  - [x] 5.3 Ensure responsive layout

- [x] Task 6: Handle existing static page conflicts
  - [x] 6.1 Note: Next.js will prioritize specific routes over catch-all
  - [x] 6.2 Routes like `/contact`, `/search`, `/products`, `/services`, `/news` already have dedicated pages and will NOT hit catch-all
  - [x] 6.3 Only truly dynamic CMS pages will use this route (about, shipping, payment, warranty, faq, privacy, terms when created in CMS)

- [x] Task 7: Build and test (AC: all)
  - [x] 7.1 Run build to verify no TypeScript errors
  - [x] 7.2 Test with existing static pages still work (contact, services, etc.)
  - [x] 7.3 Test 404 handling for non-existent slugs
  - [x] 7.4 Test SEO meta generation

## Dev Notes

### Critical Implementation Guidance

**DO:**
- Create Server Component - no client-side interactivity needed
- Use `notFound()` from `next/navigation` for 404 handling
- Use existing `Breadcrumb` component from `@/components/ui/Breadcrumb`
- Use existing `RichTextContent` from `@/components/product/RichTextContent`
- Use existing `RenderBlocks` from `@/components/blocks/RenderBlocks`
- Follow existing page patterns from news detail or service detail pages
- Use `depth: 2` in query to populate images in layout blocks
- Handle both `content` (richText) and `layout` (blocks) fields - a page may have either or both

**DON'T:**
- Don't add 'use client' - this is a Server Component
- Don't create new block components - use existing from story 6.3
- Don't hardcode page content - everything comes from CMS
- Don't worry about route conflicts - Next.js handles priority (specific routes > catch-all)
- Don't add complex logic for nested slugs - Pages collection uses flat slugs (no nested pages)

### Architecture Compliance

**Data Fetching Pattern** (from [architecture.md:628-642](/_bmad-output/planning-artifacts/architecture.md#L628-L642)):

```typescript
import { getPayload } from 'payload'
import config from '@/payload.config'
import { notFound } from 'next/navigation'
import type { Locale } from '@/i18n/config'

export default async function DynamicPage({ params }: Props) {
  const { locale, slug } = await params
  const payload = await getPayload({ config: await config })

  // Join slug array to string (e.g., ['about'] -> 'about')
  const slugString = slug.join('/')

  // Query Pages collection - publishedOnly access handles draft filtering
  const { docs } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slugString } },
    limit: 1,
    locale: locale as Locale,
    depth: 2, // Populate images in layout blocks
  })

  const page = docs[0]

  if (!page) {
    notFound()
  }

  // Render page content...
}
```

### Page Type Definition

From [payload-types.ts:402-516](src/payload-types.ts#L402-L516):

```typescript
interface Page {
  id: number;
  title: string;
  slug: string;
  content?: { root: { ... } } | null; // Lexical richText
  layout?: (HeroBlock | ContentBlock | CTABlock | FAQBlock | GalleryBlock)[] | null;
  featuredImage?: (number | null) | Media;
  meta?: {
    title?: string | null;
    description?: string | null;
  };
  _status?: ('draft' | 'published') | null;
}
```

### Component Structure

```typescript
// src/app/(frontend)/[locale]/[...slug]/page.tsx
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import type { Metadata } from 'next'
import config from '@/payload.config'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { RenderBlocks } from '@/components/blocks/RenderBlocks'
import { RichTextContent } from '@/components/product/RichTextContent'
import type { Locale } from '@/i18n/config'

type Props = {
  params: Promise<{ locale: string; slug: string[] }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const slugString = slug.join('/')
  const payload = await getPayload({ config: await config })

  const { docs } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slugString } },
    limit: 1,
    locale: locale as Locale,
    depth: 1,
  })

  const page = docs[0]
  if (!page) {
    return { title: locale === 'vi' ? 'Không tìm thấy trang' : 'Page Not Found' }
  }

  // Extract og:image from featuredImage
  const imageUrl =
    typeof page.featuredImage === 'object' && page.featuredImage
      ? page.featuredImage.sizes?.large?.url ?? page.featuredImage.url
      : null

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://v-ies.com'

  return {
    title: `${page.meta?.title || page.title} | VIES`,
    description: page.meta?.description ?? undefined,
    openGraph: {
      title: page.meta?.title || page.title,
      description: page.meta?.description ?? undefined,
      images: imageUrl ? [{ url: imageUrl }] : undefined,
    },
    alternates: {
      canonical: `${siteUrl}/${locale}/${slugString}`,
    },
  }
}

export default async function DynamicPage({ params }: Props) {
  const { locale, slug } = await params
  const slugString = slug.join('/')
  const payload = await getPayload({ config: await config })

  const { docs } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slugString } },
    limit: 1,
    locale: locale as Locale,
    depth: 2, // Populate images in layout blocks
  })

  const page = docs[0]

  if (!page) {
    notFound()
  }

  return (
    <>
      {/* Breadcrumb: Home > [Page Title] */}
      <Breadcrumb
        items={[
          { label: page.title },
        ]}
      />

      {/* Page Title (only if no HeroBlock at start of layout) */}
      {(!page.layout?.length || page.layout[0].blockType !== 'hero') && (
        <section className="bg-white py-lg border-b border-border">
          <div className="mx-auto max-w-[var(--container-max)] px-md">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              {page.title}
            </h1>
          </div>
        </section>
      )}

      {/* Layout Blocks (if any) */}
      {page.layout && page.layout.length > 0 && (
        <RenderBlocks blocks={page.layout} locale={locale} />
      )}

      {/* Rich Text Content (if any, separate from blocks) */}
      {page.content && (
        <section className="py-xl bg-white">
          <div className="mx-auto max-w-[var(--container-max)] px-md">
            <RichTextContent
              data={page.content}
              className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-p:text-gray-600"
            />
          </div>
        </section>
      )}
    </>
  )
}
```

### Important: Route Priority

Next.js route matching priority (most specific to least specific):
1. Exact static routes: `/contact`, `/products`, `/services`, `/news`, `/search`
2. Dynamic segments: `/product/[slug]`, `/services/[slug]`, `/news/[slug]`
3. Catch-all: `/[...slug]`

This means existing static pages (`/contact/page.tsx`, `/services/page.tsx`, etc.) will **NOT** be affected by the catch-all route. Only routes that don't match any specific pattern will hit the catch-all.

### Existing Hardcoded Pages (will NOT use catch-all)

These pages already exist and will continue to work:
- `/about` - hardcoded at `[locale]/about/page.tsx`
- `/contact` - hardcoded at `[locale]/contact/page.tsx`
- `/faq` - hardcoded at `[locale]/faq/page.tsx`
- `/privacy` - hardcoded at `[locale]/privacy/page.tsx`
- `/terms` - hardcoded at `[locale]/terms/page.tsx`
- `/shipping` - hardcoded at `[locale]/shipping/page.tsx`
- `/payment` - hardcoded at `[locale]/payment/page.tsx`
- `/warranty` - hardcoded at `[locale]/warranty/page.tsx`

**Future consideration:** Once CMS pages are populated and tested, these hardcoded pages can be deleted to let the catch-all route handle them. But this is NOT required for this story - the catch-all just needs to work for any NEW pages created in CMS.

### Project Structure Notes

**Files to create:**
- `src/app/(frontend)/[locale]/[...slug]/page.tsx` - Dynamic page route

**Existing components to reuse:**
- `src/components/ui/Breadcrumb.tsx` - Breadcrumb navigation
- `src/components/blocks/RenderBlocks.tsx` - Block renderer
- `src/components/product/RichTextContent.tsx` - Rich text rendering

**Directory structure:**
```
src/app/(frontend)/[locale]/
├── [...slug]/
│   └── page.tsx          # NEW - Dynamic CMS pages
├── about/
│   └── page.tsx          # Existing hardcoded (can be removed later)
├── contact/
│   └── page.tsx          # Existing hardcoded (has custom logic, keep)
├── faq/
│   └── page.tsx          # Existing hardcoded (can be removed later)
├── ...
```

### Design Tokens

From [styles.css](src/app/(frontend)/styles.css):
- Container: `max-w-[var(--container-max)]` (1280px)
- Section padding: `py-xl` (32px)
- Content padding: `px-md` (16px)
- Border: `border-border`
- Typography: `text-gray-900` for headings, `text-gray-600` for body

### Previous Story Dependencies

**Story 6.3 (Block Components)** - ✅ COMPLETED (status: review)
- HeroBlock, ContentBlock, CTABlock, FAQBlock, GalleryBlock components
- RenderBlocks component that maps blockType to components
- All block components implemented and build passes

### Git Intelligence

Recent commits show:
- `220448f` - 6-1-news-listing-page review fixes
- `f074ec2` - 5-3-service-detail-page review fixes
- Similar patterns for data fetching, Breadcrumb usage, and Server Component rendering

### Test Scenarios

1. **Happy path**: Visit `/vi/test-page` where `test-page` exists in Pages collection → renders correctly
2. **404 handling**: Visit `/vi/non-existent-page` → returns 404
3. **Existing routes**: Visit `/vi/contact` → still shows contact page (not catch-all)
4. **SEO**: Check page source for correct meta tags
5. **Blocks rendering**: Create page with blocks in admin → blocks render correctly

### FR Coverage

This story covers:
- **PG-01 → PG-07**: Dynamic pages from Pages collection
- **AR-04**: Dynamic `[...slug]` routing for Pages collection

### i18n Considerations

- Page content is localized via PayloadCMS `locale` parameter in query
- Breadcrumb "Home" label comes from existing i18n keys
- No new i18n keys needed - all content from CMS

### References

- [epics.md:653-669](/_bmad-output/planning-artifacts/epics.md#L653-L669) - Story 6.4 requirements
- [architecture.md:243-265](/_bmad-output/planning-artifacts/architecture.md#L243-L265) - Pages collection schema
- [architecture.md:698-700](/_bmad-output/planning-artifacts/architecture.md#L698-L700) - Catch-all route placement
- [news/[slug]/page.tsx](src/app/(frontend)/[locale]/news/[slug]/page.tsx) - Reference for data fetching pattern
- [Breadcrumb.tsx](src/components/ui/Breadcrumb.tsx) - Breadcrumb component
- [RenderBlocks.tsx](src/components/blocks/RenderBlocks.tsx) - Block renderer
- [RichTextContent.tsx](src/components/product/RichTextContent.tsx) - Rich text component
- [Pages.ts](src/collections/Pages.ts) - Pages collection definition

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

N/A - Clean implementation with no debug issues.

### Completion Notes List

1. **Catch-all route created** - Implemented `[...slug]/page.tsx` that handles dynamic CMS pages from Pages collection
2. **Data fetching pattern** - Uses `getPayload()` with Pages collection query, `depth: 2` for block images, locale support
3. **SEO metadata** - `generateMetadata` returns title, description, Open Graph tags, and canonical URL from `page.meta` or fallback fields
4. **Content rendering** - Renders both `layout` blocks via `RenderBlocks` and `content` richText via `RichTextContent`
5. **Smart title display** - H1 title section hidden when page starts with HeroBlock to avoid duplication
6. **Breadcrumb** - Uses existing `Breadcrumb` component with page title
7. **404 handling** - Returns `notFound()` when page slug doesn't exist
8. **Route priority** - Next.js automatically handles priority (specific routes > catch-all), so existing static pages unaffected
9. **Build verified** - TypeScript compilation and build passed with new route registered at `/[locale]/[...slug]`

### Code Review Fixes Applied
- MEDIUM: Added `openGraph.type: 'website'` for proper social media type identification
- MEDIUM: Added Twitter Card meta tags (card, title, description, images) for Twitter/X rich previews
- LOW: Added `openGraph.url` with full page URL for complete OG tag implementation
- LOW: Refactored to use shared `pageUrl` variable for canonical and openGraph.url

### File List

- `src/app/(frontend)/[locale]/[...slug]/page.tsx` (created, updated) - Dynamic catch-all route for CMS pages

## Change Log

| Date | Change |
|------|--------|
| 2026-02-05 | Story 6.4 implemented - Dynamic catch-all route for CMS pages with SEO, blocks, and richText support |
| 2026-02-05 | Code review fixes - Added openGraph.type, openGraph.url, and Twitter Card meta tags |
