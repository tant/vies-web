# Story 2.6: Root layout integration

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want layout.tsx to fetch global data and render ContactBar + NavigationHeader + Footer,
So that all pages share the same layout structure.

## Acceptance Criteria

1. **Given** `(frontend)/layout.tsx` **When** bất kỳ trang nào render **Then** layout fetch 3 globals: `site-settings`, `header`, `footer` với locale hiện tại
2. **Given** globals fetched **When** render **Then** thứ tự: ContactBar → NavigationHeader (Header) → {children} → Footer
3. **Given** layout render **When** kiểm tra **Then** layout là Server Component, pass data xuống child components via props
4. **Given** Header component **When** nhận props **Then** dùng serialized data (Client Component boundary — JSON serializable)
5. **Given** Footer component **When** nhận props **Then** dùng CMS data (Server Component — nhận `footerData` + `siteSettings` props)
6. **Given** data fetching **When** multiple globals cần fetch **Then** dùng `Promise.all` cho parallel fetching

## Tasks / Subtasks

- [x] Task 1: Hoàn thiện globals fetching trong layout.tsx (AC: #1, #6)
  - [x] 1.1: Thêm fetch `footer` global vào `Promise.all`
  - [x] 1.2: Thêm `social: true` vào siteSettings `select` (Footer cần social links)
  - [x] 1.3: Thêm `address: true` vào siteSettings contact `select` (Footer cần address — kiểm tra xem nested select có hoạt động đúng không, nếu không thì bỏ select cho contact)

- [x] Task 2: Pass props xuống Footer component (AC: #2, #5)
  - [x] 2.1: Pass `footerData` + `siteSettings` props xuống `<Footer>`
  - [x] 2.2: Đảm bảo Footer component đã được refactor nhận props (Story 2.4 dependency)

- [x] Task 3: Verify integrated layout (AC: #1, #2, #3, #4, #5)
  - [x] 3.1: Chạy `pnpm build` — phải thành công
  - [x] 3.2: Verify: tất cả 3 globals được fetch
  - [x] 3.3: Verify: ContactBar → Header → {children} → Footer render đúng thứ tự
  - [x] 3.4: Verify: Header (Client Component) nhận serialized data đúng
  - [x] 3.5: Verify: Footer (Server Component) nhận CMS data đúng

## Dev Notes

### Trạng thái hiện tại của layout.tsx

**File:** `src/app/(frontend)/layout.tsx` — Server Component (async)

```typescript
// HIỆN TẠI — fetch 2 globals, Footer không nhận props
const [siteSettings, headerData] = await Promise.all([
  payload.findGlobal({ slug: 'site-settings', locale, select: { contact: true, logo: true, siteName: true } }),
  payload.findGlobal({ slug: 'header', locale, select: { topBar: true, navigation: true } }),
])
```

```tsx
// HIỆN TẠI — Footer render không props
<ContactBar phones={...} email={...} topBarEnabled={...} />
<Header headerData={headerData} siteSettings={siteSettings} />
<main className="flex-1">{children}</main>
<Footer />  {/* ← THIẾU PROPS */}
```

### Mục tiêu cuối cùng của layout.tsx

```typescript
// MỤC TIÊU — fetch 3 globals
const [siteSettings, headerData, footerData] = await Promise.all([
  payload.findGlobal({ slug: 'site-settings', locale, select: { contact: true, logo: true, siteName: true, social: true } }),
  payload.findGlobal({ slug: 'header', locale, select: { topBar: true, navigation: true } }),
  payload.findGlobal({ slug: 'footer', locale }),
])
```

```tsx
// MỤC TIÊU — tất cả components nhận props
<ContactBar phones={...} email={...} topBarEnabled={...} />
<Header headerData={headerData} siteSettings={siteSettings} />
<main className="flex-1">{children}</main>
<Footer footerData={footerData} siteSettings={siteSettings} />
```

### Dependency: Story 2.4 (Footer component) — DONE

Story 2.4 đã hoàn thành. Footer.tsx đã được refactor:
- Server Component (không còn `'use client'`)
- Nhận `FooterProps { footerData: FooterType, siteSettings: SiteSetting }`
- Render CMS columns, contact info, social links, copyright từ props
- `FooterLink` helper cho internal/external link detection

**Layout.tsx chỉ cần:** thêm fetch footer global + thêm `social: true` select + pass props xuống Footer.

### SiteSettings `select` consideration

Hiện tại layout dùng `select` để giới hạn fields:
```typescript
select: { contact: true, logo: true, siteName: true }
```

Cần thêm cho Footer:
- `social: true` — Facebook, Zalo URLs
- Contact `address` — hiện `contact: true` đã bao gồm tất cả contact fields (phone, email, address)

**Kiểm tra:** PayloadCMS `select` với `contact: true` có trả về toàn bộ contact group (bao gồm address) hay không. Nếu có → không cần thay đổi. Nếu không → cần explicit `select: { contact: { phone: true, email: true, address: true } }`.

Dựa trên PayloadCMS behavior: `contact: true` trả về toàn bộ group → address đã included. Chỉ cần thêm `social: true`.

### Layout architecture

```
src/app/(frontend)/layout.tsx (Server Component)
│
├── getLocale() → locale
├── getMessages() → messages (for NextIntlClientProvider)
├── getPayload() → payload instance
│
├── Promise.all([
│     findGlobal('site-settings'),  → siteSettings
│     findGlobal('header'),         → headerData
│     findGlobal('footer'),         → footerData  ← THÊM MỚI
│   ])
│
├── <html lang={locale}>
│   <body>
│     <NextIntlClientProvider messages={messages}>
│       <ContactBar ... />          ← Server Component, narrowed props
│       <Header ... />              ← Client Component, serialized props
│       <main>{children}</main>
│       <Footer ... />              ← Server Component, full props  ← CẬP NHẬT
│     </NextIntlClientProvider>
│   </body>
│   </html>
```

### [locale]/layout.tsx — không thay đổi

Locale layout (`src/app/(frontend)/[locale]/layout.tsx`) chỉ validate locale + `setRequestLocale()`. Không cần thay đổi — data fetching ở root layout.

### Data serialization

- **ContactBar:** Server Component → nhận primitive props (phones array, email string, boolean) → no serialization concern
- **Header:** Client Component (`'use client'`) → nhận `headerData` + `siteSettings` → phải JSON serializable. Media relations populated bởi `defaultDepth: 1` đã serializable.
- **Footer:** Server Component → nhận `footerData` + `siteSettings` → no serialization concern (server to server)

### Footer global — no `select` needed

Footer global chỉ có 2 fields: `columns` (array) + `copyright` (text). Nhỏ gọn → không cần `select`, fetch toàn bộ.

### Điểm cần tránh

- **KHÔNG** fetch globals riêng lẻ (sequential) — dùng `Promise.all` cho parallel
- **KHÔNG** fetch globals trong page components — fetch 1 lần ở layout, pass xuống
- **KHÔNG** quên thêm `social: true` vào siteSettings select — Footer cần social links
- **KHÔNG** duplicate fetch — 1 siteSettings instance dùng cho ContactBar, Header, VÀ Footer
- **KHÔNG** thay đổi [locale]/layout.tsx — nó chỉ validate locale

### Render order verification

Đúng thứ tự visual từ trên xuống:
1. ContactBar (topbar — steel blue background, scrolls away)
2. Header (sticky navigation — white background, `sticky top-0`)
3. {children} (page content — `flex-1` fills remaining space)
4. Footer (dark background — `bg-gray-900`, always at bottom)

`body className="min-h-screen flex flex-col"` + `main className="flex-1"` đảm bảo Footer luôn ở bottom, kể cả khi content ít.

### Previous Story Intelligence

**Story 2.1:** Created ContactBar + LanguageSwitcher, layout fetches site-settings + header globals. Pattern: `Promise.all`, `select` for performance.
**Story 2.2:** Header receives CMS props, layout passes headerData + siteSettings.
**Story 2.3:** Mobile menu slide-in, `formatTelHref` extracted to `@/lib/utils`.
**Story 2.4:** Defines Footer refactor (Client → Server, CMS data) + layout changes needed.
**Story 2.5:** Breadcrumb component created, used at page level (not layout).

### Git Intelligence

```
9ed2f96 Add ContactBar component with language switcher (Story 2.1)
```

Stories 2.2 (review), 2.3 (done) already committed/merged. Layout has been progressively updated.

### Files cần thay đổi

| File | Hành động | Mô tả |
|------|-----------|-------|
| `src/app/(frontend)/layout.tsx` | **Sửa** | Thêm fetch footer global, thêm `social: true` select, pass props xuống Footer |

### Files KHÔNG thay đổi

| File | Lý do |
|------|-------|
| `src/app/(frontend)/[locale]/layout.tsx` | Chỉ validate locale, không fetch data |
| `src/components/layout/ContactBar.tsx` | Đã hoàn thành |
| `src/components/layout/Header.tsx` | Đã hoàn thành |
| `src/components/layout/Footer.tsx` | Đã refactor trong Story 2.4 |
| `src/globals/*.ts` | Schema không thay đổi |

### Thứ tự thực hiện

1. Thêm footer global fetch vào `Promise.all`
2. Thêm `social: true` vào siteSettings select
3. Pass `footerData` + `siteSettings` xuống `<Footer>`
4. Build verification

### Scope nhỏ

Story này chủ yếu là **kết nối** — thay đổi nhỏ trong 1 file (layout.tsx). Phần lớn công việc nặng đã xong ở Stories 2.1-2.5. Story 2.6 đảm bảo mọi thứ integrated đúng cách.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.6]
- [Source: _bmad-output/planning-artifacts/architecture.md#Section 5.2 - Component Data Flow]
- [Source: src/app/(frontend)/layout.tsx - Current layout with 2 globals]
- [Source: src/app/(frontend)/[locale]/layout.tsx - Locale validation layout]
- [Source: _bmad-output/implementation-artifacts/2-4-footer-component.md - Footer refactor spec]
- [Source: _bmad-output/implementation-artifacts/2-1-contactbar-component.md - ContactBar patterns]
- [Source: _bmad-output/implementation-artifacts/2-2-navigationheader-component.md - Header patterns]

## Dev Agent Record

### Debug Log References

### Completion Notes List

- Initial integration (fetch footer global + pass props) was done during Story 2.4 development
- layout.tsx fetches 3 globals via `Promise.all`: site-settings (with `contact`, `logo`, `siteName`, `social`, `favicon` select), header (with `topBar`, `navigation` select), footer (full fetch)
- `contact: true` in PayloadCMS select returns the entire contact group including address — no nested select needed
- Render order confirmed: ContactBar → Header → main (flex-1) → Footer
- Header (Client Component) receives serialized `headerData` + `siteSettings` props
- Footer (Server Component) receives `footerData` + `siteSettings` + `locale` props directly
- Code review fixes applied:
  - Extracted duplicated icon components (PhoneIcon, MailIcon, etc.) to shared `icons.tsx`
  - Fixed Footer columns slice(0, 3) → slice(0, 4) to match schema maxRows
  - Pass locale as prop to Footer instead of redundant `getLocale()` call
  - Added `favicon: true` to siteSettings select for future metadata use

### Change Log

- 2026-02-05: Verified all integration tasks complete (work done in Story 2.4), build passes
- 2026-02-05: Code review — extracted shared icons, fixed Footer columns limit, pass locale prop, add favicon select
- 2026-02-05: Bugfix — LanguageSwitcher rewritten from `router.replace` to `<a>` tags with explicit locale prefix (`/vi/...`, `/en/...`) to fix navigation not working; NEXT_LOCALE cookie caused `as-needed` prefix to skip default locale redirect
- 2026-02-05: Bugfix — Added `localePrefix: 'as-needed'` to `createNavigation` in `src/i18n/navigation.ts` to match middleware config

### File List

| File | Action |
|------|--------|
| `src/app/(frontend)/layout.tsx` | Modified — pass locale to Footer, add favicon select |
| `src/components/layout/icons.tsx` | Created — shared icon components extracted from ContactBar, Header, Footer |
| `src/components/layout/ContactBar.tsx` | Modified — use shared icons from icons.tsx |
| `src/components/layout/Header.tsx` | Modified — use shared icons from icons.tsx |
| `src/components/layout/Footer.tsx` | Modified — use shared icons, accept locale prop, fix columns slice(0, 4), remove async/getLocale |
| `src/components/layout/LanguageSwitcher.tsx` | Modified — rewritten to use `<a>` tags with explicit locale URLs instead of `router.replace` |
| `src/i18n/navigation.ts` | Modified — added `localePrefix: 'as-needed'` to match middleware config |
