# Story 1.4: Cập nhật i18n message files

Status: done

## Story

As a developer,
I want VI and EN message files updated with all UI strings needed for the redesign,
So that all components can use localized text.

## Acceptance Criteria

1. **Given** `messages/vi.json` hiện tại có 51 keys **When** cập nhật **Then** có đầy đủ keys cho: navigation labels, search placeholder, button text, form labels, error messages, empty states, footer text, breadcrumb labels
2. **Given** `messages/en.json` hiện tại mirror vi.json **When** cập nhật **Then** có đầy đủ cùng keys với bản dịch English tương ứng
3. **Given** cấu trúc keys hiện tại **When** cập nhật **Then** keys organized by feature: `common`, `nav`, `search`, `products`, `services`, `news`, `forms`, `footer`, `errors`, `empty`
4. **Given** tất cả thay đổi hoàn tất **When** chạy build **Then** app build thành công không lỗi
5. **Given** components hiện tại dùng `useTranslations('common')`, `useTranslations('footer')`, etc. **When** cập nhật **Then** KHÔNG xóa hoặc đổi tên existing keys đang được sử dụng — chỉ thêm mới

## Tasks / Subtasks

- [x] Task 1: Audit existing keys đang sử dụng (AC: #5)
  - [x] 1.1: Grep tất cả `useTranslations`, `getTranslations`, `t('...')` calls trong codebase
  - [x] 1.2: List tất cả keys đang sử dụng → đánh dấu KHÔNG XÓA

- [x] Task 2: Cập nhật `messages/vi.json` (AC: #1, #3)
  - [x] 2.1: Giữ nguyên `common` namespace — thêm keys mới
  - [x] 2.2: Thêm `nav` namespace: navigation labels cho redesign (services, brands, categories, breadcrumb)
  - [x] 2.3: Thêm `search` namespace: placeholder, hints, results count, no-results, view all
  - [x] 2.4: Mở rộng `products` namespace: specifications, related products, image gallery, load more
  - [x] 2.5: Thêm `services` namespace: listing title, detail labels, benefits heading
  - [x] 2.6: Mở rộng `news` namespace: published date, related news, load more
  - [x] 2.7: Thêm `forms` namespace: quote request form labels, validation messages, success/error toasts
  - [x] 2.8: Mở rộng `footer` namespace: column headers, links
  - [x] 2.9: Thêm `errors` namespace: 404, generic error, retry
  - [x] 2.10: Thêm `empty` namespace: no products, no results, contact engineer suggestion

- [x] Task 3: Cập nhật `messages/en.json` (AC: #2)
  - [x] 3.1: Mirror tất cả keys từ vi.json với bản dịch English
  - [x] 3.2: Verify tất cả keys tồn tại trong cả 2 files

- [x] Task 4: Verify build (AC: #4)
  - [x] 4.1: Chạy `pnpm build` — phải thành công không lỗi

## Dev Notes

### Existing keys đang sử dụng (KHÔNG XÓA)

Từ grep analysis, các keys sau đang được reference trong code:

**`common` namespace** (dùng bởi Header.tsx, Footer.tsx, page files):
- `common.home`, `common.products`, `common.news`, `common.about`, `common.contact`
- `common.search`, `common.readMore`, `common.viewAll`, `common.loading`, `common.noResults`
- `common.services`

**`footer` namespace** (dùng bởi Footer.tsx):
- `footer.copyright`

**`contact` namespace** (dùng bởi contact/page.tsx):
- `contact.title`, `contact.subtitle`, `contact.contactInfo`, `contact.address`, `contact.phone`
- `contact.workingHours`, `contact.followUs`, `contact.formTitle`, `contact.formSubtitle`
- `contact.name`, `contact.namePlaceholder`, `contact.emailPlaceholder`, `contact.phonePlaceholder`
- `contact.company`, `contact.companyPlaceholder`, `contact.subject`, `contact.selectSubject`
- `contact.subjectQuote`, `contact.subjectInfo`, `contact.subjectSupport`, `contact.subjectPartnership`
- `contact.subjectOther`, `contact.productInterest`, `contact.message`, `contact.messagePlaceholder`
- `contact.submit`

**`about` namespace** (dùng bởi about/page.tsx):
- `about.title`

**`news` namespace** (dùng bởi news pages):
- `news.title`

**`products` namespace** (dùng bởi products pages):
- `products.title`, `products.filter`, `products.brand`, `products.category`
- `products.sort`, `products.requestQuote`

**`home` namespace** (dùng bởi homepage):
- `home.hero.title`, `home.hero.subtitle`
- `home.featuredProducts`, `home.latestNews`, `home.ourBrands`

### Target message structure (vi.json)

```jsonc
{
  // === GIỮA NGUYÊN existing keys ===
  "common": {
    "home": "Trang chủ",
    "products": "Sản phẩm",
    "news": "Tin tức",
    "about": "Giới thiệu",
    "contact": "Liên hệ",
    "search": "Tìm kiếm",
    "readMore": "Xem thêm",
    "viewAll": "Xem tất cả",
    "loading": "Đang tải...",
    "noResults": "Không có kết quả",
    "services": "Dịch vụ",
    // === THÊM MỚI ===
    "brands": "Thương hiệu",
    "categories": "Danh mục",
    "loadMore": "Xem thêm",
    "backToHome": "Về trang chủ",
    "email": "Email",
    "phone": "Điện thoại",
    "callNow": "Gọi ngay",
    "zaloChat": "Chat Zalo"
  },

  "nav": {
    "services": "Dịch vụ",
    "products": "Sản phẩm",
    "productsByBrand": "Theo hãng",
    "productsByCategory": "Theo loại",
    "news": "Tin tức",
    "aboutUs": "Về chúng tôi",
    "contact": "Liên hệ",
    "breadcrumb": {
      "home": "Trang chủ",
      "products": "Sản phẩm",
      "services": "Dịch vụ",
      "news": "Tin tức",
      "brands": "Thương hiệu",
      "categories": "Danh mục",
      "contact": "Liên hệ",
      "about": "Giới thiệu",
      "search": "Tìm kiếm"
    }
  },

  "search": {
    "placeholder": "Tìm theo mã sản phẩm, tên hoặc hãng...",
    "placeholderHero": "Nhập mã vòng bi hoặc tên sản phẩm...",
    "hints": "VD: 6205, SKF, vòng bi",
    "resultsCount": "Tìm thấy {count} sản phẩm cho '{query}'",
    "viewAllResults": "Xem tất cả kết quả",
    "noResults": "Không tìm thấy sản phẩm",
    "noResultsHint": "Liên hệ kỹ sư tư vấn: {phone}",
    "searching": "Đang tìm kiếm..."
  },

  "home": {
    "hero": {
      "title": "VIES - Chuyên cung cấp vòng bi và linh kiện công nghiệp",
      "subtitle": "Nhà phân phối chính hãng các thương hiệu SKF, FAG, NTN, TIMKEN"
    },
    "featuredProducts": "Sản phẩm nổi bật",
    "latestNews": "Tin tức mới nhất",
    "ourBrands": "Thương hiệu đối tác",
    // === THÊM MỚI ===
    "servicesSection": "Dịch vụ kỹ thuật",
    "servicesDesc": "Tư vấn và giải pháp kỹ thuật chuyên nghiệp",
    "productsSection": "Sản phẩm công nghiệp",
    "ctaTitle": "Cần tư vấn hoặc báo giá?",
    "ctaSubtitle": "Đội ngũ kỹ sư VIES sẵn sàng hỗ trợ bạn"
  },

  "products": {
    "title": "Danh mục sản phẩm",
    "filter": "Bộ lọc",
    "brand": "Thương hiệu",
    "category": "Danh mục",
    "sort": "Sắp xếp",
    "requestQuote": "Yêu cầu báo giá",
    // === THÊM MỚI ===
    "specifications": "Thông số kỹ thuật",
    "description": "Mô tả sản phẩm",
    "relatedProducts": "Sản phẩm liên quan",
    "sku": "Mã sản phẩm",
    "imageGallery": "Hình ảnh sản phẩm",
    "loadMore": "Xem thêm sản phẩm",
    "clearFilters": "Xóa bộ lọc",
    "allBrands": "Tất cả hãng",
    "allCategories": "Tất cả danh mục",
    "productCount": "{count} sản phẩm"
  },

  "services": {
    "title": "Dịch vụ kỹ thuật",
    "viewDetails": "Xem chi tiết",
    "benefits": "Lợi ích",
    "contactConsult": "Liên hệ tư vấn",
    "relatedServices": "Dịch vụ khác"
  },

  "news": {
    "title": "Tin tức",
    // === THÊM MỚI ===
    "publishedAt": "Đăng ngày",
    "relatedNews": "Bài viết liên quan",
    "loadMore": "Xem thêm tin tức"
  },

  "forms": {
    "quoteRequest": {
      "title": "Yêu cầu báo giá",
      "name": "Họ và tên",
      "namePlaceholder": "Nhập họ và tên",
      "phone": "Số điện thoại",
      "phonePlaceholder": "Nhập số điện thoại",
      "email": "Email",
      "emailPlaceholder": "example@email.com",
      "product": "Sản phẩm",
      "quantity": "Số lượng",
      "quantityPlaceholder": "Nhập số lượng",
      "notes": "Ghi chú",
      "notesPlaceholder": "Thông tin thêm...",
      "submit": "Gửi yêu cầu báo giá",
      "submitting": "Đang gửi..."
    },
    "validation": {
      "required": "Trường này bắt buộc",
      "invalidEmail": "Email không hợp lệ",
      "invalidPhone": "Số điện thoại không hợp lệ",
      "minLength": "Tối thiểu {min} ký tự"
    },
    "toast": {
      "success": "Đã gửi yêu cầu thành công",
      "successDetail": "VIES sẽ liên hệ trong 30 phút",
      "error": "Gửi yêu cầu thất bại",
      "errorDetail": "Vui lòng thử lại hoặc liên hệ trực tiếp",
      "retry": "Thử lại"
    }
  },

  "contact": {
    // === GIỮA NGUYÊN tất cả existing keys ===
    "title": "Liên hệ",
    "subtitle": "Chúng tôi luôn sẵn sàng hỗ trợ bạn",
    // ... (giữ nguyên tất cả keys hiện tại)
    "map": "Bản đồ"
  },

  "about": {
    "title": "Giới thiệu"
  },

  "footer": {
    "copyright": "© {year} VIES. Tất cả quyền được bảo lưu.",
    // === THÊM MỚI ===
    "company": "Công ty",
    "quickLinks": "Liên kết nhanh",
    "support": "Hỗ trợ",
    "followUs": "Theo dõi"
  },

  "errors": {
    "notFound": "Trang không tồn tại",
    "notFoundMessage": "Trang bạn tìm không tồn tại hoặc đã bị xóa.",
    "genericError": "Đã xảy ra lỗi",
    "genericErrorMessage": "Vui lòng thử lại sau.",
    "retry": "Thử lại"
  },

  "empty": {
    "noProducts": "Không có sản phẩm nào",
    "noProductsHint": "Thử thay đổi bộ lọc hoặc tìm kiếm.",
    "noResults": "Không tìm thấy kết quả",
    "contactEngineer": "Liên hệ kỹ sư tư vấn",
    "contactEngineerPhone": "Gọi: {phone}"
  }
}
```

### Implementation Pattern

**Key organization:**
- Namespace = feature area (nav, search, products, services, etc.)
- Nested objects cho sub-sections (forms.quoteRequest, forms.validation)
- Interpolation: `{variable}` syntax (next-intl format)
- Giữ flat structure trong mỗi namespace khi có thể

**next-intl usage:**
```typescript
// Server Component
import { getTranslations } from 'next-intl/server'
const t = await getTranslations({ locale, namespace: 'products' })
t('specifications')  // "Thông số kỹ thuật"

// Client Component
import { useTranslations } from 'next-intl'
const t = useTranslations('search')
t('resultsCount', { count: 5, query: '6205' })  // "Tìm thấy 5 sản phẩm cho '6205'"
```

### Files cần thay đổi (2 files)

| File | Thay đổi |
|------|----------|
| `messages/vi.json` | Thêm 93 keys mới, giữ nguyên 51 keys hiện tại |
| `messages/en.json` | Mirror tất cả keys với bản dịch English |

### Files KHÔNG cần thay đổi

| File | Lý do |
|------|-------|
| `src/i18n/config.ts` | Đã đúng sau Story 1.1 |
| `src/i18n/request.ts` | Dynamic import — tự load đúng file |
| Component files | Chưa thay đổi components — đó là Epic 2+ |

### Thứ tự thực hiện

1. Audit existing keys (Task 1) — xác nhận keys đang dùng
2. Cập nhật vi.json (Task 2) — thêm tất cả keys mới
3. Cập nhật en.json (Task 3) — mirror vi.json
4. Build verification (Task 4)

### Architecture Constraints

- **next-intl 4.1**: Messages tự động loaded qua `src/i18n/request.ts` → `import messages/${locale}.json`
- **Type safety**: next-intl có thể generate types từ message files — không bắt buộc trong story này nhưng nên biết
- **Interpolation**: Dùng `{variable}` format, VD: `"resultsCount": "Tìm thấy {count} sản phẩm cho '{query}'"`
- **Nested messages**: next-intl hỗ trợ nested objects + dot notation: `t('hero.title')` hoặc `const t = useTranslations('home.hero')`

### Cảnh báo

- **KHÔNG** xóa bất kỳ existing key nào — components hiện tại đang reference chúng
- **KHÔNG** đổi tên existing keys — sẽ break components hiện tại
- **KHÔNG** thay đổi `contact` namespace structure — nhiều page files đang reference chi tiết
- **CÓ THỂ** thêm keys vào existing namespaces (common, products, news, footer)
- **CÓ THỂ** tạo namespaces hoàn toàn mới (nav, search, services, forms, errors, empty)
- Đảm bảo vi.json và en.json có CÙNG keys — missing keys sẽ cause runtime errors
- **Dependency**: Story này độc lập, nhưng nên làm sau Story 1.1 (KM removal) để tránh conflict

### Previous Story Intelligence

Từ Story 1.1 (completed):
- File `messages/km.json` đã bị xóa
- vi.json và en.json đã được cleaned (xóa KM references nếu có)
- next-intl chỉ load vi/en — confirmed working

Từ Story 1.3:
- Design tokens đã cập nhật — colors, spacing phù hợp Nordic Industrial palette
- Button styles sẽ dùng `--color-accent` (amber) cho primary CTA

### Project Structure Notes

- Message files nằm tại `messages/vi.json` và `messages/en.json` — đúng convention next-intl
- Loaded bởi `src/i18n/request.ts` — dynamic import
- Components dùng `useTranslations` (Client) hoặc `getTranslations` (Server)
- Không có conflict với project structure

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.4]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Component Specifications - Lines 524-563]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Feedback Patterns - Lines 589-608]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Navigation Patterns - Lines 628-645]
- [Source: _bmad-output/planning-artifacts/ux-design-specification.md#Search Patterns - Lines 647-659]
- [Source: messages/vi.json - Current Vietnamese messages]
- [Source: messages/en.json - Current English messages]
- [Source: src/components/layout/Header.tsx - useTranslations('common')]
- [Source: src/components/layout/Footer.tsx - useTranslations('footer'), useTranslations('common')]

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5

### Debug Log References

N/A — no issues encountered

### Completion Notes List

- Audited all existing i18n keys across 13 source files — confirmed 11 namespaces/keys in active use (common, footer, contact, about, news, products, home)
- Updated vi.json from 51 keys to 144 keys — added 7 new namespaces (nav, search, services, forms, errors, empty) and expanded 4 existing namespaces (common, home, products, news, footer)
- Updated en.json to mirror all 144 keys with English translations
- Verified key parity: all 144 key paths match between vi.json and en.json
- Zero existing keys removed or renamed — all current component references preserved (AC #5)
- Keys organized by feature namespace as specified (AC #3): common, nav, search, home, products, services, news, forms, contact, about, footer, errors, empty
- Build passed successfully with `pnpm build` — no errors (AC #4)

### Change Log

- 2026-02-05: Added 93 new i18n keys across vi.json and en.json for redesign UI coverage (navigation, search, forms, errors, empty states, services, extended products/news/footer)
- 2026-02-05: Code review — fixed `common.loadMore` Vietnamese translation ("Xem thêm" → "Tải thêm") to distinguish from `common.readMore`; corrected key count documentation (51 not ~60); status → done

### File List

- messages/vi.json (modified) — added new keys for nav, search, services, forms, errors, empty namespaces; expanded common, home, products, news, footer
- messages/en.json (modified) — mirrored all vi.json keys with English translations
