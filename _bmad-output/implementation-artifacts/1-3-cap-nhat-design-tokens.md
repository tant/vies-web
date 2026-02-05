# Story 1.3: Cập nhật design tokens

Status: done

## Story

As a developer,
I want the design system tokens updated to Nordic Industrial palette,
So that all subsequent components use the correct colors, typography, and spacing.

## Acceptance Criteria

1. **Given** `styles.css` hiện tại có Industrial Blue palette (`--color-primary: #0f4c81`) **When** cập nhật `@theme` block **Then** `--color-primary` = `#0F4C75`
2. **Given** chưa có accent color **When** cập nhật `@theme` block **Then** thêm `--color-accent: #D4A843`
3. **Given** chưa có semantic background/text colors **When** cập nhật **Then** thêm `--color-bg: #FAFAFA`, `--color-bg-alt: #F0F0F0`, `--color-text: #1A1A2E`, `--color-text-muted: #6B7280`, `--color-border: #E5E7EB`
4. **Given** chưa có status colors **When** cập nhật **Then** thêm `--color-success: #059669`, `--color-error: #DC2626`
5. **Given** `--font-sans` đã có Inter **When** xác nhận **Then** `--font-sans: 'Inter', sans-serif` (đã đúng, giữ nguyên)
6. **Given** chưa có spacing scale **When** cập nhật `@theme` block **Then** thêm 8px base spacing: `--spacing-xs: 4px` → `--spacing-4xl: 96px`
7. **Given** chưa có border-radius tokens **When** cập nhật **Then** thêm `--radius-sm: 4px`, `--radius-md: 8px`
8. **Given** Inter font đã được import qua `next/font/google` **When** xác nhận **Then** Inter đã có sẵn với subsets `['latin', 'vietnamese']` — không cần thay đổi
9. **Given** `body` hiện dùng `background-color: white` **When** cập nhật **Then** đổi thành `var(--color-bg)` và `color: var(--color-text)`
10. **Given** tất cả thay đổi hoàn tất **When** chạy build **Then** app build thành công không lỗi

## Tasks / Subtasks

