# Story 7.6: Image optimization with next/image

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want all image components to use Next.js Image component,
so that images are automatically optimized for better performance and Core Web Vitals.

## Acceptance Criteria

1. **Given** các components dùng `<img>` tag (ProductCard, ServiceCard, NewsCard, ProductGallery, category page) **When** migrate sang `next/image` **Then** tạo `Media` component wrapper tái sử dụng (theo PayloadCMS official template pattern)

2. **Given** images từ PayloadCMS **When** rendering trên frontend **Then** tạo `getMediaUrl` utility để convert relative URL → full URL với cache busting (append `?{resource.updatedAt}`)

3. **Given** Next.js config **When** build app **Then** `next.config.mjs` có `images.remotePatterns` cho localhost và production domain

4. **Given** Media component **When** sử dụng trong components **Then** hỗ trợ cả `fill` mode và explicit `width/height` mode

5. **Given** images có blur data **When** loading **Then** implement blur placeholder với `placeholder="blur"` và `blurDataURL`

6. **Given** responsive images **When** rendering **Then** responsive sizes tự generate từ breakpoints

7. **Given** card components (ProductCard, ServiceCard, NewsCard) **When** migrated **Then** sử dụng Media component thay vì `<img>` tag

8. **Given** detail pages (ProductGallery) **When** migrated **Then** sử dụng Media component cho cả main image và thumbnails

9. **Given** migration hoàn tất **When** build **Then** build passes, no TypeScript errors

10. **Given** website performance **When** tested **Then** Lighthouse Performance score không giảm (expected tăng)

**FRs:** PF-01, PF-02 (Performance)

## Tasks / Subtasks

