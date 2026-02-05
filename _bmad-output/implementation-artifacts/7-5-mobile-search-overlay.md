# Story 7.5: Mobile Search Overlay

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a khách hàng trên mobile,
I want a full-screen search experience,
so that I can easily search on my phone.

## Acceptance Criteria

1. **Given** mobile viewport (< 768px) **When** user tap search icon trên header **Then** full-screen search overlay mở ra

2. **Given** mobile search overlay đang mở **When** overlay appears **Then** auto-focus vào input field

3. **Given** mobile search overlay đang mở **When** user types search query **Then** autocomplete dropdown hiện full-width

4. **Given** mobile search overlay đang mở **When** user tap close button hoặc press Escape **Then** overlay đóng với smooth animation

5. **Given** mobile search overlay đang mở **When** user selects a search result **Then** overlay đóng và navigate to product page

6. **Given** mobile search overlay **When** opening/closing **Then** smooth slide-up/slide-down animation (prefers-reduced-motion respected)

7. **Given** viewport >= 768px (tablet/desktop) **When** user clicks search icon **Then** search overlay KHÔNG hiện (sử dụng inline SearchBar như hiện tại)

**FRs:** SR-07

## Tasks / Subtasks

- [x] Task 1: Create MobileSearchOverlay component (AC: #1, #2, #6)
  - [x] 1.1 Create new Client Component at `src/components/ui/MobileSearchOverlay.tsx`
  - [x] 1.2 Implement full-screen fixed overlay (`fixed inset-0 z-60 bg-white`)
  - [x] 1.3 Add header section with close button and title
  - [x] 1.4 Integrate search input from existing SearchBar logic
  - [x] 1.5 Add slide-up animation using CSS transitions
  - [x] 1.6 Implement auto-focus on input when overlay opens
  - [x] 1.7 Respect `prefers-reduced-motion` media query

- [x] Task 2: Implement full-width autocomplete dropdown (AC: #3)
  - [x] 2.1 Reuse or adapt SearchBar autocomplete logic
  - [x] 2.2 Style dropdown to be full-width within overlay
  - [x] 2.3 Ensure results display correctly on small screens
  - [x] 2.4 Handle no-results state with contact CTA

- [x] Task 3: Implement close behavior (AC: #4, #5)
  - [x] 3.1 Add close button (X icon) in header
  - [x] 3.2 Add Escape key handler to close overlay
  - [x] 3.3 Close overlay when user selects a search result
  - [x] 3.4 Close overlay when user taps "View all results"
  - [x] 3.5 Add slide-down animation when closing

- [x] Task 4: Integrate with Header component (AC: #1, #7)
  - [x] 4.1 Update Header.tsx to replace `mobileSearchOpen` toggle with MobileSearchOverlay
  - [x] 4.2 Remove existing inline mobile search bar (`mobileSearchOpen && ...`)
  - [x] 4.3 Pass necessary props (consultPhone, onClose)
  - [x] 4.4 Ensure desktop/tablet continues using inline SearchBar

- [x] Task 5: Body scroll lock and focus management (AC: #1, #2)
  - [x] 5.1 Lock body scroll when overlay is open
  - [x] 5.2 Implement focus trap within overlay
  - [x] 5.3 Restore focus to search icon when overlay closes

- [x] Task 6: Add translations (AC: all)
  - [x] 6.1 Add `search.mobileOverlay.title` to messages/vi.json
  - [x] 6.2 Add `search.mobileOverlay.close` to messages/vi.json
  - [x] 6.3 Add corresponding keys to messages/en.json

- [x] Task 7: Test and verify (AC: all)
  - [x] 7.1 Test on mobile viewport - overlay should open full-screen
  - [x] 7.2 Test auto-focus - input should be focused immediately
  - [x] 7.3 Test autocomplete - results should display full-width
  - [x] 7.4 Test close button and Escape key
  - [x] 7.5 Test result selection - should close and navigate
  - [x] 7.6 Test on tablet/desktop - overlay should NOT appear
  - [x] 7.7 Test animations with reduced-motion preference
  - [x] 7.8 Run `pnpm build` - no errors
  - [x] 7.9 Run `pnpm lint` - no warnings (ESLint config has pre-existing issue)

## Dev Notes

### Current Search Implementation Analysis

**Existing SearchBar.tsx** (`src/components/ui/SearchBar.tsx`):
- Client Component with full autocomplete logic
- Two variants: `hero` (large) and `header` (compact)
- Debounced search (300ms) with AbortController
- Keyboard navigation: Arrow keys, Enter, Escape
- ARIA combobox pattern for accessibility
- Loading states and no-results handling
- Props: `variant`, `className`, `consultPhone`

**Current Header.tsx mobile search** (`src/components/layout/Header.tsx`):
- Has `mobileSearchOpen` state (line 79)
- Toggle button (lines 191-196)
- Shows inline SearchBar below header when open (lines 211-215)
- This is NOT a full-screen overlay - just a dropdown

**Key insight:** The current implementation is a simple toggle that shows/hides the SearchBar below the header. Story 7.5 requires replacing this with a full-screen overlay experience.

### Component Architecture

**MobileSearchOverlay.tsx** - New Client Component

```typescript
'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { SearchIcon, XIcon, GearIcon } from '@/components/layout/icons'

interface MobileSearchOverlayProps {
  isOpen: boolean
  onClose: () => void
  consultPhone?: string
}

export function MobileSearchOverlay({ isOpen, onClose, consultPhone }: MobileSearchOverlayProps) {
  const t = useTranslations('search')
  const locale = useLocale()
  const router = useRouter()

  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  // ... search logic similar to SearchBar

  // Auto-focus when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      // Small delay for animation to start
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }
    return () => document.body.classList.remove('overflow-hidden')
  }, [isOpen])

  // Escape key handler
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[60] bg-white flex flex-col animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between px-md py-3 border-b border-border">
        <h2 className="font-medium text-text">{t('mobileOverlay.title')}</h2>
        <button
          onClick={onClose}
          className="p-2 -mr-2 rounded-lg hover:bg-gray-100"
          aria-label={t('mobileOverlay.close')}
        >
          <XIcon className="w-6 h-6" />
        </button>
      </div>

      {/* Search input */}
      <div className="px-md py-3">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input
            ref={inputRef}
            type="text"
            placeholder={t('placeholderHero')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-border rounded-lg text-text"
          />
        </div>
      </div>

      {/* Results - full width */}
      <div className="flex-1 overflow-y-auto">
        {/* ... results rendering */}
      </div>
    </div>
  )
}
```

### Search Logic Reuse Strategy

**Option A: Duplicate logic in MobileSearchOverlay** (simpler)
- Copy search state/effects from SearchBar
- Allows customization specific to mobile overlay

**Option B: Extract shared hook** (cleaner, more complex)
- Create `useSearch` hook with all search logic
- Both SearchBar and MobileSearchOverlay use the hook

**Recommendation:** Option A for initial implementation - duplicate logic. Can refactor to shared hook later if needed. The search logic is about 50 lines and keeping components self-contained is clearer.

### Header.tsx Modifications

```typescript
// BEFORE (current)
const [mobileSearchOpen, setMobileSearchOpen] = useState(false)

// Mobile search bar
{mobileSearchOpen && (
  <div className="lg:hidden border-t border-border px-md py-2 bg-white">
    <SearchBar variant="header" className="w-full" />
  </div>
)}

// AFTER (with overlay)
const [mobileSearchOpen, setMobileSearchOpen] = useState(false)

// Remove the inline search bar
// Add MobileSearchOverlay at end of component

// Inside JSX, before closing </header>
<MobileSearchOverlay
  isOpen={mobileSearchOpen}
  onClose={() => setMobileSearchOpen(false)}
  consultPhone={phones[1]?.number ?? phones[0]?.number}
/>
```

### Animation CSS

Add to `src/app/(frontend)/styles.css` if not already present:

```css
@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(100%);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-up {
  animation: slide-up 0.3s ease-out forwards;
}

@media (prefers-reduced-motion: reduce) {
  .animate-slide-up {
    animation: none;
  }
}
```

### Translation Keys

**messages/vi.json additions:**
```json
{
  "search": {
    "mobileOverlay": {
      "title": "Tìm kiếm sản phẩm",
      "close": "Đóng tìm kiếm"
    }
  }
}
```

**messages/en.json additions:**
```json
{
  "search": {
    "mobileOverlay": {
      "title": "Search products",
      "close": "Close search"
    }
  }
}
```

### Existing Patterns to Follow

**From Header.tsx (focus trap):**
```typescript
function useFocusTrap(isActive: boolean, onEscape?: () => void) {
  const containerRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  // ... implementation
}
```

Can reuse or simplify this pattern for the overlay.

**From CategoryFilter.tsx (mobile overlay):**
```typescript
// Fixed full-screen overlay pattern
<div className="fixed inset-0 z-50 md:hidden">
  {/* Backdrop */}
  <div className="absolute inset-0 bg-black/50" onClick={onClose} />
  {/* Panel */}
  <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl">
    ...
  </div>
</div>
```

### Accessibility Considerations

1. **Focus management:**
   - Auto-focus input on open
   - Trap focus within overlay
   - Return focus to search button on close

2. **Keyboard navigation:**
   - Escape closes overlay
   - Arrow keys for result navigation (same as SearchBar)
   - Enter to select result or submit search

3. **Screen reader:**
   - `role="dialog"` on overlay
   - `aria-modal="true"`
   - `aria-label` for close button
   - Live region for search results count

4. **Reduced motion:**
   - Respect `prefers-reduced-motion` for animations

### Z-Index Stack

Current project z-index layers:
- Header: `z-50`
- Mobile menu panel: `z-[60]`
- Mobile menu overlay: `z-50`

MobileSearchOverlay should use `z-[60]` to appear above header.

### Project Structure Notes

**New file:**
- `src/components/ui/MobileSearchOverlay.tsx` - Client Component

**Modified files:**
- `src/components/layout/Header.tsx` - Replace inline mobile search with overlay
- `messages/vi.json` - Add search.mobileOverlay translations
- `messages/en.json` - Add search.mobileOverlay translations

**Potentially modified:**
- `src/app/(frontend)/styles.css` - Animation keyframes (if not present)

### Testing Strategy

1. **Mobile viewport test:**
   - Open DevTools, set viewport to 375px width
   - Click search icon in header
   - Verify full-screen overlay opens

2. **Auto-focus test:**
   - Open overlay
   - Verify input is focused immediately (cursor blinking)

3. **Search functionality:**
   - Type "6205" in search
   - Verify autocomplete results appear
   - Verify results are full-width

4. **Close behavior:**
   - Click X button - overlay should close
   - Press Escape - overlay should close
   - Click a result - should navigate and close

5. **Animation test:**
   - Enable DevTools "Reduce motion" preference
   - Verify animation is disabled

6. **Desktop test:**
   - Set viewport to 1024px
   - Click search icon
   - Verify inline SearchBar shows (no overlay)

### Performance Notes

1. **Conditional rendering:** Only render overlay when `isOpen` is true
2. **Debounced search:** Maintain 300ms debounce from SearchBar
3. **AbortController:** Cancel pending requests on new search
4. **Passive scroll listener:** Not needed (scroll is locked)

### Previous Story Intelligence

**From Story 7.4 (Mobile Sticky Bottom Bar):**
- Scroll-aware show/hide behavior pattern
- Fixed positioning with z-index management
- `prefers-reduced-motion` handling

**From Story 7.3 (i18n):**
- Translation patterns with nested namespaces
- `useTranslations` hook usage in Client Components

**From Story 7.1 (SEO meta tags):**
- Locale handling patterns

### Git Commit Pattern

Expected commit for this story:
- `feat: 7-5-mobile-search-overlay - implement full-screen mobile search`

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 7.5] - Story requirements
- [Source: _bmad-output/planning-artifacts/architecture.md#Section 5] - Component patterns
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Search Patterns] - UX specs
- [Source: src/components/ui/SearchBar.tsx] - Existing search implementation
- [Source: src/components/layout/Header.tsx:79,191-215] - Current mobile search toggle
- [Source: src/components/ui/CategoryFilter.tsx] - Mobile overlay pattern reference
- [Source: messages/vi.json] - Translation file structure

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Debug Log References

N/A

### Completion Notes List

- Created MobileSearchOverlay component with full search functionality duplicated from SearchBar
- Implemented full-screen fixed overlay with z-[60] to appear above header
- Added slide-up/slide-down animations with prefers-reduced-motion support
- Integrated body scroll lock, focus trap, and focus restoration
- Added ARIA attributes for accessibility (role="dialog", aria-modal, combobox pattern)
- Added Vietnamese and English translations for mobile overlay title and close button
- Integrated with Header.tsx by replacing inline mobile search bar
- Desktop/tablet continues using inline SearchBar (no overlay)
- Build passes successfully with TypeScript compilation
- Note: ESLint has a pre-existing configuration issue (circular structure) unrelated to this story

### File List

**New files:**
- src/components/ui/MobileSearchOverlay.tsx

**Modified files:**
- src/components/layout/Header.tsx
- src/app/(frontend)/styles.css
- messages/vi.json
- messages/en.json

### Change Log

- 2026-02-05: Implemented story 7-5-mobile-search-overlay - full-screen mobile search experience

### Code Review Fixes Applied

- [HIGH] Added res.ok check before parsing JSON response → Prevents silent failures on API errors (MobileSearchOverlay.tsx:183-185)
- [MEDIUM] Added ARIA live region for screen reader announcements → Results count and no-results state now announced (MobileSearchOverlay.tsx:301-311)
- [MEDIUM] Added error state handling with hasError state → Shows error message when search fails (MobileSearchOverlay.tsx:43, 80-86)
- [MEDIUM] Added error translation key to both vi.json and en.json → "error" key in search namespace
- [LOW] Removed onTouchStart handlers → Prevents highlighting conflicts with scroll gestures (MobileSearchOverlay.tsx:317, 356)
