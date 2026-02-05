# Story 5.1: Services listing page

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a kỹ sư bảo trì,
I want to see all technical services VIES offers,
So that I can find the right service for my needs.

## Acceptance Criteria

1. **Given** `/services` page **When** trang load **Then** hiện danh sách ServiceCards sorted by order field
2. **Given** ServiceCard component **When** rendered **Then** hiện: ảnh (featuredImage medium size) + tiêu đề + excerpt + "Xem chi tiết" link
3. **Given** services page **When** rendered **Then** breadcrumb hiện: Home > Dịch vụ
4. **Given** services page **When** data fetched **Then** dùng Services collection với publishedOnly access (đã cấu hình)
5. **Given** services page **When** no services exist **Then** hiện empty state message
6. **Given** services page **Then** tất cả text dùng i18n translations từ next-intl (không hardcode)
7. **Given** ServiceCard **When** user click **Then** navigate đến `/services/{slug}`

## Dependencies

**Epic 2 (Site Layout & Navigation)** đã hoàn thành:
- Breadcrumb component exists at `src/components/ui/Breadcrumb.tsx`
- CTASection component exists (Story 4.3)
- Layout components (ContactBar, NavigationHeader, Footer) integrated

**Epic 4 (Quote Request & Contact)** đã hoàn thành:
- Contact page and forms working
- CTASection component available for reuse

**Services Collection:** Already configured with `publishedOnly` access, fields: title, slug, excerpt, content, featuredImage, benefits, order

## Tasks / Subtasks

