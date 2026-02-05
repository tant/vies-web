# Story 3.8: Category page

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a khách hàng,
I want to see all products in a specific category,
So that I can browse products by type (bearings, lubricants, etc.).

## Acceptance Criteria

1. **Given** `/categories/{slug}` page **When** trang load với valid category slug **Then** hiện category info: tên, mô tả, ảnh
2. **Given** category có subcategories **When** trang render **Then** hiện subcategories grid (parent-child 1 cấp)
3. **Given** category có products **When** trang render **Then** hiện grid tất cả products thuộc category đó
4. **Given** products > 12 **When** trang render **Then** hiện pagination: Load More button
5. **Given** category page **When** trang render **Then** hiện breadcrumb: Home > Danh mục > [Category Name]
6. **Given** `/categories/{slug}` với invalid slug **When** trang load **Then** hiện 404 page

## Tasks / Subtasks

- [x] Task 1: Refactor category page layout (AC: #1, #5, #6)
  - [x] 1.1: Update `src/app/(frontend)/[locale]/categories/[slug]/page.tsx` — use Breadcrumb component
  - [x] 1.2: Replace inline breadcrumb with `<Breadcrumb items={[{ label: 'Danh mục', href }, { label: category.name }]} />`
  - [x] 1.3: Display category image from `category.image` Media relationship instead of none
  - [x] 1.4: Render description using RichText component (description is richText type)
  - [x] 1.5: Improve page structure per UX spec (section spacing, container max-width)
  - [x] 1.6: Add props type for `searchParams` to support pagination

- [x] Task 2: Integrate ProductCard component (AC: #3)
  - [x] 2.1: Import ProductCard from `@/components/ui/ProductCard`
  - [x] 2.2: Replace inline product cards with `<ProductCard product={product} locale={locale} />`
  - [x] 2.3: Ensure ProductCard receives populated data (depth: 1 for brand/images relationship)

- [x] Task 3: Enhance subcategories display (AC: #2)
  - [x] 3.1: Keep existing subcategory grid layout
  - [x] 3.2: Display subcategory image if available
  - [x] 3.3: Add hover effects consistent with design system

- [x] Task 4: Add Load More pagination (AC: #4)
  - [x] 4.1: Fetch products with `page` query param from URL
  - [x] 4.2: Add URL searchParams support: `{ params, searchParams }` in page props
  - [x] 4.3: Render "Xem thêm" / "Load More" button when `hasNextPage` is true
  - [x] 4.4: Button links to `?page=N+1` (preserving locale and slug)
  - [x] 4.5: Remove old "Xem tất cả sản phẩm" redirect link

- [x] Task 5: SEO and metadata (AC: #1)
  - [x] 5.1: Update generateMetadata to include category description excerpt
  - [x] 5.2: Add og:image from category image if available
  - [x] 5.3: Title format: `{category.name} | VIES`

- [x] Task 6: Build + verify
  - [x] 6.1: Chạy `pnpm build` — phải thành công
  - [x] 6.2: Verify category page hiện với seed data (vòng bi, mỡ bôi trơn, phụ kiện, dịch vụ bảo trì, thiết bị đo, dầu nhớt)
  - [x] 6.3: Verify category image displays (nếu có trong seed data)
  - [x] 6.4: Verify breadcrumb navigation: Home > Danh mục > [Category Name]
  - [x] 6.5: Verify product grid uses ProductCard component
  - [x] 6.6: Verify Load More pagination works (thêm ?page=2 vào URL)
  - [x] 6.7: Verify subcategories display when parent category exists
  - [x] 6.8: Verify 404 cho invalid slug
  - [x] 6.9: Verify description renders richText correctly (if category has description)

## Dev Notes

### Architecture & Patterns

**Current state:**
File `src/app/(frontend)/[locale]/categories/[slug]/page.tsx` already exists with basic functionality:
- Fetches category by slug ✅
- Shows products for category ✅
- Shows subcategories ✅
- Has 404 handling via notFound() ✅
- BUT: uses inline breadcrumb (needs Breadcrumb component)
- BUT: uses inline product cards (needs ProductCard component)
- BUT: no proper Load More pagination (uses "View all" redirect)
- BUT: description rendered as string (needs RichText component)
- BUT: category image not displayed

**Page structure after refactor:**
```
/categories/[slug] page (Server Component)
├── Breadcrumb (Server) — Home > Danh mục > [Category Name]
├── CategoryHeader section
│   ├── Category image (from Media, if available)
│   ├── Category name (H1)
│   └── Product count
├── CategoryDescription section (if description exists)
│   └── RichText rendered description
├── Subcategories section (if subcategories exist)
│   └── Grid of subcategory cards with optional images
├── ProductGrid section
│   ├── Section title: "Sản phẩm trong danh mục"
│   ├── ProductCard[] grid (12 per page)
│   └── Load More button (if hasNextPage)
└── EmptyState (if no products)
```

**File location:**
```
src/app/(frontend)/[locale]/categories/[slug]/page.tsx  # Existing - MODIFY
```

### Category Collection Fields (from Categories.ts)

```typescript
{
  name: string           // localized, required
  slug: string           // unique, indexed
  description: any       // richText, localized
  image: Media | string  // upload relationship to media
  parent: Category | string | null  // self-referential relationship
  order: number          // for sorting (default 0)
}
```

**Access control:** `read: anyone` — no draft filtering needed.

### Payload Query Patterns

**Fetching category with locale:**
```typescript
const payload = await getPayload({ config: await config })

const { docs } = await payload.find({
  collection: 'categories',
  where: { slug: { equals: slug } },
  limit: 1,
  locale,
  depth: 1, // Populate image Media
})

const category = docs[0]
if (!category) notFound()
```

**Fetching products for category with pagination:**
```typescript
const currentPage = parseInt(page || '1')
const limit = 12

const { docs: products, totalDocs, hasNextPage, nextPage } = await payload.find({
  collection: 'products',
  where: { categories: { contains: category.id } },
  limit,
  page: currentPage,
  sort: 'name',
  locale,
  depth: 1, // Populate brand and images
})
```

**Fetching subcategories:**
```typescript
const { docs: subcategories } = await payload.find({
  collection: 'categories',
  where: { parent: { equals: category.id } },
  sort: 'order',
  locale,
  depth: 1, // Populate image
})
```

### Category Image Display Pattern

```typescript
// Extract image URL from Media relationship
const imageUrl = typeof category.image === 'object' && category.image
  ? category.image.sizes?.medium?.url ?? category.image.url
  : null

const imageAlt = typeof category.image === 'object' && category.image
  ? category.image.alt || category.name
  : category.name

// Render
{imageUrl ? (
  <img
    src={imageUrl}
    alt={imageAlt}
    className="w-full h-48 object-cover rounded-lg"
  />
) : (
  <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
    <CategoryIcon className="w-16 h-16 text-gray-400" />
  </div>
)}
```

### RichText Rendering for Description

**Note:** Category description is richText (Lexical format), not plain string.

```typescript
import { RichText } from '@payloadcms/richtext-lexical/react'

// In component
{category.description && (
  <div className="prose prose-gray max-w-none">
    <RichText data={category.description} />
  </div>
)}
```

### Breadcrumb Integration

```typescript
import { Breadcrumb } from '@/components/ui/Breadcrumb'

// In page
<Breadcrumb
  items={[
    { label: locale === 'vi' ? 'Danh mục' : 'Categories', href: `/${locale}/products` },
    { label: category.name },
  ]}
/>
```

**Note:** Breadcrumb component already handles Home > prefix and styling.

### Load More Pagination Pattern

**Using link-based pagination (consistent with Story 3.7 Brand page):**
```typescript
// Type definitions
type Props = {
  params: Promise<{ locale: string; slug: string }>
  searchParams: Promise<{ page?: string }>
}

// In page.tsx
export default async function CategoryPage({ params, searchParams }: Props) {
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
            href={`/${locale}/categories/${slug}?page=${nextPage}`}
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

**Category header:**
- Background: bg-primary with white text OR white with subtle styling
- Category image: optional, max 200px height, object-cover, rounded
- Category name: H1, text-3xl md:text-4xl, font-bold
- Product count: text-gray-500 / text-blue-100

**Category description section:**
- Background: bg-white, rounded-lg, shadow-sm, p-6
- RichText: prose styles, max-w-none

**Subcategories section:**
- Grid: 2/4 columns (responsive)
- Card: bg-white, rounded-xl, shadow-sm, p-4, hover:shadow-md
- Show image if available, name centered

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

Per AC #5: `Home > Danh mục > [Category Name]`

Breadcrumb items:
1. Home (auto by Breadcrumb component)
2. "Danh mục" / "Categories" → link to products page
3. Category name → current page (no link, bold)

### Seed Data Categories (6 categories)

From scripts/seed.ts:
- Vòng bi (slug: vong-bi) - bearings
- Mỡ bôi trơn (slug: mo-boi-tron) - lubricating grease
- Phụ kiện (slug: phu-kien) - accessories
- Dịch vụ bảo trì (slug: dich-vu-bao-tri) - maintenance services
- Thiết bị đo (slug: thiet-bi-do) - measuring equipment
- Dầu nhớt (slug: dau-nhot) - lubricating oil

### Điểm cần tránh

- **KHÔNG** tạo file mới — chỉ MODIFY file existing `categories/[slug]/page.tsx`
- **KHÔNG** filter `_status` — Categories collection không có drafts
- **KHÔNG** dùng `<Image>` nếu gặp config issues — `<img>` đủ cho MVP
- **KHÔNG** add infinite scroll — UX spec dùng Load More button
- **KHÔNG** show product prices — UX spec nói rõ không hiện giá
- **KHÔNG** remove GearIcon/CategoryIcon nếu vẫn cần làm fallback cho subcategories hoặc products không có ảnh

### Previous Story Intelligence

**Từ Story 3.4 (ProductCard):**
- Status: done ✅
- ProductCard ở `src/components/ui/ProductCard.tsx`
- Pattern: accepts `Product | ProductCardData`, extracts brandName và thumbnailUrl
- Server Component compatible

**Từ Story 3.5 (Product listing page):**
- Status: done ✅
- Pattern: link-based Load More pagination với `?page=N`
- Pattern: URL searchParams handling

**Từ Story 3.6 (Product detail page):**
- Pattern: depth: 2 for relationship population
- Pattern: RichText rendering với `@payloadcms/richtext-lexical/react`
- Pattern: image extraction từ Media relationships

**Từ Story 3.7 (Brand page):**
- Status: ready-for-dev
- Very similar structure to category page
- Pattern: Breadcrumb integration
- Pattern: Load More pagination with searchParams
- Pattern: RichText for description
- Pattern: Image from Media relationship

**Git history context (recent commits):**
- 3871c26: Add Product listing page with CategoryFilter component (Story 3.5)
- 7f44e01: Add ProductCard component with design system fixes (Story 3.4)
- Previous category page was created earlier as placeholder

### Key Differences from Brand Page (Story 3.7)

| Aspect | Brand Page | Category Page |
|--------|-----------|---------------|
| Image field | `brand.logo` | `category.image` |
| Description | Optional | Optional |
| Website link | Has `brand.website` | No website field |
| Subcategories | N/A | Must display subcategories grid |
| Product query | `brand: { equals: id }` | `categories: { contains: id }` |
| Breadcrumb middle | "Thương hiệu" / "Brands" | "Danh mục" / "Categories" |

### Metadata Generation

```typescript
import type { Metadata } from 'next'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const payload = await getPayload({ config: await config })

  const { docs } = await payload.find({
    collection: 'categories',
    where: { slug: { equals: slug } },
    limit: 1,
    locale,
    depth: 1,
  })

  const category = docs[0]
  if (!category) {
    return {
      title: locale === 'vi' ? 'Không tìm thấy danh mục' : 'Category Not Found',
    }
  }

  // Extract image for og:image
  const imageUrl = typeof category.image === 'object' && category.image
    ? category.image.sizes?.medium?.url ?? category.image.url
    : null

  return {
    title: `${category.name} | VIES`,
    description: `${locale === 'vi' ? 'Sản phẩm' : 'Products in'} ${category.name} - VIES`,
    openGraph: {
      title: category.name,
      images: imageUrl ? [{ url: imageUrl }] : undefined,
    },
  }
}
```

### Project Structure Notes

- Category detail page: `src/app/(frontend)/[locale]/categories/[slug]/page.tsx` — MODIFY existing
- Alignment với Architecture doc Section 7
- Sẽ được linked từ: ProductCard category links (future), CategoryFilter links, homepage category section
- Uses existing components: Breadcrumb, ProductCard

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 3.8 - Category page]
- [Source: _bmad-output/planning-artifacts/architecture.md#Section 3.5 - Categories Collection]
- [Source: _bmad-output/planning-artifacts/architecture.md#Section 5.1 - Component Data Flow]
- [Source: _bmad-output/planning-artifacts/architecture.md#Section 6.2 - Data Fetching Pattern]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Journey 2 - Browse & Discover]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#ProductCard specs]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Breadcrumb specs]
- [Source: _bmad-output/planning-artifacts/prd.md#CT-01, CT-02 - Category requirements]
- [Source: _bmad-output/implementation-artifacts/3-4-productcard-component.md - ProductCard component]
- [Source: _bmad-output/implementation-artifacts/3-5-product-listing-page.md - Pagination pattern]
- [Source: _bmad-output/implementation-artifacts/3-7-brand-page.md - Similar page pattern]
- [Source: src/collections/Categories.ts - Category fields]
- [Source: src/app/(frontend)/[locale]/categories/[slug]/page.tsx - Existing category page]
- [Source: src/components/ui/ProductCard.tsx - ProductCard implementation]
- [Source: src/components/ui/Breadcrumb.tsx - Breadcrumb implementation]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- Fixed pre-existing type error in ProductGallery component by widening `images` prop type to accept `number | Media | null` (component already filtered unpopulated refs)

### Completion Notes List

- Refactored category page to use Breadcrumb component (consistent with other pages)
- Integrated ProductCard component for product grid display
- Added category image display in header section (only shows if image exists)
- Implemented RichText rendering for category description using @payloadcms/richtext-lexical/react
- Enhanced subcategories display with images and hover effects
- Added Load More pagination with searchParams support (?page=N pattern)
- Implemented SEO metadata with og:image from category image
- Removed old "Xem tất cả sản phẩm" redirect link in favor of Load More button
- All queries use `locale as Locale` type casting for TypeScript compatibility
- Build passes successfully

### File List

- `src/app/(frontend)/[locale]/categories/[slug]/page.tsx` — Modified: Complete refactor with Breadcrumb, ProductCard, RichText, pagination
- `src/components/product/ProductGallery.tsx` — Modified: Fixed type in images prop to accept unpopulated refs

## Senior Developer Review

**Reviewer:** Tan
**Date:** 2026-02-05
**Outcome:** ✅ Approved (all issues fixed)

### Issues Found & Fixed

| Severity | Issue | Fix Applied |
|----------|-------|-------------|
| HIGH | ProductGallery: `aria-controls` references non-existent ID | Added `id="main-product-image"` to main image container |
| MEDIUM | Duplicate category fetch in generateMetadata and page | Added React `cache()` wrapper for `getCategory()` |
| MEDIUM | `parseInt(page)` returns NaN for invalid input | Changed to `parseInt(page, 10) \|\| 1` |
| MEDIUM | No limit on subcategories query | Added `limit: 20` to query |
| LOW | Missing pagination position indicator | Added "Showing X-Y of Z" display |
| LOW | Missing focus-visible styles on Load More button | Added `focus-visible:ring-2` styles |

### All Acceptance Criteria Verified
- AC #1-6: All implemented and verified ✅

## Change Log

| Date | Change |
|------|--------|
| 2026-02-05 | Story 3.8 implemented: Category page with Breadcrumb, ProductCard, subcategories, Load More pagination, SEO metadata |
| 2026-02-05 | Code review: Fixed 6 issues (1 HIGH, 3 MEDIUM, 2 LOW) - accessibility, caching, validation, pagination UX |
