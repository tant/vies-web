# Story 7.3: Complete i18n Message Files

Status: in-progress

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a khách hàng người nước ngoài,
I want the entire UI translated to English,
so that I can use the website in my preferred language.

## Acceptance Criteria

1. **Given** website set to EN locale **When** user browse website **Then** tất cả UI strings hiện bằng English (navigation, buttons, form labels, placeholders, error messages, empty states)

2. **Given** CMS content exists in EN locale **When** user views content pages **Then** CMS content hiện bằng EN nếu có, fallback về VI nếu chưa dịch

3. **Given** all frontend components **When** audited for hardcoded text **Then** không có untranslated text (ngoại trừ CMS content chưa nhập)

**FRs:** I18N-03, I18N-04

## Tasks / Subtasks

- [x] Task 1: Audit existing components for hardcoded text (AC: #1, #3)
  - [x] 1.1 Scan all components in `src/components/` for hardcoded Vietnamese or English strings
  - [x] 1.2 Check layout components: ContactBar, Header, Footer, LanguageSwitcher
  - [x] 1.3 Check UI components: SearchBar, ProductCard, ServiceCard, NewsCard, QuoteRequestForm, ContactForm
  - [x] 1.4 Check block components: HeroBlock, ContentBlock, CTABlock, GalleryBlock, FAQBlock
  - [x] 1.5 Document any hardcoded strings that need extraction

- [ ] Task 2: Audit page files for hardcoded text (AC: #1, #3) - **PARTIALLY COMPLETE**
  - [x] 2.1 Scan all page files in `src/app/(frontend)/[locale]/` for hardcoded strings
  - [x] 2.2 Check homepage, products, services, news, contact, search, brands, categories pages
  - [x] 2.3 Check dynamic pages: product/[slug], services/[slug], news/[slug], [...slug]
  - [x] 2.4 Document missing translation keys
  - **NOTE:** Several pages still use `locale === 'vi' ?` pattern: warranty, shipping, about, faq, payment, brands/[slug], terms, privacy

- [x] Task 3: Compare vi.json and en.json for completeness (AC: #1)
  - [x] 3.1 Ensure all keys in vi.json have corresponding entries in en.json
  - [x] 3.2 Check for any keys present in en.json but missing in vi.json
  - [x] 3.3 Verify placeholder formats match (`{variable}` syntax)

- [x] Task 4: Add any missing translation keys to en.json (AC: #1)
  - [x] 4.1 Add missing general translations
  - [x] 4.2 Add missing page-specific translations (if any found in audit)
  - [x] 4.3 Add missing error/validation messages (if any)
  - [x] 4.4 Add missing empty state messages (if any)
  - **Added:** aria, spec, filter, gallery, meta, category sections

- [x] Task 5: Add corresponding keys to vi.json (AC: #1)
  - [x] 5.1 Add any new keys discovered during development to vi.json
  - [x] 5.2 Ensure parity between vi.json and en.json structure

- [x] Task 6: Replace hardcoded strings with translation calls (AC: #3) - **Core components done**
  - [x] 6.1 Update components to use `useTranslations` hook for any hardcoded strings found
  - [x] 6.2 Use `t()` function for all user-facing text
  - [x] 6.3 Handle pluralization if needed using next-intl patterns
  - **Updated:** LanguageSwitcher, ProductGallery, CategoryFilter, Toast, ContactForm, QuoteRequestForm, GalleryBlock, SpecificationsTable

- [ ] Task 7: Test locale switching (AC: #1, #2)
  - [ ] 7.1 Switch to EN locale and verify all UI text is English
  - [ ] 7.2 Switch to VI locale and verify all UI text is Vietnamese
  - [ ] 7.3 Verify CMS content falls back correctly when EN content not available
  - [ ] 7.4 Test language switcher in ContactBar works correctly

- [ ] Task 8: Build and verify (AC: all)
  - [ ] 8.1 Run `pnpm build` - ensure no TypeScript errors
  - [ ] 8.2 Run `pnpm lint` - ensure no linting errors
  - [ ] 8.3 Manually test all major pages in EN locale
  - [ ] 8.4 Verify no console warnings about missing translations

## Dev Notes

### Current i18n Architecture

**Framework:** next-intl (integrated with Next.js App Router)

**Configuration:**
- Locale config: `src/i18n/config.ts` - exports `locales: ['vi', 'en']`, `defaultLocale: 'vi'`
- Request config: `src/i18n/request.ts` - handles locale routing
- Message files: `messages/vi.json`, `messages/en.json`

### Current Message File Structure

Both `vi.json` and `en.json` currently have these sections (237 lines each):

```
{
  "common": { ... },      // 22 keys - general labels
  "nav": { ... },         // 14 keys + breadcrumb nested object
  "search": { ... },      // 9 keys - search functionality
  "home": { ... },        // 18 keys - homepage sections
  "products": { ... },    // 16 keys - product pages
  "services": { ... },    // 6 keys - service pages
  "news": { ... },        // 8 keys - news pages
  "forms": { ... },       // 17 keys - form fields and validation
  "contact": { ... },     // 24 keys - contact page
  "about": { ... },       // 1 key - about page
  "footer": { ... },      // 5 keys - footer
  "toast": { ... },       // 6 keys - notifications
  "errors": { ... },      // 5 keys - error pages
  "empty": { ... }        // 5 keys - empty states
}
```

### Translation Patterns

**Using translations in Server Components:**
```typescript
import { getTranslations } from 'next-intl/server'

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'products' })

  return <h1>{t('title')}</h1>
}
```

**Using translations in Client Components:**
```typescript
'use client'
import { useTranslations } from 'next-intl'

export function SearchBar() {
  const t = useTranslations('search')

  return <input placeholder={t('placeholder')} />
}
```

**Handling placeholders:**
```typescript
// Message: "Found {count} products for '{query}'"
t('resultsCount', { count: 10, query: 'SKF' })
```

### Components to Audit (30 total)

**Layout (5):**
- `ContactBar.tsx` - Phone numbers, email labels
- `Header.tsx` - Navigation labels, mobile menu
- `Footer.tsx` - Column titles, copyright
- `LanguageSwitcher.tsx` - Locale labels
- `icons.tsx` - No text

**UI (16):**
- `SearchBar.tsx` - Placeholder, no results
- `ProductCard.tsx` - Badge labels
- `ServiceCard.tsx` - CTA text
- `NewsCard.tsx` - Date labels
- `QuoteRequestForm.tsx` - Form labels, validation
- `ContactForm.tsx` - Form labels, validation
- `ContactInfo.tsx` - Section labels
- `ContactMap.tsx` - Map labels
- `CTASection.tsx` - Heading text
- `Toast.tsx` - Toast messages
- `ToastProvider.tsx` - Context provider
- `BrandLogoBar.tsx` - Section title
- `CategoryFilter.tsx` - Filter labels
- `Breadcrumb.tsx` - Home label
- `Button.tsx` - No text (styled component)

**Blocks (6):**
- `RenderBlocks.tsx` - Block renderer
- `HeroBlock.tsx` - Heading styles
- `ContentBlock.tsx` - Rich text
- `CTABlock.tsx` - Button text
- `GalleryBlock.tsx` - Caption text
- `FAQBlock.tsx` - Accordion labels

**Product (3):**
- `SpecificationsTable.tsx` - Table headers
- `RichTextContent.tsx` - Rich text renderer
- `ProductGallery.tsx` - Gallery labels

### Known Patterns from Previous Stories

From Story 7.2 (sitemap.xml):
- Locale iteration: `for (const locale of locales)`
- URL format: `${siteUrl}/${locale}/${path}`

From Story 7.1 (SEO meta tags):
- Site URL: `process.env.NEXT_PUBLIC_SITE_URL || 'https://v-ies.com'`
- Canonical format: consistent with locale prefix

### Potential Missing Translations to Check

Based on component list, verify these are covered:

1. **Accessibility labels:**
   - Screen reader text
   - ARIA labels
   - Alt text defaults

2. **Dynamic UI elements:**
   - Loading states ("Loading...", "Submitting...")
   - Pagination ("Page X of Y", "Previous", "Next")
   - Image gallery navigation

3. **Block components:**
   - FAQ expand/collapse labels
   - Gallery image captions
   - CTA button default text

4. **Form states:**
   - Disabled button text
   - Success confirmations
   - Field hints/help text

### Project Structure Notes

**File paths:**
- Messages: `messages/vi.json`, `messages/en.json`
- i18n config: `src/i18n/config.ts`
- Components: `src/components/` (organized by folder)
- Pages: `src/app/(frontend)/[locale]/`

**Build command:** `pnpm build`
**Lint command:** `pnpm lint`

### Testing Strategy

1. **Visual inspection:** Browse all pages in EN locale
2. **Network tab:** Check for missing translation warnings in console
3. **Automated check:** Search codebase for hardcoded Vietnamese strings
4. **Coverage check:** Compare message file keys against t() calls

### Previous Story Intelligence (7.2 - Sitemap)

Story 7.2 established:
- Locale iteration patterns for generating URLs
- All published content paths
- Multi-locale URL structure

The i18n completion story should ensure all these paths render correctly in both locales.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 7.3] - Story requirements
- [Source: _bmad-output/planning-artifacts/architecture.md#Section 6] - Implementation patterns
- [Source: src/i18n/config.ts] - Locale configuration
- [Source: messages/vi.json] - Vietnamese translations (237 lines)
- [Source: messages/en.json] - English translations (237 lines)
- [Source: next-intl docs] - https://next-intl-docs.vercel.app/

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5

### Debug Log References

### Completion Notes List

- Added 6 new translation namespaces: aria, spec, filter, gallery, meta, category
- Updated core components to use translations for accessibility labels
- Fixed hardcoded strings in categories/[slug] and [...slug] pages during code review
- Remaining work: Several static pages (warranty, shipping, about, faq, payment) still use inline locale ternaries

### Code Review Fixes Applied

- HIGH: `categories/[slug]/page.tsx:37` → Used `tMeta('categoryNotFound')` instead of hardcoded string
- HIGH: `categories/[slug]/page.tsx:48` → Used `tMeta('categoryDescription', { category })` instead of hardcoded string
- HIGH: `[...slug]/page.tsx:29` → Used `tMeta('pageNotFound')` instead of hardcoded string
- MEDIUM: Added `meta.pageNotFound` key to both `en.json` and `vi.json`

### File List

**Message Files (i18n):**
- `messages/en.json` - Added aria, spec, filter, gallery, meta, category sections + pageNotFound key
- `messages/vi.json` - Added aria, spec, filter, gallery, meta, category sections + pageNotFound key

**Components Updated:**
- `src/components/layout/LanguageSwitcher.tsx` - Uses aria.switchTo
- `src/components/product/ProductGallery.tsx` - Uses aria.* for accessibility
- `src/components/product/SpecificationsTable.tsx` - Accepts translated labels as props
- `src/components/ui/CategoryFilter.tsx` - Uses filter.* and aria.*
- `src/components/ui/Toast.tsx` - Uses toast.* and aria.dismiss
- `src/components/ui/ContactForm.tsx` - Uses contact.*, forms.*, aria.*
- `src/components/ui/ContactInfo.tsx` - Uses contact.*, common.*
- `src/components/ui/QuoteRequestForm.tsx` - Uses forms.*, aria.*
- `src/components/blocks/GalleryBlock.tsx` - Uses gallery.fallbackAlt
- `src/components/blocks/RenderBlocks.tsx` - Passes locale to GalleryBlock

**Pages Updated:**
- `src/app/(frontend)/[locale]/[...slug]/page.tsx` - Uses tMeta for not found title
- `src/app/(frontend)/[locale]/categories/[slug]/page.tsx` - Uses tMeta for metadata
- `src/app/(frontend)/[locale]/product/[slug]/page.tsx` - Uses tMeta, tSpec for translations
- `src/app/(frontend)/[locale]/products/page.tsx` - Uses translations
- `src/app/(frontend)/[locale]/search/page.tsx` - Uses tMeta, tSearch for translations
- `src/app/(frontend)/[locale]/news/[slug]/page.tsx` - Uses translations
- `src/app/(frontend)/[locale]/services/[slug]/page.tsx` - Uses translations
