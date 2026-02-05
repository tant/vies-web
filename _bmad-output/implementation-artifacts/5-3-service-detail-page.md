# Story 5.3: Service detail page

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a kỹ sư bảo trì,
I want to see full details of a service including benefits,
So that I can understand the value and decide to contact VIES.

## Acceptance Criteria

1. **Given** `/services/{slug}` page **When** trang load với valid slug **Then** hiện: featuredImage (large hero), title (H1), content (richText rendered)
2. **Given** service có benefits array **When** rendered **Then** hiện benefits list với checkmark bullets (CheckCircleIcon)
3. **Given** service detail page **When** rendered **Then** CTASection hiện ở bottom với: title "Liên hệ tư vấn", phone CTA, Zalo CTA
4. **Given** service detail page **When** rendered **Then** breadcrumb hiện: Home > Dịch vụ > [Service Name]
5. **Given** slug không tồn tại **When** trang load **Then** return 404 (notFound())
6. **Given** service detail page **Then** tất cả text dùng i18n translations từ next-intl (không hardcode)
7. **Given** service detail page **Then** có proper SEO metadata (title, description, og:image)

## Dependencies

**Story 5.1 & 5.2 (Services listing + ServiceCard):**
- Services page tại `/services` đã hoàn thành
- ServiceCard component navigates đến `/services/{slug}`

**Existing Components:**
- CTASection at `src/components/ui/CTASection.tsx` - reuse for contact CTA
- Breadcrumb at `src/components/ui/Breadcrumb.tsx` - reuse for navigation
- RichTextContent at `src/components/product/RichTextContent.tsx` - reuse for content rendering
- CheckCircleIcon at `src/components/layout/icons.tsx` (line 133-139) - for benefits list

**Services Collection (src/collections/Services.ts):**
- Fields: title, slug, excerpt, content (richText), featuredImage, benefits (array), order
- Access: publishedOnly (auto filters drafts)

## Tasks / Subtasks