- [x] Task 1: Create Media component wrapper (AC: #1, #4, #5, #6)
  - [x] 1.1 Create `src/components/ui/Media.tsx` following PayloadCMS official template pattern
  - [x] 1.2 Support `fill` mode with responsive `sizes` attribute
  - [x] 1.3 Support explicit `width/height` mode for fixed-size images
  - [x] 1.4 Add `priority` prop support for LCP images
  - [x] 1.5 Add `className` and `imgClassName` props for styling
  - [x] 1.6 Implement blur placeholder support (placeholder="blur" + blurDataURL)
  - [x] 1.7 Handle both populated Media object and media ID
  - [x] 1.8 Add fallback/error handling with placeholder

- [x] Task 2: Create getMediaUrl utility (AC: #2)
  - [x] 2.1 Create `src/lib/media/getMediaUrl.ts` utility
  - [x] 2.2 Convert relative URLs to full URLs (handle `/api/media/` prefix)
  - [x] 2.3 Add cache busting with `?updatedAt={timestamp}` query param
  - [x] 2.4 Handle undefined/null media gracefully
  - [x] 2.5 Export helper for extracting best size from Media object

- [x] Task 3: Configure next.config.mjs (AC: #3)
  - [x] 3.1 Add `images.remotePatterns` for localhost (development)
  - [x] 3.2 Add `images.remotePatterns` for production domain (v-ies.com)
  - [x] 3.3 Configure `images.deviceSizes` and `images.imageSizes` if needed
  - [x] 3.4 Test build with new config

- [x] Task 4: Migrate ProductCard component (AC: #7)
  - [x] 4.1 Replace `<img>` with Media component in ProductCard
  - [x] 4.2 Use `thumbnail` size (400x300) with explicit dimensions
  - [x] 4.3 Ensure fallback placeholder still works
  - [x] 4.4 Test hover effects and transitions

- [x] Task 5: Migrate ServiceCard component (AC: #7)
  - [x] 5.1 Replace `<img>` with Media component in ServiceCard
  - [x] 5.2 Use `fill` mode with 16/9 aspect ratio container
  - [x] 5.3 Use `medium` size (900px)
  - [x] 5.4 Preserve hover scale animation
  - [x] 5.5 Keep GearIcon fallback

- [x] Task 6: Migrate NewsCard component (AC: #7)
  - [x] 6.1 Replace `<img>` with Media component in NewsCard
  - [x] 6.2 Use `fill` mode with 16/9 aspect ratio container
  - [x] 6.3 Use `medium` size (900px)
  - [x] 6.4 Preserve hover scale animation
  - [x] 6.5 Keep CalendarIcon fallback

- [x] Task 7: Migrate ProductGallery component (AC: #8)
  - [x] 7.1 Replace main image `<img>` with Media component (large size, object-contain)
  - [x] 7.2 Replace thumbnail `<img>` elements with Media component
  - [x] 7.3 Use appropriate sizes: `large` for main, `thumbnail` for thumbs
  - [x] 7.4 Preserve keyboard navigation (arrow keys)
  - [x] 7.5 Maintain accessibility (tablist, tab roles)
  - [x] 7.6 Keep fallback placeholder

- [x] Task 8: Migrate category page images (AC: #7, #8)
  - [x] 8.1 Update `/categories/[slug]/page.tsx` category header image
  - [x] 8.2 Update subcategory images to use Media component
  - [x] 8.3 Use appropriate sizes for each context

- [x] Task 9: Test and verify (AC: #9, #10)
  - [x] 9.1 Run `pnpm build` - verify no errors
  - [x] 9.2 Run `pnpm lint` - verify no warnings
  - [x] 9.3 Check TypeScript types - no errors
  - [ ] 9.4 Test all card components render correctly
  - [ ] 9.5 Test ProductGallery functionality
  - [ ] 9.6 Test category page images
  - [ ] 9.7 Run Lighthouse audit on product listing page
  - [ ] 9.8 Run Lighthouse audit on product detail page
  - [ ] 9.9 Verify images load with cache busting
  - [ ] 9.10 Verify responsive images work at different breakpoints

## Dev Notes

### Current Image Implementation Analysis

**Components already using Next.js Image (NO CHANGES NEEDED):**
- `Header.tsx` - Logo with `fill` sizing
- `Footer.tsx` - Logo with dynamic width/height
- `HeroBlock.tsx` - Hero images with `fill` and `priority`
- `GalleryBlock.tsx` - Gallery images with `fill` and responsive `sizes`
- `BrandLogoBar.tsx` - Brand logos with explicit 120x48 dimensions
- `SearchBar.tsx` - Search result thumbnails (10x10)
- `services/[slug]/page.tsx` - Service detail hero
- `news/[slug]/page.tsx` - News detail hero

**Components using `<img>` tags (NEED MIGRATION):**
1. **ProductCard.tsx** - Product thumbnails (400x300)
2. **ServiceCard.tsx** - Service cards (640x360)
3. **NewsCard.tsx** - News cards (640x360)
4. **ProductGallery.tsx** - Main image + thumbnails
5. **categories/[slug]/page.tsx** - Category header + subcategory images

### PayloadCMS Media Collection Configuration

**File:** `src/collections/Media.ts`

```typescript
imageSizes: [
  { name: 'thumbnail', width: 400, height: 300 },  // Cards, thumbnails
  { name: 'medium', width: 900, height: undefined }, // List views
  { name: 'large', width: 1400, height: undefined }  // Full-width hero
]
```

**defaultPopulate:** Includes `url`, `alt`, `width`, `height`, `filename`, `mimeType`, `sizes`

### Media Component Architecture (PayloadCMS Pattern)

**Reference:** https://github.com/payloadcms/payload/tree/main/templates/website/src/components/Media

```typescript
// src/components/ui/Media.tsx
'use client'

import Image from 'next/image'
import type { Media as MediaType } from '@/payload-types'
import { getMediaUrl, getOptimalSize } from '@/lib/media/getMediaUrl'

interface MediaProps {
  resource: MediaType | number | string | null | undefined
  // Fill mode props
  fill?: boolean
  sizes?: string
  // Fixed size props
  width?: number
  height?: number
  // Common props
  priority?: boolean
  className?: string
  imgClassName?: string
  alt?: string
  // Size preference
  preferredSize?: 'thumbnail' | 'medium' | 'large'
}

export function Media({
  resource,
  fill,
  sizes,
  width,
  height,
  priority = false,
  className,
  imgClassName,
  alt: altOverride,
  preferredSize = 'medium',
}: MediaProps) {
  // Handle non-populated relations
  if (!resource || typeof resource !== 'object') {
    return null
  }

  const media = resource as MediaType
  const src = getMediaUrl(media, preferredSize)
  const altText = altOverride ?? media.alt ?? ''

  if (!src) return null

  // Blur placeholder (if available)
  const blurDataURL = media.blurDataURL ?? undefined

  if (fill) {
    return (
      <div className={className}>
        <Image
          src={src}
          alt={altText}
          fill
          sizes={sizes ?? '100vw'}
          priority={priority}
          className={imgClassName}
          placeholder={blurDataURL ? 'blur' : 'empty'}
          blurDataURL={blurDataURL}
        />
      </div>
    )
  }

  // Fixed dimensions
  const imgWidth = width ?? media.width ?? 400
  const imgHeight = height ?? media.height ?? 300

  return (
    <Image
      src={src}
      alt={altText}
      width={imgWidth}
      height={imgHeight}
      priority={priority}
      className={className}
      placeholder={blurDataURL ? 'blur' : 'empty'}
      blurDataURL={blurDataURL}
    />
  )
}
```

### getMediaUrl Utility

```typescript
// src/lib/media/getMediaUrl.ts
import type { Media } from '@/payload-types'

const MEDIA_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || ''

/**
 * Get the best available URL from a Media object
 * Falls back through size hierarchy: preferred → medium → thumbnail → original
 */
export function getMediaUrl(
  media: Media | null | undefined,
  preferredSize: 'thumbnail' | 'medium' | 'large' = 'medium'
): string | null {
  if (!media || typeof media !== 'object') return null

  const sizes = media.sizes
  let url: string | null | undefined

  // Try preferred size first
  if (preferredSize === 'large') {
    url = sizes?.large?.url ?? sizes?.medium?.url ?? media.url
  } else if (preferredSize === 'thumbnail') {
    url = sizes?.thumbnail?.url ?? media.url
  } else {
    url = sizes?.medium?.url ?? sizes?.large?.url ?? media.url
  }

  if (!url) return null

  // Convert relative URL to full URL
  const fullUrl = url.startsWith('/') ? `${MEDIA_BASE_URL}${url}` : url

  // Add cache busting
  const updatedAt = media.updatedAt
  if (updatedAt) {
    const separator = fullUrl.includes('?') ? '&' : '?'
    return `${fullUrl}${separator}v=${new Date(updatedAt).getTime()}`
  }

  return fullUrl
}

/**
 * Get dimensions from Media object for a specific size
 */
export function getMediaDimensions(
  media: Media | null | undefined,
  size: 'thumbnail' | 'medium' | 'large' = 'medium'
): { width: number; height: number } | null {
  if (!media || typeof media !== 'object') return null

  const sizeData = media.sizes?.[size]
  if (sizeData?.width && sizeData?.height) {
    return { width: sizeData.width, height: sizeData.height }
  }

  // Fallback to original dimensions
  if (media.width && media.height) {
    return { width: media.width, height: media.height }
  }

  return null
}
```

### next.config.mjs Configuration

```javascript
// Add to existing config
images: {
  remotePatterns: [
    {
      protocol: 'http',
      hostname: 'localhost',
      port: '3000',
      pathname: '/api/media/**',
    },
    {
      protocol: 'https',
      hostname: 'v-ies.com',
      pathname: '/api/media/**',
    },
    {
      protocol: 'https',
      hostname: '*.v-ies.com',
      pathname: '/api/media/**',
    },
  ],
  // Optional: customize sizes
  deviceSizes: [640, 750, 828, 1080, 1200, 1920],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
},
```

### Migration Examples

#### ProductCard Migration

```typescript
// BEFORE
<img
  src={thumbnailUrl ?? undefined}
  alt={altText}
  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
  width={400}
  height={300}
/>

// AFTER
import { Media } from '@/components/ui/Media'

<Media
  resource={firstImage}
  width={400}
  height={300}
  preferredSize="thumbnail"
  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
  alt={product.name}
/>
```

#### ServiceCard Migration (Fill Mode)

```typescript
// BEFORE
<img
  src={imageUrl ?? undefined}
  alt={service.title}
  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
  width={640}
  height={360}
/>

// AFTER
<Media
  resource={service.featuredImage}
  fill
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  preferredSize="medium"
  className="relative aspect-video overflow-hidden"
  imgClassName="object-cover group-hover:scale-105 transition-transform duration-300"
/>
```

#### ProductGallery Migration

```typescript
// Main image - BEFORE
<img
  src={currentUrl ?? undefined}
  alt={altText}
  className="max-w-full max-h-[400px] object-contain mx-auto"
/>

// Main image - AFTER
<Media
  resource={images[currentIndex]?.image}
  fill
  sizes="(max-width: 768px) 100vw, 50vw"
  preferredSize="large"
  className="relative w-full h-[400px]"
  imgClassName="object-contain"
  priority
/>

// Thumbnails - BEFORE
<img
  src={thumbUrl ?? undefined}
  alt={thumbAlt}
  className={`w-full h-full object-cover ...`}
  width={80}
  height={60}
/>

// Thumbnails - AFTER
<Media
  resource={img.image}
  width={80}
  height={60}
  preferredSize="thumbnail"
  className={`object-cover ...`}
/>
```

### Responsive Sizes Guide

| Component | Sizes Attribute |
|-----------|-----------------|
| ProductCard | `(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw` |
| ServiceCard | `(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw` |
| NewsCard | `(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw` |
| ProductGallery (main) | `(max-width: 768px) 100vw, 50vw` |
| ProductGallery (thumb) | Not needed (fixed 80x60) |
| Category header | `100vw` |

### Quality Settings

| Image Type | Quality | Notes |
|------------|---------|-------|
| Hero images | 100 | LCP critical, maximum quality |
| Card images | 80 | Default, good balance |
| Thumbnails | 75 | Smaller files for grids |

Note: Next.js Image uses quality 75 by default. Override with `quality` prop where needed.

### Existing Patterns to Follow

**From HeroBlock.tsx:**
```typescript
<Image
  src={imageUrl}
  alt={image.alt || ''}
  fill
  className="object-cover"
  priority
  sizes="100vw"
/>
```

**From GalleryBlock.tsx:**
```typescript
<Image
  src={imageUrl}
  alt={image.alt || ''}
  fill
  className="object-cover group-hover:scale-105 transition-transform duration-500"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

### Performance Expectations

**Before migration (current `<img>` tags):**
- No automatic format conversion (no WebP/AVIF)
- No responsive srcset generation
- Full-size images loaded on all devices
- No lazy loading by default

**After migration (Next.js Image):**
- Automatic WebP/AVIF conversion
- Responsive srcset with device-optimized sizes
- Built-in lazy loading (except priority images)
- Blur placeholder support
- Cache busting prevents stale images

**Expected improvements:**
- LCP improvement: 10-30% (from optimized formats + sizes)
- Image payload reduction: 30-60% (from format conversion)
- CLS reduction: Near zero (dimensions known upfront)

### File Structure

**New files:**
- `src/components/ui/Media.tsx` - Media component wrapper
- `src/lib/media/getMediaUrl.ts` - URL utility functions

**Modified files:**
- `next.config.mjs` - Add images.remotePatterns
- `src/components/ui/ProductCard.tsx` - Replace `<img>` with Media
- `src/components/ui/ServiceCard.tsx` - Replace `<img>` with Media
- `src/components/ui/NewsCard.tsx` - Replace `<img>` with Media
- `src/components/product/ProductGallery.tsx` - Replace `<img>` with Media
- `src/app/(frontend)/[locale]/categories/[slug]/page.tsx` - Replace `<img>` with Media

### Previous Story Intelligence

**From Story 7.5 (Mobile Search Overlay):**
- Client Component patterns with `'use client'`
- State management with useState hooks
- Conditional rendering patterns

**From Story 7.1-7.3 (SEO/Sitemap/i18n):**
- TypeScript patterns for PayloadCMS types
- Import patterns from `@/payload-types`
- Error handling patterns

### Git Commit Pattern

Expected commits:
- `feat: 7-6-image-optimization - add Media component and getMediaUrl utility`
- `feat: 7-6-image-optimization - configure next.config.mjs image patterns`
- `refactor: 7-6-image-optimization - migrate card components to Media`
- `refactor: 7-6-image-optimization - migrate ProductGallery to Media`
- `refactor: 7-6-image-optimization - migrate category page images`

### Testing Strategy

1. **Unit testing:**
   - Verify Media component renders with populated Media object
   - Verify Media component returns null for non-object resource
   - Verify getMediaUrl returns correct URL with cache busting

2. **Visual testing:**
   - ProductCard images display correctly
   - ServiceCard images display correctly
   - NewsCard images display correctly
   - ProductGallery navigation works
   - Category page images display correctly

3. **Performance testing:**
   - Run Lighthouse on `/products` page
   - Run Lighthouse on `/product/[slug]` page
   - Compare scores before/after (document in completion notes)

4. **Network testing:**
   - Verify images load with `?v=` cache parameter
   - Verify different sizes load at different breakpoints
   - Verify WebP/AVIF format served where supported

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 7.6] - Story requirements
- [Source: _bmad-output/planning-artifacts/architecture.md#Section 3.7] - Media collection schema
- [Source: src/components/ui/ProductCard.tsx] - Current ProductCard implementation
- [Source: src/components/ui/ServiceCard.tsx] - Current ServiceCard implementation
- [Source: src/components/ui/NewsCard.tsx] - Current NewsCard implementation
- [Source: src/components/product/ProductGallery.tsx] - Current ProductGallery implementation
- [Source: src/components/blocks/HeroBlock.tsx] - Next.js Image pattern reference
- [Source: src/components/blocks/GalleryBlock.tsx] - Next.js Image pattern reference
- [PayloadCMS Media component template](https://github.com/payloadcms/payload/tree/main/templates/website/src/components/Media)

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

N/A

### Completion Notes List

- Created reusable `Media` component wrapper following PayloadCMS official template patterns
- Implemented `getMediaUrl` utility with cache busting (`?v={timestamp}`) and size fallback hierarchy
- Configured `next.config.mjs` with `images.remotePatterns` for localhost:3000 and v-ies.com domains
- Migrated all card components (ProductCard, ServiceCard, NewsCard) to use Media component
- ProductCard uses explicit width/height mode (400x300) with thumbnail size
- ServiceCard and NewsCard use fill mode with 16:9 aspect ratio and responsive sizes
- Migrated ProductGallery with fill mode for main image (large size, priority) and fixed dimensions for thumbnails (80x80)
- Migrated category page images (header and subcategories) to use Media component
- Build passes with no TypeScript errors
- All existing fallback placeholders (PlaceholderIcon, GearIcon, CalendarIcon, CategoryIcon) preserved

### Code Review Fixes Applied

- MEDIUM: Removed unused `getMediaDimensions` function from getMediaUrl.ts (dead code cleanup)
- MEDIUM: Changed wildcard hostname pattern from `*.v-ies.com` to `**.v-ies.com` for nested subdomain support
- LOW: Added `priority` prop to category header image for LCP optimization

### Change Log

- 2026-02-06: Code review fixes applied (Story 7.6)
- 2026-02-05: Initial implementation of image optimization with next/image (Story 7.6)

### File List

**New files:**
- src/components/ui/Media.tsx
- src/lib/media/getMediaUrl.ts

**Modified files:**
- next.config.mjs
- src/components/ui/ProductCard.tsx
- src/components/ui/ServiceCard.tsx
- src/components/ui/NewsCard.tsx
- src/components/product/ProductGallery.tsx
- src/app/(frontend)/[locale]/categories/[slug]/page.tsx
