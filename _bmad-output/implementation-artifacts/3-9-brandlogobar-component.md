# Story 3.9: BrandLogoBar component

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a khách hàng,
I want to see partner brand logos on the homepage,
So that I can trust VIES sells authentic products from recognized brands.

## Acceptance Criteria

1. **Given** BrandLogoBar nhận brands data via props **When** render **Then** hiện row logos: SKF, FAG, NSK, TIMKEN, NTN, KOYO (và brands khác từ Brands collection)
2. **Given** BrandLogoBar render **When** user click logo **Then** navigate đến `/brands/{slug}`
3. **Given** viewport < 768px (mobile) **When** BrandLogoBar render **Then** hiện horizontal scroll (overflow-x-auto)
4. **Given** viewport >= 768px (desktop) **When** BrandLogoBar render **Then** hiện grid layout (flex wrap hoặc grid)
5. **Given** BrandLogoBar **When** component render **Then** là Server Component (không dùng 'use client')

## Tasks / Subtasks

- [x] Task 1: Create BrandLogoBar component (AC: #1, #5)
  - [x] 1.1: Create `src/components/ui/BrandLogoBar.tsx` as Server Component
  - [x] 1.2: Define Props type: `{ brands: Brand[]; locale: string }`
  - [x] 1.3: Extract logo URL from Media relationship (brand.logo)
  - [x] 1.4: Fallback display for brands without logo (text abbreviation)
  - [x] 1.5: Add section heading: "Thương hiệu đối tác" / "Partner Brands"

- [x] Task 2: Implement clickable links (AC: #2)
  - [x] 2.1: Wrap each logo in Link component from next/link
  - [x] 2.2: Link href: `/${locale}/brands/${brand.slug}`
  - [x] 2.3: Add hover effects (scale/opacity transition)
  - [x] 2.4: Add accessible aria-label for each link

- [x] Task 3: Responsive design (AC: #3, #4)
  - [x] 3.1: Mobile (< md): horizontal scroll with `overflow-x-auto`, flex nowrap
  - [x] 3.2: Desktop (>= md): flex wrap or CSS grid, centered
  - [x] 3.3: Logo sizing: consistent height (40-60px), width auto
  - [x] 3.4: Gap between logos: 24-32px
  - [x] 3.5: Add scroll indicators or fade edges on mobile (optional enhancement) — skipped (optional)

- [x] Task 4: Integrate on Homepage (AC: #1)
  - [x] 4.1: Import BrandLogoBar in `[locale]/page.tsx`
  - [x] 4.2: Fetch brands data: `payload.find({ collection: 'brands', sort: 'name', locale, depth: 1 })`
  - [x] 4.3: Pass brands and locale to BrandLogoBar
  - [x] 4.4: Position: below hero/dual section, above CTA section (per UX spec layout)

- [x] Task 5: Build + verify
  - [x] 5.1: Chạy `pnpm build` — phải thành công
  - [x] 5.2: Verify brand logos display on homepage (seed data: SKF, FAG, NSK, Timken, NTN, KOYO, INA, KOYO)
  - [x] 5.3: Verify logo images render (if brands have logos in seed data)
  - [x] 5.4: Verify click navigates to brand detail page
  - [x] 5.5: Verify responsive: horizontal scroll on mobile, grid on desktop
  - [x] 5.6: Verify accessibility: keyboard navigation works on logo links

## Dev Notes

### Architecture & Patterns

**Component location:**
```
src/components/ui/BrandLogoBar.tsx  # NEW - Create this file
```

**Data flow:**
```
Homepage (Server)
├── payload.find({ collection: 'brands' }) → brands
└── BrandLogoBar (Server) ← Props: brands, locale
    └── Link[] with brand logo/fallback, href to brand detail page
```

**Component structure:**
```tsx
// BrandLogoBar.tsx
type Props = {
  brands: Brand[]
  locale: string
}

export function BrandLogoBar({ brands, locale }: Props) {
  return (
    <section className="..." aria-labelledby="partner-brands-heading">
      <h2 id="partner-brands-heading">...</h2>
      <div className="flex overflow-x-auto md:flex-wrap md:justify-center ...">
        {brands.map((brand) => (
          <Link key={brand.id} href={`/${locale}/brands/${brand.slug}`} ...>
            {/* Logo or fallback */}
          </Link>
        ))}
      </div>
    </section>
  )
}
```

### Brand Collection Fields (from Brands.ts)

```typescript
{
  name: string           // localized, required
  slug: string           // unique, indexed
  logo: Media | string   // upload relationship to media
  description: any       // richText, localized
  website: string        // optional external link
}
```

**Access control:** `read: anyone` — no draft filtering needed.

### Logo Image Extraction Pattern

Follow pattern from Brand detail page (Story 3.7):

```typescript
// Extract logo URL from Media relationship
const logoUrl = typeof brand.logo === 'object' && brand.logo
  ? brand.logo.sizes?.thumbnail?.url ?? brand.logo.url
  : null

const logoAlt = typeof brand.logo === 'object' && brand.logo
  ? brand.logo.alt || `${brand.name} logo`
  : `${brand.name} logo`
```

Use `thumbnail` size (400x300) for logo bar since logos are displayed small.

### Logo Fallback Pattern

When brand has no logo image:

```tsx
{logoUrl ? (
  <img
    src={logoUrl}
    alt={logoAlt}
    className="h-12 w-auto object-contain"
    loading="lazy"
  />
) : (
  <span className="text-lg font-bold text-primary">
    {brand.name.slice(0, 3).toUpperCase()}
  </span>
)}
```

### Responsive Layout Specs

**Mobile (< md breakpoint):**
- Horizontal scroll: `flex flex-nowrap overflow-x-auto`
- Scroll snap: `snap-x snap-mandatory` (optional)
- Hide scrollbar: `-webkit-overflow-scrolling: touch` + custom scrollbar hiding
- Gap: `gap-6` (24px)
- Logo height: `h-10` (40px)

**Desktop (>= md breakpoint):**
- Flex wrap centered: `md:flex-wrap md:justify-center`
- Or CSS Grid: `md:grid md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8`
- Gap: `gap-8` (32px)
- Logo height: `h-12` to `h-14` (48-56px)

### UX Design Specs (từ UX Specification)

**From Layout Structure:**
> 5. **Thương hiệu đối tác**: Logo row (SKF, FAG, NSK, TIMKEN, NTN, KOYO)

**From Component Strategy:**
> **BrandLogoBar** - Logo thương hiệu đối tác | Homepage, footer

**Visual design:**
- Section background: `bg-white` or `bg-bg-alt` (#F0F0F0)
- Section padding: `py-lg` or `py-xl`
- Container max-width: `max-w-[var(--container-max)]`
- Logos: grayscale by default, color on hover (optional)
- Hover effect: `hover:opacity-80` or `hover:scale-105`

**From Journey 2 - Browse & Discover:**
> Logo bar thương hiệu trên homepage là entry point nhanh để browse theo hãng

### Accessibility Requirements

- Section landmark: `<section aria-labelledby="...">`
- Heading: H2 for section title
- Logo links: `aria-label="{brand.name}"` (especially if using image-only)
- Keyboard navigation: focusable links with visible focus state
- Mobile scroll: ensure scroll is accessible to keyboard users

### Styling Patterns

**Container and spacing:**
```tsx
<section className="bg-white py-lg md:py-xl">
  <div className="mx-auto max-w-[var(--container-max)] px-md">
    <h2 className="text-center text-xl font-semibold text-gray-900 mb-lg">
      {locale === 'vi' ? 'Thương hiệu đối tác' : 'Partner Brands'}
    </h2>
    <div className="...">
      {/* Logo items */}
    </div>
  </div>
</section>
```

**Logo item styling:**
```tsx
<Link
  href={`/${locale}/brands/${brand.slug}`}
  className="flex-shrink-0 flex items-center justify-center p-4 bg-white border border-border rounded-lg hover:border-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
  aria-label={brand.name}
>
  {/* Logo or fallback */}
</Link>
```

### Seed Data Brands (8 brands)

From scripts/seed.ts:
- SKF (slug: skf)
- FAG (slug: fag)
- NSK (slug: nsk)
- Timken (slug: timken)
- NTN (slug: ntn)
- KOYO (slug: koyo)
- INA (slug: ina)
- Lincoln (slug: lincoln)

**Note:** Seed data may not have logo images uploaded. Component must handle missing logos gracefully.

### Homepage Integration

**Current homepage structure** (to be updated):
```
[locale]/page.tsx
├── Hero section (search bar) ✅
├── Dual section (services + products) - TODO
├── BrandLogoBar section - ADD THIS
├── CTA section - TODO
└── (Footer in layout)
```

**Fetch brands in homepage:**
```typescript
// In [locale]/page.tsx
const { docs: brands } = await payload.find({
  collection: 'brands',
  limit: 20, // Get all brands
  sort: 'name',
  locale: locale as Locale,
  depth: 1, // Populate logo Media
})

// In return JSX
<BrandLogoBar brands={brands} locale={locale} />
```

### Previous Story Intelligence

**Từ Story 3.7 (Brand page):**
- Status: done ✅
- Pattern: extracting logo URL from Media relationship
- Pattern: fallback display for missing logo
- Pattern: Link component with locale prefix

**Từ Story 3.8 (Category page):**
- Status: done ✅
- Pattern: Server Component structure
- Pattern: section layout with heading

**Git history context (recent commits):**
- e5788d5: Add Category detail page (Story 3.8)
- bdf16a0: Add Brand detail page (Story 3.7)
- Similar patterns for data fetching and image handling

### Điểm cần tránh

- **KHÔNG** dùng `'use client'` — component phải là Server Component
- **KHÔNG** filter brands — hiện tất cả brands, không lọc
- **KHÔNG** add complex animations — chỉ subtle hover effects
- **KHÔNG** use absolute image paths — extract from Media relationship
- **KHÔNG** forget aria-label on image-only links
- **KHÔNG** add infinite scroll — hiện tất cả brands at once

### Optional Enhancements

1. **Grayscale to color on hover:**
```tsx
<img className="h-12 w-auto grayscale hover:grayscale-0 transition-all" />
```

2. **Scroll fade edges on mobile:**
```tsx
<div className="relative">
  <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent pointer-events-none md:hidden" />
  {/* Logo container */}
  <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent pointer-events-none md:hidden" />
</div>
```

3. **Scroll snap for mobile:**
```tsx
<div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-4">
  <Link className="snap-start flex-shrink-0 ...">
```

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 3.9 - BrandLogoBar component]
- [Source: _bmad-output/planning-artifacts/architecture.md#Section 5.1 - Component Data Flow]
- [Source: _bmad-output/planning-artifacts/architecture.md#Section 7 - Project Structure]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Design Direction - Layout Structure]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Component Strategy - BrandLogoBar]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Journey 2 - Browse & Discover]
- [Source: _bmad-output/planning-artifacts/prd.md#HP-05 - Logo bar thương hiệu đối tác]
- [Source: _bmad-output/planning-artifacts/prd.md#BR-02 - Logo bar link đến brand pages]
- [Source: _bmad-output/implementation-artifacts/3-7-brand-page.md - Logo extraction pattern]
- [Source: src/collections/Brands.ts - Brand fields]
- [Source: scripts/seed.ts - Seed data brands]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

N/A - Implementation proceeded without issues.

### Completion Notes List

- ✅ Created BrandLogoBar component as Server Component (no 'use client')
- ✅ Component displays brand logos from Media relationship with fallback text abbreviation
- ✅ Links navigate to brand detail page (`/${locale}/brands/${slug}`)
- ✅ Responsive: horizontal scroll on mobile, flex wrap centered on desktop
- ✅ Accessible: section landmark with aria-labelledby, aria-label on links, focus-visible states
- ✅ Replaced existing homepage Brands Section with new BrandLogoBar
- ✅ Updated brands fetch to include locale and depth: 1 for logo population
- ✅ Build successful

### File List

- `src/components/ui/BrandLogoBar.tsx` (NEW) - BrandLogoBar Server Component
- `src/app/(frontend)/[locale]/page.tsx` (MODIFIED) - Integrated BrandLogoBar, updated brands fetch

### Change Log

| Date | Change |
|------|--------|
| 2026-02-05 | Created BrandLogoBar component with responsive design, logo extraction, and accessibility features. Integrated on homepage replacing existing brands section. |
| 2026-02-05 | **Code Review Fixes:** (1) Replaced native `<img>` with Next.js `Image` component for optimization, (2) Replaced hardcoded locale text with i18n translations using `getTranslations`, (3) Added empty state handling - returns null if no brands, (4) Added scroll-snap for better mobile UX, (5) Moved duplicate GearIcon from page.tsx to shared icons file. Build verified. |

## Senior Developer Review

**Reviewer:** Tan
**Date:** 2026-02-05

### Issues Found & Fixed

| Severity | Issue | Resolution |
|----------|-------|------------|
| HIGH | Using native `<img>` instead of `next/image` | ✅ Fixed - Now uses `next/image` with proper width/height |
| MEDIUM | Hardcoded locale text (`locale === 'vi'`) | ✅ Fixed - Now uses `getTranslations` with `home.ourBrands` key |
| MEDIUM | No empty state handling | ✅ Fixed - Returns null when brands array is empty |
| LOW | Duplicate GearIcon in page.tsx | ✅ Fixed - Imports from shared `@/components/layout/icons` |
| LOW | Missing scroll snap for mobile | ✅ Fixed - Added `snap-x snap-mandatory` and `snap-start` classes |

### Verification

- ✅ Build passes (`pnpm build`)
- ✅ All Acceptance Criteria implemented correctly
- ✅ Server Component (async function, no 'use client')
- ✅ i18n properly integrated
- ✅ Next.js Image optimization enabled

### Recommendation

**APPROVED** - All issues addressed, ready to merge.
