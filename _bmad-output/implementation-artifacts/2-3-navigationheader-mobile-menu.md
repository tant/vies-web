# Story 2.3: NavigationHeader mobile menu

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a khách hàng trên mobile,
I want a hamburger menu that slides in,
So that I can navigate the website on my phone.

## Acceptance Criteria

1. **Given** viewport < 1024px (lg breakpoint — hamburger hiển thị) **When** user click hamburger icon **Then** menu slide in từ phải với overlay background tối (backdrop)
2. **Given** mobile menu đang mở **When** user nhìn vào **Then** hiện tất cả navigation items từ CMS (`headerData.navigation`) + submenu expandable cho items có `children`
3. **Given** mobile menu đang mở **When** user nhìn vào bottom section **Then** hiện SĐT (clickable `tel:` links) + nút "Liên hệ" CTA (amber `bg-accent`)
4. **Given** mobile menu đang mở **When** user click overlay (outside menu) hoặc X button **Then** menu đóng lại với animation slide-out
5. **Given** mobile menu đang mở **When** accessibility check **Then** focus trap hoạt động (Tab cycle trong menu, không escape ra ngoài), Escape key đóng menu

**FRs:** NV-03

## Tasks / Subtasks

- [x] Task 1: Slide-in mobile menu với overlay (AC: #1, #4)
  - [x] 1.1: Thay thế mobile menu toggle đơn giản bằng slide-in panel từ phải (`translate-x-full` → `translate-x-0`)
  - [x] 1.2: Thêm overlay backdrop (`fixed inset-0 bg-black/50`) khi menu mở
  - [x] 1.3: Transition animation: `transition-transform duration-300 ease-in-out`
  - [x] 1.4: Click overlay → `setMobileMenuOpen(false)`
  - [x] 1.5: X button ở góc trên phải menu panel
  - [x] 1.6: Menu panel: `fixed top-0 right-0 h-full w-[280px] max-w-[80vw] bg-white shadow-xl z-60`

- [x] Task 2: Navigation items từ CMS với expandable submenu (AC: #2)
  - [x] 2.1: Render `navItems` (từ `headerData.navigation` — sẽ có sau Story 2.2) trong menu panel
  - [x] 2.2: Items KHÔNG có `children` → Link đơn giản, click → navigate + đóng menu
  - [x] 2.3: Items CÓ `children` → Expandable section (dùng `useState` cho mỗi item hoặc `<details>/<summary>`)
  - [x] 2.4: Chevron icon xoay khi expand/collapse
  - [x] 2.5: Active state: highlight item hiện tại dựa trên `pathname`

- [x] Task 3: Phone + Contact CTA trong mobile menu (AC: #3)
  - [x] 3.1: Section cuối menu (border-top separator) hiện phone numbers từ `siteSettings.contact.phone`
  - [x] 3.2: Phone links dùng `formatTelHref()` pattern từ ContactBar
  - [x] 3.3: Nút "Liên hệ" full-width, amber CTA (`bg-accent text-text`)
  - [x] 3.4: Phone icon + label + number cho mỗi phone entry

- [x] Task 4: Focus trap accessibility (AC: #5)
  - [x] 4.1: Khi menu mở, focus tự động vào close button (hoặc first focusable element)
  - [x] 4.2: Tab key cycle: chỉ focusable elements trong menu panel
  - [x] 4.3: Shift+Tab wrap around to last element
  - [x] 4.4: Escape key → đóng menu + return focus về hamburger button
  - [x] 4.5: `aria-modal="true"`, `role="dialog"`, `aria-label="Menu điều hướng"`
  - [x] 4.6: Body scroll lock khi menu mở (`overflow-hidden` trên `<body>`)

- [x] Task 5: Cập nhật layout.tsx pass data xuống Header (AC: #3)
  - [x] 5.1: Fetch `siteSettings` với thêm `contact` field (đã có `select: { contact: true }`)
  - [x] 5.2: Fetch `headerData` với thêm `navigation` field (hiện chỉ `select: { topBar: true }`)
  - [x] 5.3: Pass `headerData` + `siteSettings` props xuống Header component

- [x] Task 6: Verify build (AC: tất cả)
  - [x] 6.1: Chạy `pnpm build` — phải thành công
  - [x] 6.2: Verify: menu slide-in animation hoạt động
  - [x] 6.3: Verify: focus trap hoạt động (keyboard navigation)

## Dev Notes

### Dependency: Story 2.2 (NavigationHeader component)

Story 2.3 phụ thuộc vào Story 2.2 đã hoàn thành:
- Story 2.2 thêm `headerData` + `siteSettings` props vào Header component
- Story 2.2 đổi navigation từ hardcoded → CMS data (`headerData.navigation`)
- Story 2.2 cập nhật layout.tsx để pass props

**Nếu Story 2.2 chưa xong:** Dev cần implement cả phần props + CMS data flow trước khi làm mobile menu. Xem story 2.2 cho chi tiết props interface.

**Nếu Story 2.2 đã xong:** Header đã nhận `navItems` từ CMS, chỉ cần focus vào mobile menu behavior.

### Trạng thái hiện tại của mobile menu

**File:** `src/components/layout/Header.tsx` (lines 80-101)

```tsx
{/* Mobile Navigation — HIỆN TẠI */}
{mobileMenuOpen && (
  <div className="lg:hidden py-4 border-t">
    <nav className="flex flex-col gap-1">
      {navigation.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={() => setMobileMenuOpen(false)}
          className={cn(
            'px-4 py-3 rounded-lg font-medium transition-colors',
            pathname === item.href
              ? 'bg-primary/10 text-primary'
              : 'text-gray-700 hover:bg-gray-100',
          )}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  </div>
)}
```

**Vấn đề:**
- Chỉ toggle show/hide, không có slide animation
- Nằm trong `<header>` container (không phải fixed overlay)
- Không có overlay backdrop
- Không có expandable submenu cho items có children
- Không có phone/CTA section
- Không có focus trap
- Navigation items hardcoded (chưa từ CMS)

### Cấu trúc mobile menu mục tiêu

```tsx
{/* Overlay backdrop */}
{mobileMenuOpen && (
  <div
    className="fixed inset-0 bg-black/50 z-50 lg:hidden"
    onClick={() => setMobileMenuOpen(false)}
    aria-hidden="true"
  />
)}

{/* Slide-in panel */}
<div
  className={cn(
    'fixed top-0 right-0 h-full w-[280px] max-w-[80vw] bg-white shadow-xl z-[60]',
    'transform transition-transform duration-300 ease-in-out lg:hidden',
    mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
  )}
  role="dialog"
  aria-modal="true"
  aria-label="Menu điều hướng"
>
  {/* Close button */}
  <div className="flex justify-end p-md">
    <button
      ref={closeButtonRef}
      onClick={() => setMobileMenuOpen(false)}
      className="p-2 rounded-lg hover:bg-gray-100"
      aria-label="Đóng menu"
    >
      <XIcon className="w-6 h-6" />
    </button>
  </div>

  {/* Navigation items */}
  <nav className="flex flex-col px-md">
    {navItems.map((item) => (
      <MobileNavItem key={item.id} item={item} locale={locale} pathname={pathname}
        onNavigate={() => setMobileMenuOpen(false)} />
    ))}
  </nav>

  {/* Phone + CTA section */}
  <div className="mt-auto p-md border-t border-border">
    {phones.map((phone, index) => (
      <a key={phone.id ?? index} href={formatTelHref(phone.number)}
         className="flex items-center gap-sm py-2 text-text hover:text-primary">
        <PhoneIcon className="w-5 h-5" />
        <span>{phone.label}: {phone.number}</span>
      </a>
    ))}
    <Link href={`/${locale}/contact`}
          onClick={() => setMobileMenuOpen(false)}
          className="mt-md block text-center bg-accent hover:bg-accent/90 text-text font-semibold py-3 rounded-md">
      {t('contact')}
    </Link>
  </div>
</div>
```

### Expandable submenu pattern

Dùng `useState` cho từng item hoặc single expandedId:

```tsx
function MobileNavItem({ item, locale, pathname, onNavigate }: {
  item: NavigationItem
  locale: string
  pathname: string
  onNavigate: () => void
}) {
  const [expanded, setExpanded] = useState(false)
  const hasChildren = item.children && item.children.length > 0
  const isActive = pathname === `/${locale}${item.link}` || pathname.startsWith(`/${locale}${item.link}/`)

  return (
    <div>
      <div className="flex items-center">
        <Link
          href={`/${locale}${item.link}`}
          onClick={onNavigate}
          className={cn(
            'flex-1 px-4 py-3 font-medium transition-colors',
            isActive ? 'text-primary' : 'text-text hover:text-primary'
          )}
        >
          {item.label}
        </Link>
        {hasChildren && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-3 hover:bg-gray-100 rounded-lg"
            aria-expanded={expanded}
            aria-label={`${expanded ? 'Thu gọn' : 'Mở rộng'} ${item.label}`}
          >
            <ChevronDownIcon className={cn(
              'w-4 h-4 transition-transform duration-200',
              expanded && 'rotate-180'
            )} />
          </button>
        )}
      </div>

      {/* Children — expandable */}
      {hasChildren && expanded && (
        <div className="pl-6 pb-2">
          {item.children!.map((child) => (
            <Link
              key={child.id}
              href={`/${locale}${child.link}`}
              onClick={onNavigate}
              className="block px-4 py-2 text-sm text-text-muted hover:text-primary transition-colors"
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
```

### Focus trap implementation

Không cần thêm library. Implement bằng custom hook `useFocusTrap`:

```tsx
import { useEffect, useRef } from 'react'

function useFocusTrap(isActive: boolean) {
  const containerRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!isActive || !containerRef.current) return

    // Store previous focus
    previousFocusRef.current = document.activeElement as HTMLElement

    // Find all focusable elements
    const focusableSelector = 'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])'
    const focusableElements = containerRef.current.querySelectorAll<HTMLElement>(focusableSelector)
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]

    // Focus first element
    firstElement?.focus()

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key !== 'Tab') return

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      // Restore previous focus
      previousFocusRef.current?.focus()
    }
  }, [isActive])

  return containerRef
}
```

### Body scroll lock

Khi menu mở, cần lock scroll trên body để tránh scroll content phía dưới:

```tsx
useEffect(() => {
  if (mobileMenuOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
  return () => {
    document.body.style.overflow = ''
  }
}, [mobileMenuOpen])
```

### Escape key handler

```tsx
useEffect(() => {
  if (!mobileMenuOpen) return

  function handleEscape(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      setMobileMenuOpen(false)
    }
  }

  document.addEventListener('keydown', handleEscape)
  return () => document.removeEventListener('keydown', handleEscape)
}, [mobileMenuOpen])
```

**Lưu ý:** Nếu dùng `useFocusTrap` hook, có thể gộp Escape handler vào hook đó.

### Phone data format

Dữ liệu phone đến từ `siteSettings.contact.phone` (đã được pass từ layout):

```typescript
// Type từ payload-types.ts
contact?: {
  phone?: Array<{
    number: string      // "0903326309"
    label?: string | null  // "Báo giá" (localized)
    id?: string | null
  }> | null
  email?: string | null
}
```

`formatTelHref()` helper đã có trong ContactBar.tsx. Dev cần:
1. Hoặc copy function vào Header (đơn giản nhất)
2. Hoặc extract thành shared utility (nhưng overkill cho 2 files)

**Khuyến nghị:** Copy `formatTelHref` inline vào Header.tsx vì chỉ dùng ở 2 nơi.

```typescript
function formatTelHref(number: string): string {
  const digits = number.replace(/\s/g, '')
  return `tel:+84${digits.replace(/^0/, '')}`
}
```

### z-index stacking

| Element | z-index | Lý do |
|---------|---------|-------|
| Header | `z-50` | Sticky header |
| Mobile overlay | `z-50` | Cùng level, nhưng `fixed` nên nằm trên |
| Mobile menu panel | `z-[60]` | Nằm trên overlay |

### CSS Transition: Always render, toggle transform

**Quan trọng:** Menu panel LUÔN render trong DOM (không dùng conditional render `{mobileMenuOpen && ...}`). Dùng `translate-x-full` để ẩn và `translate-x-0` để hiện. Điều này cho phép CSS transition hoạt động.

```tsx
{/* ĐÚNG — always render, toggle transform */}
<div className={cn(
  'fixed top-0 right-0 h-full w-[280px] ...',
  'transition-transform duration-300',
  mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
)}>
```

```tsx
{/* SAI — conditional render không có exit animation */}
{mobileMenuOpen && <div className="fixed top-0 right-0 ...">}
```

**Exception:** Overlay backdrop CÓ THỂ dùng conditional render vì chỉ cần fade-in.

### ChevronDownIcon (cần thêm)

Header.tsx hiện tại không có ChevronDownIcon (đã bị xóa trong Story 2.1 refactor). Cần thêm lại:

```tsx
function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  )
}
```

### Layout.tsx changes

Hiện tại layout fetch globals với `select` giới hạn:
```typescript
// HIỆN TẠI
const [siteSettings, headerData] = await Promise.all([
  payload.findGlobal({ slug: 'site-settings', locale, select: { contact: true } }),
  payload.findGlobal({ slug: 'header', locale, select: { topBar: true } }),
])
```

Cần mở rộng `select` để bao gồm `navigation` và `logo`:
```typescript
// CẬP NHẬT
const [siteSettings, headerData] = await Promise.all([
  payload.findGlobal({ slug: 'site-settings', locale, select: { contact: true, logo: true, siteName: true } }),
  payload.findGlobal({ slug: 'header', locale, select: { topBar: true, navigation: true } }),
])
```

Và pass props xuống Header:
```tsx
<Header headerData={headerData} siteSettings={siteSettings} />
```

**Lưu ý:** Story 2.2 cũng yêu cầu thay đổi này. Nếu 2.2 đã xong thì layout đã có. Nếu dev implement 2.3 trước, cần thêm phần này.

### Header props interface (cần thêm)

```typescript
import type { Header as HeaderType, SiteSetting, Media } from '@/payload-types'

interface HeaderProps {
  headerData: HeaderType
  siteSettings: SiteSetting
}

export function Header({ headerData, siteSettings }: HeaderProps) {
  // ...
  const navItems = headerData.navigation ?? []
  const phones = siteSettings.contact?.phone ?? []
  const logo = siteSettings.logo as Media | null
  // ...
}
```

### Responsive breakpoint clarification

Epics AC nói "viewport < 768px (md breakpoint)" nhưng Header hiện tại dùng `lg:hidden` (1024px) cho hamburger. UX spec cũng nói desktop nav từ 1024px+.

**Kết luận:** Hamburger menu hiện ở viewport < 1024px (lg). Mobile menu slide-in áp dụng cho TẤT CẢ viewport < 1024px, không chỉ < 768px. Giữ `lg:hidden` / `lg:flex` breakpoint hiện tại.

### Điểm cần tránh

- **KHÔNG** dùng conditional render (`{mobileMenuOpen && <panel>}`) cho slide panel — mất exit animation
- **KHÔNG** quên body scroll lock — user sẽ scroll content phía dưới overlay
- **KHÔNG** quên return focus về hamburger button khi đóng menu
- **KHÔNG** dùng third-party library cho focus trap — custom hook đủ rồi (chỉ 30 lines)
- **KHÔNG** quên `aria-modal`, `role="dialog"`, `aria-label` cho accessibility
- **KHÔNG** dùng `position: absolute` cho menu panel — cần `position: fixed` để cover full viewport height
- **KHÔNG** hardcode phone numbers — lấy từ `siteSettings.contact.phone`
- **KHÔNG** quên cleanup useEffect — remove event listeners, restore body overflow
- **KHÔNG** dùng hover interactions cho submenu trên mobile — dùng tap/click expand

### Thứ tự thực hiện khuyến nghị

1. Cập nhật layout.tsx — mở rộng `select` + pass props (nếu Story 2.2 chưa xong)
2. Thêm props interface vào Header + wire up CMS data
3. Implement slide-in panel + overlay (CSS transitions)
4. Thêm expandable submenu cho items có children
5. Thêm phone + CTA section trong menu
6. Implement focus trap + Escape key + body scroll lock
7. Build verification

### Project Structure Notes

- File thay đổi chính: `src/components/layout/Header.tsx`
- File thay đổi phụ: `src/app/(frontend)/layout.tsx` (nếu Story 2.2 chưa update)
- Không tạo file mới — tất cả logic nằm trong Header.tsx
- `useFocusTrap` hook có thể inline trong Header.tsx hoặc tạo `src/lib/hooks/useFocusTrap.ts` (tùy preference)

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.3]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Navigation Patterns - Mobile]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Responsive Strategy]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Accessibility Strategy]
- [Source: _bmad-output/planning-artifacts/architecture.md#Section 5.1 - Component Data Mapping]
- [Source: _bmad-output/planning-artifacts/architecture.md#Section 5.2 - Component Data Flow]
- [Source: _bmad-output/planning-artifacts/architecture.md#Section 4.2 - Header Global]
- [Source: src/components/layout/Header.tsx - Current Header (lines 80-101 mobile menu)]
- [Source: src/components/layout/ContactBar.tsx - formatTelHref pattern]
- [Source: src/app/(frontend)/layout.tsx - Current layout with limited select]
- [Source: _bmad-output/implementation-artifacts/2-2-navigationheader-component.md - Previous story]
- [Source: _bmad-output/implementation-artifacts/2-1-contactbar-component.md - ContactBar patterns]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5

### Debug Log References

- Build passed successfully with no TypeScript errors

### Completion Notes List

- Replaced inline conditional-render mobile menu with fixed slide-in panel from right (`translate-x-full` → `translate-x-0`) with CSS transition
- Added overlay backdrop (`fixed inset-0 bg-black/50 z-50`) that closes menu on click
- Panel always rendered in DOM for proper exit animation, toggled via transform
- Navigation items from CMS with expandable submenu (chevron rotate animation)
- Phone + Contact CTA section at bottom with `formatTelHref()` for proper `tel:+84` links
- Custom `useFocusTrap` hook: auto-focus first element, Tab/Shift+Tab cycling, restore focus on close
- Escape key closes menu and returns focus to hamburger button
- Body scroll lock via `overflow: hidden` on body
- Proper ARIA: `role="dialog"`, `aria-modal="true"`, `aria-label="Menu điều hướng"`
- Task 5 (layout.tsx) was already completed by Story 2.2

### File List

- `src/components/layout/Header.tsx` — Modified: slide-in panel, overlay, focus trap, accessibility
- `src/components/layout/ContactBar.tsx` — Modified: use shared `formatTelHref` from utils
- `src/lib/utils.ts` — Modified: added shared `formatTelHref` utility
- `messages/vi.json` — Modified: added `navigationMenu` i18n key
- `messages/en.json` — Modified: added `navigationMenu` i18n key
- `_bmad-output/implementation-artifacts/2-3-navigationheader-mobile-menu.md` — Updated: task completion, status

### Change Log

- 2026-02-05: Implemented mobile slide-in menu with overlay, expandable submenu, phone/CTA section, focus trap accessibility, and body scroll lock
- 2026-02-05: Code review fixes — i18n aria-labels, reset expanded state on close, extract shared formatTelHref, consolidate keydown listeners, CSS class scroll lock