- [x] Task 1: Cập nhật `@theme` block trong styles.css (AC: #1-7)
  - [x] 1.1: Thay thế toàn bộ `@theme` block hiện tại bằng Nordic Industrial palette
  - [x] 1.2: Xóa `--color-secondary` variants (teal) — không còn trong design system
  - [x] 1.3: Xóa `--color-gray-*` scale (50-900) — thay bằng semantic tokens (`--color-text-muted`, `--color-border`, etc.)
  - [x] 1.4: Thêm `--color-accent: #D4A843`
  - [x] 1.5: Thêm `--color-bg`, `--color-bg-alt`, `--color-text`, `--color-text-muted`, `--color-border`
  - [x] 1.6: Thêm `--color-success`, `--color-error`
  - [x] 1.7: Thêm `--color-primary-light: #E8F0F7`
  - [x] 1.8: Thêm spacing scale: `--spacing-xs` → `--spacing-4xl`
  - [x] 1.9: Thêm border-radius: `--radius-sm`, `--radius-md`
  - [x] 1.10: Thêm container: `--container-max: 1280px`

- [x] Task 2: Cập nhật base styles trong styles.css (AC: #9)
  - [x] 2.1: `body` — đổi `background-color: white` → `var(--color-bg)` và `color: var(--color-gray-900)` → `var(--color-text)`
  - [x] 2.2: Cập nhật gradient classes để dùng new `--color-primary` (hex thay đổi nhẹ: `#0f4c81` → `#0F4C75`)
  - [x] 2.3: Cập nhật `.btn:focus` box-shadow để dùng new primary hex
  - [x] 2.4: Xóa tham chiếu `--color-secondary` trong gradients nếu có

- [x] Task 3: Xác nhận Inter font setup (AC: #5, #8)
  - [x] 3.1: Verify `layout.tsx` — Inter font đã import với `subsets: ['latin', 'vietnamese']`, `variable: '--font-inter'` — KHÔNG cần thay đổi
  - [x] 3.2: Verify `--font-sans` trong `@theme` — đã có `'Inter', ...sans-serif` — KHÔNG cần thay đổi (chỉ simplify fallback nếu cần)

- [x] Task 4: Verify build (AC: #10)
  - [x] 4.1: Chạy `pnpm build` — phải thành công không lỗi
  - [x] 4.2: Verify visual — mở dev server, kiểm tra colors đã thay đổi

## Dev Notes

### Current vs Target `@theme` block

**HIỆN TẠI** (`src/app/(frontend)/styles.css` lines 4-29):
```css
@theme {
  /* Primary - Industrial Blue */
  --color-primary: #0f4c81;
  --color-primary-light: #1a6bb3;
  --color-primary-dark: #0a3459;

  /* Secondary - Teal accent */
  --color-secondary: #0d9488;
  --color-secondary-light: #14b8a6;
  --color-secondary-dark: #0a7269;

  /* Neutral colors */
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-200: #e5e7eb;
  --color-gray-300: #d1d5db;
  --color-gray-400: #9ca3af;
  --color-gray-500: #6b7280;
  --color-gray-600: #4b5563;
  --color-gray-700: #374151;
  --color-gray-800: #1f2937;
  --color-gray-900: #111827;

  /* Font family */
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
}
```

**TARGET** (từ architecture.md Section 8):
```css
@theme {
  /* Colors - Nordic Industrial */
  --color-primary: #0F4C75;
  --color-primary-light: #E8F0F7;
  --color-accent: #D4A843;
  --color-bg: #FAFAFA;
  --color-bg-alt: #F0F0F0;
  --color-text: #1A1A2E;
  --color-text-muted: #6B7280;
  --color-border: #E5E7EB;
  --color-success: #059669;
  --color-error: #DC2626;

  /* Typography */
  --font-sans: 'Inter', sans-serif;

  /* Spacing (8px base) */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-2xl: 48px;
  --spacing-3xl: 64px;
  --spacing-4xl: 96px;

  /* Border radius */
  --radius-sm: 4px;
  --radius-md: 8px;

  /* Container */
  --container-max: 1280px;
}
```

### Base styles updates needed

```css
/* TRƯỚC */
body {
  background-color: white;
  color: var(--color-gray-900);
}

/* SAU */
body {
  background-color: var(--color-bg);
  color: var(--color-text);
}
```

### Gradient updates

```css
/* .gradient-hero dùng hardcoded hex #1e3a5f */
/* Cập nhật nếu cần để match new primary, hoặc giữ nguyên nếu gradient nhìn OK */

/* .btn:focus dùng rgba(15, 76, 129, 0.3) — hex cho #0f4c81 */
/* Cập nhật thành rgba(15, 76, 117, 0.3) — hex cho #0F4C75 */
```

### Files cần thay đổi (1 file)

| File | Thay đổi | Lines |
|------|----------|-------|
| `src/app/(frontend)/styles.css` | Thay thế `@theme` block + cập nhật base styles | Lines 4-29 (theme), 42-44 (body), 93-98 (gradients), 127 (btn focus) |

### Files KHÔNG cần thay đổi

| File | Lý do |
|------|-------|
| `src/app/(frontend)/layout.tsx` | Inter font đã import đúng: `subsets: ['latin', 'vietnamese']`, `variable: '--font-inter'` |
| `postcss.config.mjs` | Đã dùng `@tailwindcss/postcss` — đúng cho Tailwind 4.1 |
| `tailwind.config.ts` | Không tồn tại — Tailwind 4.1 dùng `@theme` block trong CSS thay vì config file |

### Tailwind 4.1 `@theme` behavior

Trong Tailwind CSS 4.1, `@theme` block:
- Tạo CSS custom properties **VÀ** đăng ký chúng làm Tailwind utility classes
- `--color-primary: #0F4C75` → tự động tạo class `text-primary`, `bg-primary`, `border-primary`
- `--color-accent: #D4A843` → class `text-accent`, `bg-accent`, `border-accent`
- `--spacing-xs: 4px` → class `p-xs`, `m-xs`, `gap-xs`
- `--radius-sm: 4px` → class `rounded-sm`
- Không cần `tailwind.config.ts` — tất cả config trong CSS

### Typography Scale (từ UX Spec — reference only)

Các component sẽ dùng trực tiếp Tailwind utility classes cho typography, không cần thêm vào `@theme`:

| Level | Size | Weight | Tailwind |
|-------|------|--------|----------|
| H1 | 36px / 2.25rem | 700 | `text-4xl font-bold` |
| H2 | 28px / 1.75rem | 600 | `text-2xl font-semibold` |
| H3 | 20px / 1.25rem | 600 | `text-xl font-semibold` |
| Body | 16px / 1rem | 400 | default |
| Small | 14px / 0.875rem | 400 | `text-sm` |
| Caption | 12px / 0.75rem | 500 | `text-xs font-medium` |

### Thứ tự thực hiện

1. Thay thế `@theme` block (Task 1)
2. Cập nhật base styles (Task 2)
3. Xác nhận font setup (Task 3) — chỉ verify, không cần code change
4. Build verification (Task 4)

### Architecture Constraints

- **Tailwind CSS 4.1**: Dùng `@theme` block thay vì `tailwind.config.ts`
- **`next/font/google`**: Inter font import tại `layout.tsx` — tạo CSS variable `--font-inter`, `@theme` dùng `--font-sans` reference
- **Không thay đổi component code** trong story này — chỉ thay đổi design tokens. Components sẽ được rebuild trong Epic 2+
- **Gray scale removal**: Xóa `--color-gray-*` và thay bằng semantic tokens. Tailwind 4 vẫn cung cấp `gray-*` utility classes mặc định

### Cảnh báo

- **KHÔNG** tạo `tailwind.config.ts` — Tailwind 4.1 dùng `@theme` block
- **KHÔNG** thay đổi `layout.tsx` — Inter font setup đã đúng
- **KHÔNG** cập nhật component code — đó là Epic 2+ stories
- **KHÔNG** thêm typography tokens vào `@theme` — dùng Tailwind default text sizes
- **primary hex thay đổi nhẹ**: `#0f4c81` (cũ) → `#0F4C75` (mới) — case change + hex khác nhẹ. Kiểm tra gradient hardcoded hexes
- **Dependency**: Story 1.1 và 1.2 không bắt buộc phải hoàn thành trước — story này độc lập

### Project Structure Notes

- `styles.css` nằm tại `src/app/(frontend)/styles.css` — đúng convention
- Được import bởi `src/app/(frontend)/layout.tsx` line 7: `import './styles.css'`
- Không có conflict với project structure

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.3]
- [Source: _bmad-output/planning-artifacts/architecture.md#Section 8 - Design Tokens]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Color System - Lines 284-301]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Typography System - Lines 303-317]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Spacing & Layout Foundation - Lines 319-332]
- [Source: src/app/(frontend)/styles.css - Current styles file]
- [Source: src/app/(frontend)/layout.tsx - Inter font import]

## Dev Agent Record

### Agent Model Used
Claude Opus 4.5

### Debug Log References
- Không có lỗi trong quá trình thực hiện
- `pnpm build` thành công, 31 pages generated

### Completion Notes List
- Thay thế toàn bộ `@theme` block: xóa Industrial Blue palette (primary, secondary, gray scale) → Nordic Industrial palette (primary, accent, semantic colors, spacing, radius, container)
- Cập nhật `body` background/color từ hardcoded `white`/`--color-gray-900` → `var(--color-bg)`/`var(--color-text)`
- Cập nhật gradient classes: thay `var(--color-primary-dark)` bằng hardcoded `#0a3459` (vì `--color-primary-dark` đã bị xóa)
- Cập nhật `.btn:focus` box-shadow rgba từ `(15, 76, 129)` → `(15, 76, 117)` để match hex `#0F4C75`
- Xác nhận Inter font setup đã đúng trong `layout.tsx` — không cần thay đổi
- Xác nhận không còn tham chiếu nào đến `--color-secondary` hoặc `--color-gray-*` trong codebase
- Font fallback simplified: `'Inter', system-ui, -apple-system, sans-serif` → `'Inter', sans-serif`
- Build thành công: 31 pages, không có lỗi TypeScript hay CSS

### Change Log
- 2026-02-05: Cập nhật design tokens sang Nordic Industrial palette — thay thế `@theme` block, cập nhật base styles, xác nhận font setup, build passed
- 2026-02-05: Code review — sửa 5 issues: thêm `--color-primary-dark`, `--color-surface`, `--radius-lg` tokens; dùng token thay hardcoded values trong gradients, container, card, btn

### File List
- `src/app/(frontend)/styles.css` — Modified: thay thế `@theme` block + cập nhật base styles + review fixes (tokens thay hardcoded values)