- [x] Task 1: Create ServiceCard component (AC: #2, #7)
  - [x] 1.1: Tạo file `src/components/ui/ServiceCard.tsx` (Server Component)
  - [x] 1.2: Define ServiceCardProps interface:
    ```typescript
    interface ServiceCardProps {
      service: Service
      locale: string
    }
    ```
  - [x] 1.3: Implement card layout:
    - Image container: aspect-[16/9] with featuredImage (medium size) or placeholder
    - Content padding: p-md (16px)
    - Title: text-xl font-semibold, line-clamp-2
    - Excerpt: text-text-muted, line-clamp-3
    - "Xem chi tiết" link: text-primary with arrow icon
  - [x] 1.4: Image extraction from Media relationship (same pattern as ProductCard/BrandPage):
    ```typescript
    const imageUrl = typeof service.featuredImage === 'object' && service.featuredImage
      ? service.featuredImage.sizes?.medium?.url ?? service.featuredImage.url
      : null
    ```
  - [x] 1.5: Wrap card in Link to `/services/{slug}`
  - [x] 1.6: Hover state: border-primary transition

- [x] Task 2: Update Services listing page (AC: #1, #3, #4, #5, #6)
  - [x] 2.1: Update `src/app/(frontend)/[locale]/services/page.tsx`
  - [x] 2.2: Add imports:
    - `import { getTranslations } from 'next-intl/server'`
    - `import { Breadcrumb } from '@/components/ui/Breadcrumb'`
    - `import { ServiceCard } from '@/components/ui/ServiceCard'`
    - `import { CTASection } from '@/components/ui/CTASection'`
  - [x] 2.3: Fetch translations using `getTranslations`:
    ```typescript
    const t = await getTranslations({ locale, namespace: 'services' })
    const tNav = await getTranslations({ locale, namespace: 'nav' })
    const tCommon = await getTranslations({ locale, namespace: 'common' })
    ```
  - [x] 2.4: Add Breadcrumb: `[{ label: tNav('breadcrumb.services') }]`
  - [x] 2.5: Replace hardcoded strings with translations:
    - Page title: `t('title')` → "Dịch vụ kỹ thuật"
    - Empty state: `tCommon('noResults')`
  - [x] 2.6: Replace inline card rendering with ServiceCard component
  - [x] 2.7: Update container styling to use design tokens:
    - `max-w-[var(--container-max)] mx-auto px-md` instead of `container mx-auto px-4`
  - [x] 2.8: Add CTASection at bottom (reuse from 4.3)
  - [x] 2.9: Add proper SEO metadata with pattern from architecture.md

- [x] Task 3: Update generateMetadata for SEO (AC: #6)
  - [x] 3.1: Update metadata to use translations and follow pattern:
    ```typescript
    export async function generateMetadata({ params }: Props): Promise<Metadata> {
      const { locale } = await params
      const t = await getTranslations({ locale, namespace: 'services' })

      return {
        title: `${t('title')} | VIES`,
        description: locale === 'vi'
          ? 'Dịch vụ tư vấn kỹ thuật vòng bi, đo rung động, lắp đặt và bôi trơn từ VIES'
          : 'Technical consulting services for bearings, vibration analysis, installation and lubrication from VIES',
        openGraph: {
          title: t('title'),
        },
      }
    }
    ```

- [x] Task 4: Verify i18n messages exist
  - [x] 4.1: Check `messages/vi.json` has services section (already has: title, viewDetails, benefits, contactConsult, relatedServices)
  - [x] 4.2: Check `messages/en.json` has same keys
  - [x] 4.3: Add any missing keys if needed (page subtitle, empty state)

- [x] Task 5: Build + verify (AC: all)
  - [x] 5.1: Chạy `pnpm build` — phải thành công
  - [x] 5.2: Manually test services page loads with ServiceCards
  - [x] 5.3: Verify breadcrumb shows: Home > Dịch vụ
  - [x] 5.4: Verify clicking ServiceCard navigates to detail page
  - [x] 5.5: Verify CTASection renders at bottom
  - [x] 5.6: Verify empty state when no services (optional - depends on seed data)
  - [x] 5.7: Test locale switching (vi/en)

## Dev Notes

### Architecture & Patterns

**File locations:**
```
src/components/ui/ServiceCard.tsx         # NEW - Server Component
src/app/(frontend)/[locale]/services/page.tsx  # UPDATE - use ServiceCard, i18n, Breadcrumb
```

**Component architecture (per architecture.md Section 5.1):**
| Component | CMS Data Source | Client/Server |
|-----------|----------------|---------------|
| ServiceCard | Services (populated featuredImage) | Server |
| Services page | Services collection (sorted by order) | Server |

### ServiceCard Implementation Pattern

```tsx
// src/components/ui/ServiceCard.tsx
import Link from 'next/link'
import type { Service } from '@/payload-types'
import { ArrowRightIcon } from '@/components/layout/icons'

export interface ServiceCardProps {
  service: Service
  locale: string
  viewDetailsText: string  // Passed from parent for i18n
}

export function ServiceCard({ service, locale, viewDetailsText }: ServiceCardProps) {
  // Extract image URL from Media relationship
  const imageUrl =
    typeof service.featuredImage === 'object' && service.featuredImage
      ? service.featuredImage.sizes?.medium?.url ?? service.featuredImage.url
      : null
  const imageAlt =
    typeof service.featuredImage === 'object' && service.featuredImage
      ? service.featuredImage.alt || service.title
      : service.title

  return (
    <article className="bg-white rounded-lg border border-border overflow-hidden group hover:border-primary transition-colors duration-200">
      <Link href={`/${locale}/services/${service.slug}`} className="block">
        {/* Image */}
        <div className="aspect-[16/9] bg-gray-100 relative overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={imageAlt}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ServicePlaceholderIcon className="w-16 h-16 text-gray-300" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-md">
          <h3 className="text-xl font-semibold text-gray-900 group-hover:text-primary transition-colors line-clamp-2 mb-2">
            {service.title}
          </h3>
          {service.excerpt && (
            <p className="text-text-muted line-clamp-3 mb-md">
              {service.excerpt}
            </p>
          )}
          <span className="inline-flex items-center gap-2 text-primary font-medium">
            {viewDetailsText}
            <ArrowRightIcon className="w-4 h-4" aria-hidden="true" />
          </span>
        </div>
      </Link>
    </article>
  )
}

function ServicePlaceholderIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}
```

### Services Page Update Pattern

```tsx
// src/app/(frontend)/[locale]/services/page.tsx
import { getPayload } from 'payload'
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import config from '@/payload.config'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { ServiceCard } from '@/components/ui/ServiceCard'
import { CTASection } from '@/components/ui/CTASection'
import type { Locale } from '@/i18n/config'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'services' })

  return {
    title: `${t('title')} | VIES`,
    description: locale === 'vi'
      ? 'Dịch vụ tư vấn kỹ thuật vòng bi, đo rung động, lắp đặt và bôi trơn từ VIES'
      : 'Technical consulting services for bearings, vibration analysis, installation and lubrication from VIES',
  }
}

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params

  const t = await getTranslations({ locale, namespace: 'services' })
  const tNav = await getTranslations({ locale, namespace: 'nav' })
  const tCommon = await getTranslations({ locale, namespace: 'common' })
  const tHome = await getTranslations({ locale, namespace: 'home' })

  const payload = await getPayload({ config: await config })

  // Fetch services sorted by order (publishedOnly access handles draft filtering)
  const { docs: services } = await payload.find({
    collection: 'services',
    sort: 'order',
    locale: locale as Locale,
    depth: 1, // Populate featuredImage
  })

  // Fetch site settings for CTA
  const siteSettings = await payload.findGlobal({
    slug: 'site-settings',
    locale: locale as Locale,
  })

  return (
    <>
      {/* Breadcrumb: Home > Dịch vụ */}
      <Breadcrumb
        items={[{ label: tNav('breadcrumb.services') }]}
      />

      <div className="min-h-screen bg-background">
        {/* Page Header */}
        <div className="bg-white border-b border-border">
          <div className="mx-auto max-w-[var(--container-max)] px-md py-lg">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              {t('title')}
            </h1>
            <p className="text-text-muted mt-2 text-lg">
              {locale === 'vi'
                ? 'Tư vấn và giải pháp kỹ thuật chuyên nghiệp'
                : 'Professional technical consulting and solutions'}
            </p>
          </div>
        </div>

        {/* Services Grid */}
        <div className="mx-auto max-w-[var(--container-max)] px-md py-xl">
          {services.length === 0 ? (
            // Empty state
            <div className="bg-white rounded-lg shadow-sm p-xl text-center">
              <p className="text-text-muted">{tCommon('noResults')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  locale={locale}
                  viewDetailsText={t('viewDetails')}
                />
              ))}
            </div>
          )}
        </div>

        {/* CTA Section */}
        <CTASection
          title={tHome('ctaTitle')}
          subtitle={tHome('ctaSubtitle')}
          phone={siteSettings.contact?.phone?.[0]?.number || '0908748304'}
          zaloUrl={siteSettings.social?.zalo}
          callText={tCommon('callNow')}
          zaloText={tCommon('zaloChat')}
        />
      </div>
    </>
  )
}
```

### Design Tokens Used (per architecture.md Section 8)

**Colors:**
- `bg-background` (#FAFAFA) - Page background
- `bg-white` - Card background
- `border-border` (#E5E7EB) - Card borders
- `text-gray-900` - Headings
- `text-text-muted` (#6B7280) - Excerpt text
- `text-primary` (#0F4C75) - Links and hover states

**Spacing:**
- `px-md` (16px) - Horizontal padding
- `py-lg` (24px) - Section vertical padding
- `py-xl` (32px) - Content area vertical padding
- `gap-lg` (24px) - Grid gap
- `p-md` (16px) - Card content padding

**Typography:**
- Page title: `text-3xl md:text-4xl font-bold`
- Card title: `text-xl font-semibold`
- Excerpt: `text-text-muted` (default size)
- Link: `text-primary font-medium`

### Icons Required

From existing `src/components/layout/icons.tsx`:
- `ArrowRightIcon` - For "Xem chi tiết" link ✅ **Already exists** (line 141-147)
- `GearIcon` - For service placeholder (line 94-111) ✅ **Already exists**
- `CheckCircleIcon` - For benefits list (line 133-139) ✅ **Already exists**

**No icon additions needed** - all required icons are available.

### i18n Messages (verify exist)

**vi.json services section:**
```json
{
  "services": {
    "title": "Dịch vụ kỹ thuật",
    "viewDetails": "Xem chi tiết",
    "benefits": "Lợi ích",
    "contactConsult": "Liên hệ tư vấn",
    "relatedServices": "Dịch vụ khác"
  }
}
```

**en.json services section:**
```json
{
  "services": {
    "title": "Technical Services",
    "viewDetails": "View details",
    "benefits": "Benefits",
    "contactConsult": "Contact for consultation",
    "relatedServices": "Other Services"
  }
}
```

### CTASection Integration

The CTASection component from Story 4.3 should be reused. Check its props interface:
```typescript
interface CTASectionProps {
  title: string
  subtitle?: string
  phone: string
  zaloLink?: string
  callLabel: string
  zaloLabel: string
  className?: string
}
```

### Previous Story Intelligence

**From Story 4.4 (Toast):**
- Icons imported from `src/components/layout/icons.tsx`
- ToastProvider already in layout
- Pattern for Client vs Server components

**From Brand page (3.7):**
- Pattern for fetching collection with Media relationships
- Image URL extraction: `service.featuredImage.sizes?.medium?.url ?? service.featuredImage.url`
- Breadcrumb integration pattern
- Empty state handling
- Design token usage (max-w-[var(--container-max)], px-md, etc.)

**From ProductCard (3.4):**
- Card structure pattern
- Hover states with border-primary
- Image placeholder pattern
- line-clamp for text truncation

### Git Intelligence

**Recent commits:**
- fe7d4e3: fix(review): 4-3-cta-section - address code review findings
- 5aff004: fix(review): 4-2-contact-page - address code review findings
- cee954b: fix(review): 4-1-quote-request-form - address code review findings

**Patterns from Epic 4:**
- CTASection component is stable and can be reused
- i18n translations follow consistent namespace patterns
- getTranslations usage pattern established

### Testing Checklist

- [x] Services page renders at `/{locale}/services`
- [x] ServiceCards display with image, title, excerpt, link
- [x] Clicking card navigates to `/services/{slug}`
- [x] Breadcrumb shows: Home > Dịch vụ (or Services in EN)
- [x] Empty state shows when no services
- [x] CTASection renders at bottom with phone and Zalo
- [x] All text uses i18n (no hardcoded Vietnamese/English)
- [x] Locale switching works (vi ↔ en)
- [x] Image placeholder shows when service has no featuredImage
- [x] Hover states work (border-primary, title color change)
- [x] Build passes: `pnpm build`

### Project Structure Notes

**Alignment with unified project structure:**
- ServiceCard in `src/components/ui/` following existing ProductCard pattern
- Page in `src/app/(frontend)/[locale]/services/` - already exists
- Server Component pattern for data-fetching pages
- Breadcrumb, CTASection reused from existing components

**Files touched:**
- `src/components/ui/ServiceCard.tsx` (NEW)
- `src/app/(frontend)/[locale]/services/page.tsx` (UPDATE - major refactor)
- No icon updates needed - ArrowRightIcon already exists
- i18n messages already have required keys (services.title, services.viewDetails)

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 5.1 - Services listing page]
- [Source: _bmad-output/planning-artifacts/epics.md#Story 5.2 - ServiceCard component]
- [Source: _bmad-output/planning-artifacts/architecture.md#Section 3.2 - Services Collection]
- [Source: _bmad-output/planning-artifacts/architecture.md#Section 5.1 - Component Data Source Matrix]
- [Source: _bmad-output/planning-artifacts/architecture.md#Section 7 - Project Structure]
- [Source: _bmad-output/planning-artifacts/architecture.md#Section 8 - Design Tokens]
- [Source: src/collections/Services.ts] - Collection schema
- [Source: src/components/ui/ProductCard.tsx] - Card pattern reference
- [Source: src/app/(frontend)/[locale]/brands/[slug]/page.tsx] - Page pattern reference
- [Source: _bmad-output/implementation-artifacts/4-3-cta-section.md] - CTASection integration

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- Fixed type error: `zaloLink` prop needed `?? undefined` to convert null to undefined

### Completion Notes List

- Created ServiceCard component following ProductCard pattern with image extraction, hover states, and Link navigation
- Refactored services page to use i18n translations via next-intl's getTranslations
- Integrated Breadcrumb component with "Home > Dịch vụ" navigation
- Replaced inline CTA section with CTASection component from story 4.3
- Updated container styling to use design tokens (max-w-[var(--container-max)], px-md, etc.)
- Added generateMetadata with SEO-friendly title and description for both locales
- All i18n keys verified present in vi.json and en.json
- Build passed successfully
- Verified both vi and en locales render correctly

### File List

**New files:**
- `src/components/ui/ServiceCard.tsx`

**Modified files:**
- `src/app/(frontend)/[locale]/services/page.tsx`
- `src/app/(frontend)/[locale]/page.tsx` (CTASection integration refactor)

### Change Log

- 2026-02-05: Story 5.1 implementation complete - Services listing page with ServiceCard component, i18n, Breadcrumb, and CTASection integration

### Code Review Fixes Applied

- HIGH: Added width={640} height={360} to ServiceCard img element to prevent CLS (src/components/ui/ServiceCard.tsx:30-31)
- MEDIUM: Updated File List to include page.tsx CTASection refactor
- MEDIUM: Fixed CTASection props interface in Dev Notes to match actual component

