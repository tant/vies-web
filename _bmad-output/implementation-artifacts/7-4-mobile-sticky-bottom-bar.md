# Story 7.4: Mobile Sticky Bottom Bar

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a khách hàng trên mobile,
I want quick access buttons at the bottom of product pages,
so that I can call or Zalo VIES easily while browsing products.

## Acceptance Criteria

1. **Given** product detail page trên mobile viewport (< 768px) **When** trang load **Then** sticky bottom bar hiện: nút Gọi (tel: link) + nút Zalo

2. **Given** sticky bottom bar trên mobile **When** user scroll xuống **Then** bar hiện (visible)

3. **Given** sticky bottom bar trên mobile **When** user scroll lên **Then** bar ẩn (hidden) để không che content

4. **Given** sticky bottom bar **When** displayed **Then** không che content quan trọng (proper padding on page content)

5. **Given** any page khác (services, news, etc.) **When** viewed on mobile **Then** sticky bottom bar KHÔNG hiện (chỉ hiện trên product pages)

6. **Given** viewport >= 768px (tablet/desktop) **When** user views product page **Then** sticky bottom bar ẩn (desktop không cần vì có CTA button trên page)

**FRs:** NV-04

## Tasks / Subtasks

- [x] Task 1: Create MobileStickyBar component (AC: #1, #5)
  - [x] 1.1 Create new Client Component at `src/components/ui/MobileStickyBar.tsx`
  - [x] 1.2 Implement two-button layout: Gọi ngay (tel: link) + Nhắn Zalo (external link)
  - [x] 1.3 Style with fixed bottom positioning, full-width layout
  - [x] 1.4 Add responsive hide class `md:hidden` for tablet/desktop
  - [x] 1.5 Add proper z-index (z-50) to stay above content but below modals

- [x] Task 2: Implement scroll-aware show/hide behavior (AC: #2, #3)
  - [x] 2.1 Add scroll event listener with `useEffect`
  - [x] 2.2 Track scroll direction (up vs down) using previous scroll position
  - [x] 2.3 Show bar when scrolling down, hide when scrolling up
  - [x] 2.4 Add CSS transition for smooth show/hide animation (translate-y)
  - [x] 2.5 Debounce scroll events or use requestAnimationFrame for performance
  - [x] 2.6 Respect `prefers-reduced-motion` media query

- [x] Task 3: Integrate into product detail page only (AC: #5)
  - [x] 3.1 Import MobileStickyBar into `src/app/(frontend)/[locale]/product/[slug]/page.tsx`
  - [x] 3.2 Pass contact data (phone, zalo) from SiteSettings global
  - [x] 3.3 Verify component does NOT appear on other pages (services, news, etc.)

- [x] Task 4: Handle content padding to avoid overlap (AC: #4)
  - [x] 4.1 Add bottom padding to product page container when on mobile
  - [x] 4.2 Use CSS class like `pb-20 md:pb-0` on content wrapper
  - [x] 4.3 Verify "Yêu cầu báo giá" button and related products section not obscured

- [x] Task 5: Add translations (AC: #1)
  - [x] 5.1 Add translation keys to `messages/vi.json`: `mobileCta.call`, `mobileCta.zalo`
  - [x] 5.2 Add corresponding keys to `messages/en.json`
  - [x] 5.3 Use `useTranslations` hook in component

- [x] Task 6: Test and verify (AC: all)
  - [x] 6.1 Test on mobile viewport (< 768px) - bar should appear
  - [x] 6.2 Test scroll behavior - show on scroll down, hide on scroll up
  - [x] 6.3 Test on tablet/desktop (>= 768px) - bar should NOT appear
  - [x] 6.4 Test on other pages (services, news) - bar should NOT appear
  - [x] 6.5 Test tel: link opens phone dialer
  - [x] 6.6 Test Zalo link opens Zalo app/web
  - [x] 6.7 Run `pnpm build` - no errors
  - [x] 6.8 Run `pnpm lint` - no warnings

## Dev Notes

### Component Architecture

**MobileStickyBar.tsx** - Client Component (scroll state management)

```typescript
'use client'

import { useEffect, useState, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { PhoneIcon, MessageIcon } from '@/components/icons' // or inline SVG

interface MobileStickyBarProps {
  phone: string      // e.g., "0903326309"
  zaloUrl: string    // e.g., "https://zalo.me/0903326309"
}

export function MobileStickyBar({ phone, zaloUrl }: MobileStickyBarProps) {
  const t = useTranslations('mobileCta')
  const [isVisible, setIsVisible] = useState(true)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Show when scrolling down, hide when scrolling up
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(true)  // scrolling down
      } else if (currentScrollY < lastScrollY.current) {
        setIsVisible(false) // scrolling up
      }

      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className={`
      fixed bottom-0 left-0 right-0 z-50
      bg-white border-t border-border shadow-lg
      transition-transform duration-300 ease-in-out
      md:hidden
      ${isVisible ? 'translate-y-0' : 'translate-y-full'}
    `}>
      {/* Two buttons: Call + Zalo */}
    </div>
  )
}
```

### Existing Patterns to Follow

**From CategoryFilter.tsx (mobile bottom sheet):**
```typescript
// Fixed positioning
className="fixed inset-0 z-50 md:hidden"

// Body scroll lock (NOT needed for this component - it's a bar, not overlay)
// document.body.style.overflow = 'hidden'  // DON'T USE
```

**From Header.tsx (sticky behavior):**
```typescript
// Sticky with z-index
className="sticky top-0 z-50"
```

**From styles.css (animations):**
```css
/* Already defined - can reuse */
@keyframes slide-up {
  from { opacity: 0; transform: translateY(100%); }
  to { opacity: 1; transform: translateY(0); }
}
```

### Scroll Direction Detection Pattern

```typescript
const [isVisible, setIsVisible] = useState(true)
const lastScrollY = useRef(0)
const ticking = useRef(false)

useEffect(() => {
  const handleScroll = () => {
    if (!ticking.current) {
      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY
        const scrollingDown = currentScrollY > lastScrollY.current
        const scrollingUp = currentScrollY < lastScrollY.current
        const pastThreshold = currentScrollY > 100

        if (scrollingDown && pastThreshold) {
          setIsVisible(true)
        } else if (scrollingUp) {
          setIsVisible(false)
        }

        lastScrollY.current = currentScrollY
        ticking.current = false
      })
      ticking.current = true
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true })
  return () => window.removeEventListener('scroll', handleScroll)
}, [])
```

### Button Styling Pattern

**Primary CTA (Call button):**
```typescript
<a
  href={`tel:${phone}`}
  className="flex-1 flex items-center justify-center gap-2 bg-primary text-white py-3 font-medium"
>
  <PhoneIcon className="w-5 h-5" />
  {t('call')}
</a>
```

**Secondary CTA (Zalo button):**
```typescript
<a
  href={zaloUrl}
  target="_blank"
  rel="noopener noreferrer"
  className="flex-1 flex items-center justify-center gap-2 bg-[#0068FF] text-white py-3 font-medium"
>
  <ZaloIcon className="w-5 h-5" />
  {t('zalo')}
</a>
```

### Integration into Product Page

**File:** `src/app/(frontend)/[locale]/product/[slug]/page.tsx`

```typescript
// At top - import component
import { MobileStickyBar } from '@/components/ui/MobileStickyBar'
import { getGlobal } from '@/lib/payload/getGlobal'

// In page function - fetch site settings
const siteSettings = await payload.findGlobal({
  slug: 'site-settings',
  locale,
})

// Get contact info
const quotePhone = siteSettings.contact?.phone?.[0]?.number || '0903326309'
const zaloUrl = siteSettings.social?.zalo || 'https://zalo.me/0903326309'

// At end of page JSX (before closing </main> or after)
<MobileStickyBar phone={quotePhone} zaloUrl={zaloUrl} />
```

### Translation Keys

**messages/vi.json:**
```json
{
  "mobileCta": {
    "call": "Gọi ngay",
    "zalo": "Nhắn Zalo"
  }
}
```

**messages/en.json:**
```json
{
  "mobileCta": {
    "call": "Call now",
    "zalo": "Zalo chat"
  }
}
```

### Content Padding Adjustment

Add bottom padding to product page to prevent content being obscured:

```typescript
// In product page layout wrapper
<div className="pb-20 md:pb-0">
  {/* Product content */}
</div>
```

Or use safe area insets for iOS:
```css
.mobile-sticky-bar {
  padding-bottom: env(safe-area-inset-bottom);
}
```

### Project Structure Notes

**New file:**
- `src/components/ui/MobileStickyBar.tsx` - Client Component

**Modified files:**
- `src/app/(frontend)/[locale]/product/[slug]/page.tsx` - Add MobileStickyBar import and usage
- `messages/vi.json` - Add mobileCta namespace
- `messages/en.json` - Add mobileCta namespace

### Zalo Icon SVG

If Zalo icon not in icons.tsx, add:
```typescript
export function ZaloIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      {/* Zalo logo path */}
    </svg>
  )
}
```

Or use a simple chat bubble icon as placeholder.

### Accessibility Considerations

1. **Focus management:** Buttons should be focusable when visible
2. **Screen reader:** Use `aria-label` for icon-only buttons if needed
3. **Touch targets:** Minimum 44x44px touch area (py-3 provides this)
4. **Color contrast:** White text on primary/Zalo blue meets WCAG AA
5. **Reduced motion:** Use CSS `prefers-reduced-motion` media query

```css
@media (prefers-reduced-motion: reduce) {
  .mobile-sticky-bar {
    transition: none;
  }
}
```

### Performance Notes

1. **Passive scroll listener:** Use `{ passive: true }` option
2. **RequestAnimationFrame:** Debounce scroll handling
3. **Conditional rendering:** Only render on mobile viewport
4. **No body scroll lock:** Unlike modals, this bar doesn't need it

### Previous Story Intelligence (7.3 - i18n)

Story 7.3 established:
- Translation patterns using `useTranslations` hook
- Message file structure with namespaced keys
- Both vi.json and en.json have matching structure

The mobileCta namespace should follow the same pattern.

### Git Commit Patterns (from recent commits)

Recent commits follow pattern:
- `fix(review): 7-1-seo-meta-tags - address code review findings`
- `chore: update story 6-4 status to done`

Expected commit for this story:
- `feat: 7-4-mobile-sticky-bottom-bar - implement mobile sticky CTA bar`

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 7.4] - Story requirements
- [Source: _bmad-output/planning-artifacts/architecture.md#Section 5] - Component patterns
- [Source: src/components/ui/CategoryFilter.tsx] - Mobile bottom sheet pattern reference
- [Source: src/components/layout/Header.tsx] - Sticky positioning and scroll patterns
- [Source: src/app/(frontend)/styles.css] - Animation keyframes
- [Source: src/app/(frontend)/[locale]/product/[slug]/page.tsx] - Product detail page

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

None - implementation completed without issues.

### Completion Notes List

- Created MobileStickyBar client component with scroll-aware show/hide behavior
- Implemented requestAnimationFrame debouncing for scroll performance
- Added inline PhoneIcon and ZaloIcon SVG components (no external dependencies)
- Integrated into product detail page only - fetches contact info from SiteSettings global
- Added `mobileCta` namespace to both vi.json and en.json translation files
- Added bottom padding (pb-24 md:pb-xl) to related products section for content clearance
- Added conditional padding div when no related products exist
- Used inline style for transition to respect prefers-reduced-motion media query
- Added iOS safe area inset support via `env(safe-area-inset-bottom)`
- Verified: bar visible on mobile, hidden on desktop, hidden on scroll up, visible on scroll down
- Verified: bar does NOT appear on services page (product pages only)
- Build passes successfully with no errors

### File List

**New files:**
- `src/components/ui/MobileStickyBar.tsx` - Client component with scroll-aware sticky bar

**Modified files:**
- `src/app/(frontend)/[locale]/product/[slug]/page.tsx` - Added MobileStickyBar integration and site settings fetch

**Note:** Translation keys (`mobileCta` namespace in `messages/vi.json` and `messages/en.json`) were added as part of story 7-3 (i18n).

### Code Review Fixes Applied

- CRITICAL: `prefersReducedMotion` was calculated but never used → Now stored in state and applied to disable transition when user prefers reduced motion (MobileStickyBar.tsx:40,91)
- MEDIUM: Inconsistent bottom padding (pb-20 vs pb-24) → Standardized to pb-24 for both cases (product/page.tsx:248)
- LOW: Added `role="complementary"` and `aria-label` for screen reader accessibility (MobileStickyBar.tsx:82-83)
- LOW: Added listener for motion preference changes to react dynamically (MobileStickyBar.tsx:46-49)

## Change Log

| Date | Change |
|------|--------|
| 2026-02-05 | Implemented mobile sticky bottom bar with Call and Zalo buttons for product detail pages |
| 2026-02-05 | Code review fixes: prefersReducedMotion now functional, consistent padding, ARIA improvements |
