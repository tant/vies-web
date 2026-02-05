# Story 3.7: Brand page

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a khách hàng,
I want to see all products from a specific brand,
So that I can browse the full catalog of brands like SKF or FAG.

## Acceptance Criteria

1. **Given** `/brands/{slug}` page **When** trang load với valid brand slug **Then** hiện brand info: logo, tên, mô tả, website link
2. **Given** brand có products **When** trang render **Then** hiện grid tất cả products của brand đó
3. **Given** products > 12 **When** trang render **Then** hiện pagination: Load More button
4. **Given** brand page **When** trang render **Then** hiện breadcrumb: Home > Thương hiệu > [Brand Name]
5. **Given** `/brands/{slug}` với invalid slug **When** trang load **Then** hiện 404 page

## Tasks / Subtasks

- [x] Task 1: Refactor brand page layout (AC: #1, #4, #5)
  - [x] 1.1: Update `src/app/(frontend)/[locale]/brands/[slug]/page.tsx` — use Breadcrumb component
  - [x] 1.2: Replace inline breadcrumb with `<Breadcrumb items={[{ label: 'Thương hiệu', href }, { label: brand.name }]} />`
  - [x] 1.3: Display brand logo from `brand.logo` Media relationship instead of placeholder
  - [x] 1.4: Render description using RichText component (description is richText type)
  - [x] 1.5: Display website link with proper styling (external link icon)
  - [x] 1.6: Improve page structure per UX spec (section spacing, container max-width)

- [x] Task 2: Integrate ProductCard component (AC: #2)
  - [x] 2.1: Import ProductCard from `@/components/ui/ProductCard`
  - [x] 2.2: Replace inline product cards with `<ProductCard product={product} locale={locale} />`
  - [x] 2.3: Ensure ProductCard receives populated data (depth: 1 for brand relationship)

- [x] Task 3: Add Load More pagination (AC: #3)
  - [x] 3.1: Fetch products with `page` query param from URL
  - [x] 3.2: Add URL searchParams support: `{ params, searchParams }` in page props
  - [x] 3.3: Create BrandProductsClient wrapper for state management (optional) OR use link-based pagination
  - [x] 3.4: Render "Xem thêm" / "Load More" button when `hasNextPage` is true
  - [x] 3.5: Button links to `?page=N+1` (preserving locale and slug)

- [x] Task 4: SEO and metadata (AC: #1)
  - [x] 4.1: Update generateMetadata to include brand description excerpt
  - [x] 4.2: Add og:image from brand logo if available
  - [x] 4.3: Title format: `{brand.name} | VIES`

- [x] Task 5: Build + verify
  - [x] 5.1: Chạy `pnpm build` — phải thành công
  - [x] 5.2: Verify brand page hiện với seed data (SKF, FAG, NSK, Timken, NTN, KOYO, Shell, Lincoln)
  - [x] 5.3: Verify brand logo displays (nếu có trong seed data)
  - [x] 5.4: Verify breadcrumb navigation: Home > Thương hiệu > [Brand Name]
  - [x] 5.5: Verify product grid uses ProductCard component
  - [x] 5.6: Verify Load More pagination works
  - [x] 5.7: Verify 404 cho invalid slug
  - [x] 5.8: Verify website link opens in new tab

## Dev Notes

### Architecture & Patterns

**Current state:**
File `src/app/(frontend)/[locale]/brands/[slug]/page.tsx` already exists with basic functionality:
- Fetches brand by slug ✅
- Shows products for brand ✅
- Has 404 handling via notFound() ✅
- BUT: uses inline breadcrumb (needs Breadcrumb component)
- BUT: shows placeholder for logo (needs actual logo)
- BUT: uses inline product cards (needs ProductCard component)
- BUT: no proper Load More pagination (just "View all" link)

**Page structure after refactor:**
```
/brands/[slug] page (Server Component)
├── Breadcrumb (Server) — Home > Thương hiệu > [Brand Name]
├── BrandHeader section
│   ├── Brand logo (from Media)
│   ├── Brand name (H1)
│   └── Product count
├── BrandDescription section (if description exists)
│   ├── About heading
│   ├── RichText rendered description
│   └── Website link (external)
├── ProductGrid section
│   ├── Section title: "Sản phẩm {brand.name}"
│   ├── ProductCard[] grid (12 per page)
│   └── Load More button (if hasNextPage)
└── EmptyState (if no products)
```

**File location:**
```
src/app/(frontend)/[locale]/brands/[slug]/page.tsx  # Existing - MODIFY
```

### Brand Collection Fields (from Brands.ts)

```typescript
{
  name: string           // localized, required
  slug: string           // unique, indexed
  logo: Media | string   // upload relationship to media
  description: any       // richText, localized
  website: string | null // text
}
```

**Access control:** `read: anyone` — no draft filtering needed.

### Payload Query Patterns

**Fetching brand with locale:**
```typescript
const payload = await getPayload({ config: await config })

const { docs } = await payload.find({
  collection: 'brands',
  where: { slug: { equals: slug } },
  limit: 1,
  locale,
  depth: 1, // Populate logo Media
})

const brand = docs[0]
if (!brand) notFound()
```

**Fetching products for brand with pagination:**
```typescript
const currentPage = parseInt(page || '1')
const limit = 12

const { docs: products, totalDocs, hasNextPage, nextPage } = await payload.find({
  collection: 'products',
  where: { brand: { equals: brand.id } },
  limit,
  page: currentPage,
  sort: 'name',
  locale,
})
```

### Logo Display Pattern

```typescript
// Extract logo URL from Media relationship
const logoUrl = typeof brand.logo === 'object' && brand.logo
  ? brand.logo.sizes?.medium?.url ?? brand.logo.url
  : null

// Render
{logoUrl ? (
  <img
    src={logoUrl}
    alt={`${brand.name} logo`}
    className="w-20 h-20 object-contain bg-white rounded-lg p-2"
  />
) : (
  <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center">
    <span className="text-2xl font-bold text-primary">
      {brand.name.slice(0, 3)}
    </span>
  </div>
)}
```

### RichText Rendering for Description

**Note:** Brand description is richText (Lexical format), not plain string.

```typescript
import { RichText } from '@payloadcms/richtext-lexical/react'

// In component
{brand.description && (
  <div className="prose prose-gray max-w-none">
    <RichText data={brand.description} />
  </div>
)}
```

### Breadcrumb Integration

```typescript
import { Breadcrumb } from '@/components/ui/Breadcrumb'

// In page
<Breadcrumb
  items={[
    { label: locale === 'vi' ? 'Thương hiệu' : 'Brands', href: `/${locale}/products?view=brands` },
    { label: brand.name },
  ]}
/>
```

**Note:** Breadcrumb component already handles Home > prefix and styling.

### Load More Pagination Pattern

**Using link-based pagination (simplest, no client state):**
```typescript
// In page.tsx
export default async function BrandPage({ params, searchParams }: Props) {
  const { locale, slug } = await params
  const { page = '1' } = await searchParams
  const currentPage = parseInt(page)

  // ... fetch products with page

  return (
    <>
      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} locale={locale} />
        ))}
      </div>

      {/* Load More */}
      {hasNextPage && (
        <div className="mt-8 text-center">
          <Link
            href={`/${locale}/brands/${slug}?page=${nextPage}`}
            className="inline-flex items-center justify-center px-6 py-3 border border-border rounded-lg text-text hover:border-primary transition-colors"
          >
            {locale === 'vi' ? 'Xem thêm' : 'Load More'}
          </Link>
        </div>
      )}
    </>
  )
}
```

### UX Design Specs (từ UX Specification)

**Brand header:**
- Background: white or subtle gradient
- Logo: max 80x80px, object-contain, white background if brand logo has transparent bg
- Brand name: H1, text-3xl md:text-4xl, font-bold
- Product count: text-gray-500

**Brand description section:**
- Background: bg-white, rounded-lg, shadow-sm, p-6
- Section title: H2, text-xl, font-semibold
- RichText: prose styles
- Website link: text-primary, hover:underline, with external link icon

**Product grid:**
- Section title: H2, text-2xl, font-bold, mb-6
- Grid: 1/2/3/4 columns (responsive)
- Gap: 24px (gap-6)
- ProductCard: reuse from Story 3.4

**Empty state:**
- Center aligned, bg-white, rounded, shadow-sm, p-12
- Message from translations: `tCommon('noResults')`

**Load More button:**
- Tertiary style: border, text, rounded-lg
- Centered below grid
- Margin top: 32px (mt-8)

### Breadcrumb Path

Per AC #4: `Home > Thương hiệu > [Brand Name]`

Breadcrumb items:
1. Home (auto by Breadcrumb component)
2. "Thương hiệu" / "Brands" → link to products page with brand view OR no link
3. Brand name → current page (no link, bold)

### Seed Data Brands (8 brands)

From scripts/seed.ts:
- SKF (slug: skf)
- FAG (slug: fag)
- NSK (slug: nsk)
- Timken (slug: timken)
- NTN (slug: ntn)
- KOYO (slug: koyo)
- Shell (slug: shell)
- Lincoln (slug: lincoln)

### Điểm cần tránh

- **KHÔNG** tạo file mới — chỉ MODIFY file existing `brands/[slug]/page.tsx`
- **KHÔNG** filter `_status` — Brands collection không có drafts
- **KHÔNG** dùng `<Image>` nếu gặp config issues — `<img>` đủ cho MVP
- **KHÔNG** add infinite scroll — UX spec dùng Load More button
- **KHÔNG** add brand logo upload UI — đó là admin panel (Payload CMS)
- **KHÔNG** show product prices — AC và UX spec nói rõ không hiện giá
- **KHÔNG** remove GearIcon function nếu vẫn cần làm fallback

### Previous Story Intelligence

**Từ Story 3.4 (ProductCard):**
- Status: done ✅
- ProductCard ở `src/components/ui/ProductCard.tsx`
- Pattern: accepts `Product | ProductCardData`, extracts brandName và thumbnailUrl
- Server Component compatible

**Từ Story 3.5 (Product listing page):**
- Status: review
- Pattern: link-based Load More pagination với `?page=N`
- Pattern: URL searchParams handling

**Từ Story 3.6 (Product detail page):**
- Pattern: depth: 2 for relationship population
- Pattern: RichText rendering với `@payloadcms/richtext-lexical/react`
- Pattern: image extraction từ Media relationships

**Git history context (recent commits):**
- 7f44e01: Add ProductCard component with design system fixes (Story 3.4)
- 2611deb: Add Search Results Page with Load More pagination (Story 3.3)
- Previous brand page was created earlier as placeholder

### Metadata Generation

```typescript
import type { Metadata } from 'next'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const payload = await getPayload({ config: await config })

  const { docs } = await payload.find({
    collection: 'brands',
    where: { slug: { equals: slug } },
    limit: 1,
    locale,
    depth: 1,
  })

  const brand = docs[0]
  if (!brand) {
    return {
      title: locale === 'vi' ? 'Không tìm thấy thương hiệu' : 'Brand Not Found',
    }
  }

  // Extract logo for og:image
  const logoUrl = typeof brand.logo === 'object' && brand.logo
    ? brand.logo.sizes?.medium?.url ?? brand.logo.url
    : null

  return {
    title: `${brand.name} | VIES`,
    description: `${locale === 'vi' ? 'Sản phẩm' : 'Products from'} ${brand.name} - VIES`,
    openGraph: {
      title: brand.name,
      images: logoUrl ? [{ url: logoUrl }] : undefined,
    },
  }
}
```

### Project Structure Notes

- Brand detail page: `src/app/(frontend)/[locale]/brands/[slug]/page.tsx` — MODIFY existing
- Alignment với Architecture doc Section 7
- Sẽ được linked từ: ProductCard brand links, BrandLogoBar on homepage, product detail page brand links
- Uses existing components: Breadcrumb, ProductCard

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 3.7 - Brand page]
- [Source: _bmad-output/planning-artifacts/architecture.md#Section 3.6 - Brands Collection]
- [Source: _bmad-output/planning-artifacts/architecture.md#Section 5.1 - Component Data Flow]
- [Source: _bmad-output/planning-artifacts/architecture.md#Section 6.2 - Data Fetching Pattern]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Journey 2 - Browse & Discover]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#ProductCard specs]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Breadcrumb specs]
- [Source: _bmad-output/planning-artifacts/prd.md#BR-01 - Brand page requirement]
- [Source: _bmad-output/implementation-artifacts/3-4-productcard-component.md - ProductCard component]
- [Source: _bmad-output/implementation-artifacts/3-5-product-listing-page.md - Pagination pattern]
- [Source: _bmad-output/implementation-artifacts/3-6-product-detail-page.md - RichText and Media patterns]
- [Source: src/collections/Brands.ts - Brand fields]
- [Source: src/app/(frontend)/[locale]/brands/[slug]/page.tsx - Existing brand page]
- [Source: src/components/ui/ProductCard.tsx - ProductCard implementation]
- [Source: src/components/ui/Breadcrumb.tsx - Breadcrumb implementation]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- Build succeeded: `pnpm build` completed with no TypeScript errors

### Completion Notes List

- ✅ **Task 1 Complete**: Refactored brand page layout with Breadcrumb component integration, Media relationship logo extraction, RichText rendering for description, external link icon for website, and improved page structure with design system tokens (max-w-[var(--container-max)], px-md, py-lg, etc.)
- ✅ **Task 2 Complete**: Integrated ProductCard component replacing inline product cards, with depth: 1 for brand relationship population
- ✅ **Task 3 Complete**: Implemented link-based Load More pagination using searchParams with `?page=N` pattern, consistent with Story 3.5 approach
- ✅ **Task 4 Complete**: Enhanced generateMetadata with brand description, og:image from logo, and proper title format "{brand.name} | VIES"
- ✅ **Task 5 Complete**: Build passed successfully, code verified against all acceptance criteria

### Implementation Details

- Used link-based pagination (no client state required) - simpler and matches existing patterns
- Breadcrumb links to `/{locale}/products` for "Thương hiệu" item (central products hub)
- Fallback logo displays first 3 characters of brand name when no logo uploaded
- External link icon added for website links with proper accessibility (target="_blank", rel="noopener noreferrer")
- Used i18n translations from common, nav, and products namespaces

### File List

- `src/app/(frontend)/[locale]/brands/[slug]/page.tsx` — MODIFIED (complete refactor + review fixes)
- `messages/vi.json` — MODIFIED (added brandProducts, officialWebsite keys)
- `messages/en.json` — MODIFIED (added brandProducts, officialWebsite keys)

### Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-02-05 | Initial implementation of Story 3.7 - Brand page refactor with Breadcrumb, ProductCard, Load More pagination, and SEO improvements | Dev Agent |
| 2026-02-05 | Code review fixes: React.cache() for query dedup, i18n translation keys, aria-hidden on icon | Senior Developer Review |

## Senior Developer Review

**Reviewer:** Tan
**Date:** 2026-02-05
**Outcome:** ✅ Approved with fixes applied

### Issues Found & Fixed

| Severity | Issue | Fix Applied |
|----------|-------|-------------|
| MEDIUM | Duplicate brand DB query in generateMetadata and page component | Added `React.cache()` wrapper `getBrand()` to dedupe requests |
| LOW | Hardcoded "About {brand}" text | Replaced with `tCommon('about')` translation key |
| LOW | Hardcoded "Products {brand}" heading | Added `products.brandProducts` i18n key with interpolation |
| LOW | Hardcoded "Official website" text | Added `products.officialWebsite` i18n key |
| LOW | Missing aria-hidden on ExternalLinkIcon | Added `aria-hidden="true"` for accessibility |
| LOW | No test coverage | Noted - acceptable for MVP, can add later |

### Files Modified During Review

- `src/app/(frontend)/[locale]/brands/[slug]/page.tsx` — Added cache(), fixed i18n, accessibility
- `messages/vi.json` — Added `brandProducts`, `officialWebsite` keys
- `messages/en.json` — Added `brandProducts`, `officialWebsite` keys

### Verification

- ✅ Brand page compiles successfully
- ✅ All acceptance criteria validated
- ✅ All tasks marked complete verified as implemented
