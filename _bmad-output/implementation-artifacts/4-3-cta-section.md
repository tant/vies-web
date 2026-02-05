# Story 4.3: CTASection component

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a khách hàng,
I want clear call-to-action sections throughout the site,
So that I always know how to contact VIES.

## Acceptance Criteria

1. **Given** CTASection component nhận contact data via props **When** render **Then** hiện heading: "Cần tư vấn hoặc báo giá?" (localized)
2. **Given** CTASection component **When** render **Then** nút gọi điện (tel: link, amber/accent style, primary CTA)
3. **Given** CTASection component **When** render **Then** nút Zalo (link, white/transparent style, secondary CTA)
4. **Given** CTASection component **When** render **Then** background steel blue (`--color-primary`) with white text
5. **Given** CTASection component **When** render **Then** Server Component, data passed via props from parent
6. **Given** homepage page.tsx **When** refactored **Then** uses CTASection component instead of inline CTA section
7. **Given** service detail pages **When** CTASection used **Then** component renders correctly with passed props

## Dependencies

**Story 4.1 (QuoteRequestForm)** và **Story 4.2 (Contact Page)** established form/contact patterns in this epic.

**Homepage (page.tsx)** currently has inline CTA section (lines 183-210) that should be refactored to use this component.

**Existing translations** đã có sẵn trong messages/vi.json và messages/en.json:
- `home.ctaTitle`: "Cần tư vấn hoặc báo giá?"
- `home.ctaSubtitle`: "Đội ngũ kỹ thuật của VIES luôn sẵn sàng hỗ trợ bạn."
- `common.callNow`: "Gọi ngay"
- `common.zaloChat`: "Chat Zalo"

## Tasks / Subtasks