- [x] Task 1: Create Service detail page (AC: #1, #4, #5, #6, #7)
  - [x] 1.1: Create file `src/app/(frontend)/[locale]/services/[slug]/page.tsx`
  - [x] 1.2: Define Props type: `{ params: Promise<{ locale: string; slug: string }> }`
  - [x] 1.3: Implement `generateMetadata`:
    ```typescript
    export async function generateMetadata({ params }: Props): Promise<Metadata> {
      const { locale, slug } = await params
      const payload = await getPayload({ config: await config })

      const { docs } = await payload.find({
        collection: 'services',
        where: { slug: { equals: slug } },
        limit: 1,
        locale: locale as Locale,
      })

      const service = docs[0]
      if (!service) {
        return { title: locale === 'vi' ? 'Không tìm thấy dịch vụ' : 'Service Not Found' }
      }

      const imageUrl = typeof service.featuredImage === 'object' && service.featuredImage
        ? service.featuredImage.sizes?.large?.url ?? service.featuredImage.url
        : null

      return {
        title: `${service.title} | VIES`,
        description: service.excerpt ?? undefined,
        openGraph: {
          title: service.title,
          description: service.excerpt ?? undefined,
          images: imageUrl ? [{ url: imageUrl }] : undefined,
        },
      }
    }
    ```
  - [x] 1.4: Fetch service by slug with depth: 1 (populate featuredImage)
  - [x] 1.5: Return notFound() if service doesn't exist
  - [x] 1.6: Add Breadcrumb: `[{ label: tNav('breadcrumb.services'), href: '/${locale}/services' }, { label: service.title }]`
  - [x] 1.7: Fetch SiteSettings for CTASection data

- [x] Task 2: Implement Hero Section (AC: #1)
  - [x] 2.1: Extract featuredImage URL and alt:
    ```typescript
    const imageUrl = typeof service.featuredImage === 'object' && service.featuredImage
      ? service.featuredImage.sizes?.large?.url ?? service.featuredImage.url
      : null
    const imageAlt = typeof service.featuredImage === 'object' && service.featuredImage
      ? service.featuredImage.alt || service.title
      : service.title
    ```
  - [x] 2.2: Render hero section with image (aspect-[21/9] or similar wide ratio)
  - [x] 2.3: Overlay title on hero or below hero based on UX

- [x] Task 3: Implement Content Section (AC: #1)
  - [x] 3.1: Import RichTextContent from `@/components/product/RichTextContent`
  - [x] 3.2: Render content with prose styling:
    ```tsx
    {service.content && (
      <section className="py-xl">
        <div className="mx-auto max-w-[var(--container-max)] px-md">
          <RichTextContent data={service.content} className="prose prose-gray max-w-none" />
        </div>
      </section>
    )}
    ```

- [x] Task 4: Implement Benefits List (AC: #2)
  - [x] 4.1: Import CheckCircleIcon from `@/components/layout/icons`
  - [x] 4.2: Check if benefits array exists and has items
  - [x] 4.3: Render benefits with checkmark bullets:
    ```tsx
    {service.benefits && service.benefits.length > 0 && (
      <section className="py-xl bg-gray-50">
        <div className="mx-auto max-w-[var(--container-max)] px-md">
          <h2 className="text-2xl font-semibold mb-lg">{t('benefits')}</h2>
          <ul className="space-y-md">
            {service.benefits.map((benefit, index) => (
              <li key={index} className="flex items-start gap-sm">
                <CheckCircleIcon className="w-6 h-6 text-success shrink-0 mt-0.5" />
                <span className="text-lg text-gray-700">{benefit.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    )}
    ```
  - [x] 4.4: Style: CheckCircleIcon in success green, text in gray-700

- [x] Task 5: Add CTASection (AC: #3)
  - [x] 5.1: Import CTASection from `@/components/ui/CTASection`
  - [x] 5.2: Fetch SiteSettings for phone and zalo data
  - [x] 5.3: Render CTASection at bottom:
    ```tsx
    <CTASection
      title={t('contactConsult')}
      subtitle={locale === 'vi'
        ? 'Đội ngũ kỹ thuật VIES sẵn sàng hỗ trợ bạn'
        : 'VIES technical team is ready to assist you'}
      phone={siteSettings.contact?.phone?.[0]?.number || '0908748304'}
      zaloLink={siteSettings.social?.zalo}
      callLabel={tCommon('callNow')}
      zaloLabel={tCommon('zaloChat')}
    />
    ```

- [x] Task 6: Build + verify (AC: all)
  - [x] 6.1: Chạy `pnpm build` — phải thành công
  - [x] 6.2: Test `/vi/services/{slug}` với valid service slug
  - [x] 6.3: Verify breadcrumb: Home > Dịch vụ > [Service Name]
  - [x] 6.4: Verify featuredImage renders correctly
  - [x] 6.5: Verify content (richText) renders
  - [x] 6.6: Verify benefits list with checkmarks
  - [x] 6.7: Verify CTASection with phone + Zalo
  - [x] 6.8: Test 404 with invalid slug
  - [x] 6.9: Test locale switching (vi/en)

## Dev Notes

### Architecture & Patterns

**File location:**
```
src/app/(frontend)/[locale]/services/[slug]/page.tsx   # NEW - Server Component
```

**Component architecture (per architecture.md Section 5.1):**
| Component | CMS Data Source | Client/Server |
|-----------|----------------|---------------|
| Service detail page | Services (with featuredImage, benefits) | Server |
| RichTextContent | Service.content | Client (has error boundary) |
| CTASection | SiteSettings.contact, SiteSettings.social | Server |

### Complete Implementation Pattern

```tsx
// src/app/(frontend)/[locale]/services/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'
import config from '@/payload.config'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { CTASection } from '@/components/ui/CTASection'
import { RichTextContent } from '@/components/product/RichTextContent'
import { CheckCircleIcon } from '@/components/layout/icons'
import type { Locale } from '@/i18n/config'

type Props = {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const payload = await getPayload({ config: await config })

  const { docs } = await payload.find({
    collection: 'services',
    where: { slug: { equals: slug } },
    limit: 1,
    locale: locale as Locale,
  })

  const service = docs[0]
  if (!service) {
    return { title: locale === 'vi' ? 'Không tìm thấy dịch vụ' : 'Service Not Found' }
  }

  const imageUrl =
    typeof service.featuredImage === 'object' && service.featuredImage
      ? service.featuredImage.sizes?.large?.url ?? service.featuredImage.url
      : null

  return {
    title: `${service.title} | VIES`,
    description: service.excerpt ?? undefined,
    openGraph: {
      title: service.title,
      description: service.excerpt ?? undefined,
      images: imageUrl ? [{ url: imageUrl }] : undefined,
    },
  }
}

export default async function ServiceDetailPage({ params }: Props) {
  const { locale, slug } = await params
  const payload = await getPayload({ config: await config })

  const t = await getTranslations({ locale, namespace: 'services' })
  const tNav = await getTranslations({ locale, namespace: 'nav' })
  const tCommon = await getTranslations({ locale, namespace: 'common' })

  // Fetch service by slug (publishedOnly handles draft filtering)
  const { docs } = await payload.find({
    collection: 'services',
    where: { slug: { equals: slug } },
    limit: 1,
    locale: locale as Locale,
    depth: 1, // Populate featuredImage
  })

  const service = docs[0]

  // 404 if not found
  if (!service) {
    notFound()
  }

  // Fetch site settings for CTA
  const siteSettings = await payload.findGlobal({
    slug: 'site-settings',
    locale: locale as Locale,
  })

  // Extract image data
  const imageUrl =
    typeof service.featuredImage === 'object' && service.featuredImage
      ? service.featuredImage.sizes?.large?.url ?? service.featuredImage.url
      : null
  const imageAlt =
    typeof service.featuredImage === 'object' && service.featuredImage
      ? service.featuredImage.alt || service.title
      : service.title

  const benefits = service.benefits ?? []

  return (
    <>
      {/* Breadcrumb: Home > Dịch vụ > [Service Name] */}
      <Breadcrumb
        items={[
          { label: tNav('breadcrumb.services'), href: `/${locale}/services` },
          { label: service.title },
        ]}
      />

      {/* Hero Section with Featured Image */}
      <section className="bg-white">
        {imageUrl && (
          <div className="w-full aspect-[21/9] md:aspect-[3/1] relative overflow-hidden">
            <img
              src={imageUrl}
              alt={imageAlt}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Title Section */}
        <div className="mx-auto max-w-[var(--container-max)] px-md py-lg md:py-xl">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            {service.title}
          </h1>
          {service.excerpt && (
            <p className="text-lg text-text-muted mt-md max-w-3xl">
              {service.excerpt}
            </p>
          )}
        </div>
      </section>

      {/* Content Section */}
      {service.content && (
        <section className="py-xl bg-white">
          <div className="mx-auto max-w-[var(--container-max)] px-md">
            <RichTextContent
              data={service.content}
              className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-li:text-gray-600"
            />
          </div>
        </section>
      )}

      {/* Benefits Section */}
      {benefits.length > 0 && (
        <section className="py-xl bg-gray-50">
          <div className="mx-auto max-w-[var(--container-max)] px-md">
            <h2 className="text-2xl font-semibold text-gray-900 mb-lg">
              {t('benefits')}
            </h2>
            <ul className="space-y-md">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-sm">
                  <CheckCircleIcon
                    className="w-6 h-6 text-success shrink-0 mt-0.5"
                    aria-hidden="true"
                  />
                  <span className="text-lg text-gray-700">{benefit.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <CTASection
        title={t('contactConsult')}
        subtitle={
          locale === 'vi'
            ? 'Đội ngũ kỹ thuật VIES sẵn sàng hỗ trợ bạn'
            : 'VIES technical team is ready to assist you'
        }
        phone={siteSettings.contact?.phone?.[0]?.number || '0908748304'}
        zaloLink={siteSettings.social?.zalo}
        callLabel={tCommon('callNow')}
        zaloLabel={tCommon('zaloChat')}
      />
    </>
  )
}
```

### Design Tokens Used (per architecture.md Section 8)

**Colors:**
- `bg-white` - Hero and content background
- `bg-gray-50` - Benefits section background
- `text-gray-900` - Headings
- `text-text-muted` (#6B7280) - Excerpt
- `text-gray-700` - Benefits text
- `text-success` (#059669) - Checkmark icons

**Spacing:**
- `px-md` (16px) - Container padding
- `py-lg` (24px) - Section padding mobile
- `py-xl` (32px) - Section padding desktop
- `mb-lg` (24px) - Title margin
- `gap-sm` (8px) - Benefit item gap
- `space-y-md` (16px) - Benefits list spacing

**Typography:**
- Page title: `text-3xl md:text-4xl font-bold`
- Section title: `text-2xl font-semibold`
- Excerpt: `text-lg text-text-muted`
- Benefit text: `text-lg text-gray-700`

**Layout:**
- Hero image: `aspect-[21/9] md:aspect-[3/1]` (wide banner)
- Container: `max-w-[var(--container-max)]` (1280px)
- Prose: `prose prose-gray max-w-none`

### Icons Required

From `src/components/layout/icons.tsx`:
- `CheckCircleIcon` (lines 133-139) - For benefits list checkmarks

**Verify export exists:**
```typescript
export function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}
```

### i18n Messages (already exist)

**vi.json:**
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

**en.json:**
```json
{
  "services": {
    "title": "Technical Services",
    "viewDetails": "View details",
    "benefits": "Benefits",
    "contactConsult": "Contact for consultation",
    "relatedServices": "Other services"
  }
}
```

### CTASection Props Interface

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

**From Story 5.1 (Services listing page):**
- Services fetched with `sort: 'order'`
- publishedOnly access handles draft filtering
- SiteSettings fetch pattern for CTA

**From Story 5.2 (ServiceCard):**
- Image extraction pattern: `service.featuredImage.sizes?.medium?.url ?? service.featuredImage.url`
- Link pattern: `/${locale}/services/${service.slug}`

**From Product detail page (src/app/(frontend)/[locale]/product/[slug]/page.tsx):**
- generateMetadata pattern with og:image
- notFound() for invalid slugs
- Breadcrumb with parent link
- RichTextContent with prose styling
- SiteSettings fetch for contact data

**From CTASection (Story 4.3):**
- Props: title, subtitle, phone, zaloLink, callLabel, zaloLabel
- Phone uses `formatTelHref()` internally
- Zalo link auto-generated if starts with number

### Git Intelligence

**Recent commits:**
- 3129a79: chore: update story 4-4 status to done
- b530add: fix(review): 4-4-toast-notification - address code review findings
- fe7d4e3: fix(review): 4-3-cta-section - address code review findings

**Patterns established:**
- Server Components for data-fetching pages
- i18n via getTranslations
- Design tokens usage consistent
- CTASection is stable component

### Testing Checklist

- [x] Page renders at `/{locale}/services/{slug}`
- [x] Breadcrumb shows: Home > Dịch vụ > [Service Name]
- [x] Featured image displays correctly (wide banner) - conditionally renders when present
- [x] Title and excerpt render
- [x] RichText content renders with prose styling
- [x] Benefits list shows with checkmark icons (when benefits exist)
- [x] CTASection renders with phone and Zalo buttons
- [x] 404 returns when slug doesn't exist
- [x] SEO metadata set (title, description, og:image)
- [x] Locale switching works (vi ↔ en)
- [x] Build passes: `pnpm build`

### Project Structure Notes

**Alignment with unified project structure:**
- Detail page in `src/app/(frontend)/[locale]/services/[slug]/`
- Follows product detail page pattern exactly
- Reuses existing components (CTASection, Breadcrumb, RichTextContent)
- Server Component for data fetching

**Files touched:**
- `src/app/(frontend)/[locale]/services/[slug]/page.tsx` (NEW)

**No i18n updates needed** - all required keys exist (services.benefits, services.contactConsult)

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 5.3 - Service detail page]
- [Source: _bmad-output/planning-artifacts/architecture.md#Section 3.2 - Services Collection]
- [Source: _bmad-output/planning-artifacts/architecture.md#Section 5.1 - Component Data Source Matrix]
- [Source: _bmad-output/planning-artifacts/architecture.md#Section 8 - Design Tokens]
- [Source: src/collections/Services.ts] - Collection schema (title, slug, content, featuredImage, benefits)
- [Source: src/components/ui/CTASection.tsx] - CTA component with phone/zalo
- [Source: src/components/ui/Breadcrumb.tsx] - Breadcrumb with auto Home link
- [Source: src/components/product/RichTextContent.tsx] - RichText with error boundary
- [Source: src/components/layout/icons.tsx#CheckCircleIcon] - Benefits checkmark icon
- [Source: src/app/(frontend)/[locale]/product/[slug]/page.tsx] - Detail page pattern reference
- [Source: _bmad-output/implementation-artifacts/5-1-services-listing-page.md] - Previous story context
- [Source: _bmad-output/implementation-artifacts/5-2-servicecard-component.md] - Previous story context

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

- Fixed type error: `zaloLink` prop needed `?? undefined` to handle null values from SiteSettings

### Completion Notes List

- Created Service detail page at `src/app/(frontend)/[locale]/services/[slug]/page.tsx`
- Implemented generateMetadata with SEO support (title, description, og:image)
- Added Breadcrumb: Home > Dịch vụ > [Service Name]
- Hero section with conditional featuredImage display (aspect-[21/9] md:aspect-[3/1])
- Title and excerpt rendering below hero
- RichTextContent section with prose styling
- Benefits list with CheckCircleIcon checkmarks in success green color
- CTASection with "Liên hệ tư vấn" title, phone and Zalo buttons
- 404 handling via notFound() for invalid slugs
- Full i18n support via next-intl (services, nav, common namespaces)
- Verified: build passes, vi/en locales work, 404 returns correctly

### File List

- `src/app/(frontend)/[locale]/services/[slug]/page.tsx` (NEW)
- `src/components/layout/icons.tsx` (MODIFIED - CheckCircleIcon accepts SVG props)
- `messages/vi.json` (MODIFIED - added services.contactSubtitle)
- `messages/en.json` (MODIFIED - added services.contactSubtitle)

### Code Review Fixes Applied

- **HIGH**: AC#6 violation - hardcoded CTA subtitle → replaced with i18n key `t('contactSubtitle')` (page.tsx)
- **MEDIUM**: CheckCircleIcon ignored aria-hidden prop → updated to accept SVGProps (icons.tsx)
- **MEDIUM**: Hero image used native `<img>` → replaced with `next/image` with priority & fill props (page.tsx)

## Change Log

| Date | Change Description |
|------|-------------------|
| 2026-02-05 | Initial implementation of Service detail page - all ACs satisfied |
| 2026-02-05 | Code review: Fixed AC#6 (i18n), CheckCircleIcon props, replaced img with next/image |