- [x] Task 1: Tạo CTASection component (AC: #1, #2, #3, #4, #5)
  - [x] 1.1: Tạo file `src/components/ui/CTASection.tsx` (Server Component)
  - [x] 1.2: Props interface:
    ```typescript
    interface CTASectionProps {
      title: string
      subtitle?: string
      phone: string           // Primary phone number for call CTA
      zaloLink?: string       // Zalo link (optional, falls back to phone-based zalo.me URL)
      callLabel: string       // "Gọi ngay" / "Call now"
      zaloLabel: string       // "Chat Zalo"
      className?: string      // Optional additional classes
    }
    ```
  - [x] 1.3: Layout structure:
    - Section with `bg-primary text-white py-16 lg:py-20`
    - Container with `max-w-[var(--container-max)] mx-auto px-4 text-center`
    - H2 heading for title (font-bold, 2xl md:3xl)
    - P paragraph for subtitle (text-white/80, mb-8)
    - Flex container for buttons (justify-center, gap-4, flex-wrap)
  - [x] 1.4: Phone button:
    - `<a href={tel:...}>` with formatted phone number (using formatTelHref utility)
    - Amber/accent background (`bg-accent hover:bg-accent/90`)
    - Dark text (`text-text`) for contrast on amber
    - Rounded-lg, font-semibold, px-6 py-3
    - PhoneIcon (w-5 h-5) before label
    - Focus-visible ring styling
  - [x] 1.5: Zalo button:
    - `<a href={zaloLink}>` with target="_blank" rel="noopener noreferrer"
    - White transparent background (`bg-white/20 hover:bg-white/30`)
    - White text
    - Same sizing as phone button
    - Focus-visible ring styling
  - [x] 1.6: Zalo link fallback: if not provided, generate from phone: `https://zalo.me/${phone.replace(/\D/g, '')}`
  - [x] 1.7: Accessibility:
    - Semantic section element with role="region" aria-labelledby
    - Heading with id for aria-labelledby
    - Links have accessible names via label text + icon aria-hidden

- [x] Task 2: Refactor Homepage to use CTASection (AC: #6)
  - [x] 2.1: Update `src/app/(frontend)/[locale]/page.tsx`
  - [x] 2.2: Import CTASection component
  - [x] 2.3: Replace inline CTA section (lines 183-210) with CTASection component
  - [x] 2.4: Pass required props: title, subtitle, phone, zaloLink, callLabel, zaloLabel
  - [x] 2.5: Props values from existing t() calls + siteSettings data

- [x] Task 3: Build + verify (AC: all)
  - [x] 3.1: Chạy `pnpm build` — phải thành công
  - [x] 3.2: Verify homepage CTA section renders identically as before refactor
  - [x] 3.3: Verify phone button has correct tel: link
  - [x] 3.4: Verify Zalo button opens in new tab
  - [x] 3.5: Test responsive: buttons stack on very small mobile screens
  - [x] 3.6: Test i18n: labels change when switching to EN locale
  - [x] 3.7: Test keyboard navigation: both buttons focusable with visible focus rings

## Dev Notes

### Architecture & Patterns

**File locations:**
```
src/components/ui/CTASection.tsx               # NEW - Server Component
src/app/(frontend)/[locale]/page.tsx           # UPDATE - refactor to use component
```

**Component architecture (per architecture.md Section 5.1):**
- CTASection: Server Component (no client interactivity needed)
- Data passed via props from parent page (which fetches SiteSettings)

**Current inline CTA (to be refactored) in homepage:**
```tsx
{/* CTA Section - lines 183-210 in page.tsx */}
<section className="py-16 lg:py-20 bg-primary text-white">
  <div className="container mx-auto px-4 text-center">
    <h2 className="text-2xl md:text-3xl font-bold mb-4">
      {t('ctaTitle')}
    </h2>
    <p className="text-white/80 mb-8 max-w-2xl mx-auto">
      {t('ctaSubtitle')}
    </p>
    <div className="flex flex-wrap justify-center gap-4">
      <a
        href={`tel:${primaryPhone.startsWith('+') ? primaryPhone : `+84${primaryPhone.replace(/^0/, '')}`}`}
        className="bg-accent hover:bg-accent/90 text-text px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
      >
        <PhoneIcon className="w-5 h-5" aria-hidden="true" />
        {tCommon('callNow')}
      </a>
      <a
        href={zaloLink.startsWith('http') ? zaloLink : `https://zalo.me/${zaloLink}`}
        className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
        target="_blank"
        rel="noopener noreferrer"
      >
        {tCommon('zaloChat')}
      </a>
    </div>
  </div>
</section>
```

### CTASection Component Implementation Pattern

```tsx
// src/components/ui/CTASection.tsx
import { PhoneIcon } from '@/components/layout/icons'
import { formatTelHref } from '@/lib/utils'

interface CTASectionProps {
  title: string
  subtitle?: string
  phone: string
  zaloLink?: string
  callLabel: string
  zaloLabel: string
  className?: string
}

export function CTASection({
  title,
  subtitle,
  phone,
  zaloLink,
  callLabel,
  zaloLabel,
  className = '',
}: CTASectionProps) {
  // Generate Zalo link from phone if not provided
  const finalZaloLink = zaloLink?.startsWith('http')
    ? zaloLink
    : zaloLink
      ? `https://zalo.me/${zaloLink}`
      : `https://zalo.me/${phone.replace(/\D/g, '')}`

  const headingId = 'cta-section-heading'

  return (
    <section
      className={`py-16 lg:py-20 bg-primary text-white ${className}`}
      role="region"
      aria-labelledby={headingId}
    >
      <div className="mx-auto max-w-[var(--container-max)] px-4 text-center">
        <h2
          id={headingId}
          className="text-2xl md:text-3xl font-bold mb-4"
        >
          {title}
        </h2>
        {subtitle && (
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-4">
          {/* Phone CTA - Primary (Amber) */}
          <a
            href={formatTelHref(phone)}
            className="bg-accent hover:bg-accent/90 text-text px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
          >
            <PhoneIcon className="w-5 h-5" aria-hidden="true" />
            {callLabel}
          </a>

          {/* Zalo CTA - Secondary (Transparent White) */}
          <a
            href={finalZaloLink}
            className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            {zaloLabel}
          </a>
        </div>
      </div>
    </section>
  )
}
```

### Homepage Refactor Pattern

```tsx
// In src/app/(frontend)/[locale]/page.tsx
import { CTASection } from '@/components/ui/CTASection'

// ... existing code ...

// Replace inline CTA section with:
<CTASection
  title={t('ctaTitle')}
  subtitle={t('ctaSubtitle')}
  phone={primaryPhone}
  zaloLink={zaloLink}
  callLabel={tCommon('callNow')}
  zaloLabel={tCommon('zaloChat')}
/>
```

### Phone Formatting Utility

**Existing utility in `src/lib/utils.ts`:**
```typescript
export function formatTelHref(phone: string): string {
  // Remove non-digits
  const digits = phone.replace(/\D/g, '')

  // Vietnamese numbers starting with 0 → +84
  if (digits.startsWith('0')) {
    return `tel:+84${digits.slice(1)}`
  }

  // Already has country code or other format
  return `tel:${digits}`
}
```

### Design Tokens (per architecture.md Section 8)

**Colors used:**
- `--color-primary`: #0F4C75 (steel blue) - Section background
- `--color-accent`: #D4A843 (amber) - Primary CTA button
- `--color-text`: #1A1A2E - Text on amber button for contrast
- White (#FFFFFF) - Secondary button, text on primary background

**Spacing:**
- Section padding: py-16 lg:py-20 (64px mobile, 80px desktop)
- Container: max-w-[var(--container-max)] (1280px)
- Button padding: px-6 py-3
- Button gap: gap-4 (16px)
- Margin bottom heading: mb-4, subtitle: mb-8

### i18n Keys (already exist)

**Namespace: `home`**
```json
{
  "ctaTitle": "Cần tư vấn hoặc báo giá?",
  "ctaSubtitle": "Đội ngũ kỹ thuật của VIES luôn sẵn sàng hỗ trợ bạn."
}
```

**Namespace: `common`**
```json
{
  "callNow": "Gọi ngay",
  "zaloChat": "Chat Zalo"
}
```

### Accessibility Requirements

- Section has role="region" with aria-labelledby referencing heading
- Heading has id for aria-labelledby reference
- PhoneIcon has aria-hidden="true" (decorative)
- Links have visible text labels (no icon-only buttons)
- Focus-visible rings on both buttons
- External Zalo link has target="_blank" with rel="noopener noreferrer"
- Color contrast: white text on steel blue passes WCAG AA (ratio ~7:1)
- Color contrast: dark text on amber passes WCAG AA

### Previous Story Intelligence (from 4.1, 4.2)

**Learnings:**
- `formatTelHref` utility exists in `src/lib/utils.ts` - reuse it
- Phone/contact patterns established
- Server Component pattern works well for static display components

**Patterns to reuse:**
- formatTelHref for phone links
- Icon imports from `@/components/layout/icons`
- Container max-width pattern: `max-w-[var(--container-max)]`

### Git Intelligence

**Recent commits:**
- 4456b76: Fix Homepage hero layout (homepage structure)
- 329b1b4: Add Homepage hero with search-first layout (CTA section added inline)

**Files affected by this story:**
- `src/components/ui/CTASection.tsx` (new)
- `src/app/(frontend)/[locale]/page.tsx` (refactor inline CTA)

### Future Usage (per epics.md)

CTASection will be used on:
- Homepage (Story 3.10 - refactor)
- Service detail pages (Story 5.3)
- Potentially contact page (Story 4.2 already has contact info)

### Testing Checklist

- [x] CTASection component renders with all props
- [x] Title and subtitle display correctly
- [x] Phone button has correct tel: href format (+84...)
- [x] Phone button opens phone app on mobile
- [x] Zalo button opens in new tab
- [x] Zalo link fallback works when only phone provided
- [x] Homepage CTA section looks identical after refactor
- [x] Responsive: buttons wrap on small screens
- [x] i18n: labels change when switching to EN
- [x] Keyboard: both buttons focusable
- [x] Focus rings visible on both buttons
- [x] Build passes: `pnpm build`

### Project Structure Notes

**Alignment with unified project structure:**
- Component in `src/components/ui/` following existing convention
- Server Component (no 'use client' directive)
- Props-based data passing from parent

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 4.3 - CTASection component]
- [Source: _bmad-output/planning-artifacts/architecture.md#Section 5.1 - Component ↔ Data Source Matrix]
- [Source: _bmad-output/planning-artifacts/architecture.md#Section 7 - Project Structure]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Component Strategy]
- [Source: _bmad-output/planning-artifacts/prd.md#HP-06 - CTA section]
- [Source: _bmad-output/planning-artifacts/prd.md#SV-03 - Service page CTA]
- [Source: src/app/(frontend)/[locale]/page.tsx#lines 183-210 - Current inline CTA]
- [Source: src/components/layout/icons.tsx - PhoneIcon]
- [Source: src/lib/utils.ts - formatTelHref utility]
- [Source: messages/vi.json#home.ctaTitle - Existing i18n keys]
- [Source: messages/en.json#common.callNow - Existing i18n keys]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

N/A - Implementation proceeded without issues.

### Completion Notes List

- Created reusable CTASection Server Component with props-based configuration
- Component uses formatTelHref utility for consistent phone number formatting
- Accessibility implemented: role="region", aria-labelledby, PhoneIcon aria-hidden
- Zalo link fallback generates URL from phone when not explicitly provided
- Refactored homepage to use new component, reducing inline code significantly
- Build passes successfully with no type errors
- Visual verification confirmed identical rendering in both VI and EN locales
- All acceptance criteria met (AC #1-#7)

### File List

- `src/components/ui/CTASection.tsx` (NEW)
- `src/app/(frontend)/[locale]/page.tsx` (MODIFIED)

### Code Review Fixes Applied
- MEDIUM: Duplicate ID accessibility violation → Fixed using React `useId()` hook for unique heading IDs (CTASection.tsx:2,24)
- MEDIUM: Story documentation specified non-existent `px-md` → Updated to correct `px-4` in documentation
- LOW: Whitespace-only zaloLink edge case → Added `.trim()` to zaloLink handling (CTASection.tsx:27)

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-02-05 | Code review fixes: useId() for a11y, trim() for zaloLink edge case | Code Review |
| 2026-02-05 | Implemented CTASection component and refactored homepage | Dev Agent |
