---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
inputDocuments:
  - "ux-design-specification.md"
  - "existing-codebase"
workflowType: 'prd'
---

# Product Requirements Document - VIES Web

**Author:** Tan
**Date:** 2026-02-04

---

## 1. Tổng quan sản phẩm

### 1.1 Mô tả

VIES Web là website của công ty VIES - công ty dịch vụ kỹ thuật công nghiệp chuyên về vòng bi và linh kiện công nghiệp. Website phục vụ 2 mục đích chính:

1. **Catalog sản phẩm + yêu cầu báo giá** - Cho phép khách hàng tìm kiếm sản phẩm (vòng bi, bôi trơn, dụng cụ bảo trì...) bằng mã SKU hoặc browse danh mục, sau đó gửi yêu cầu báo giá
2. **Giới thiệu dịch vụ kỹ thuật** - Thể hiện năng lực kỹ thuật (tư vấn, đo rung động, lắp đặt, bôi trơn) để khách hàng liên hệ tư vấn

### 1.2 Bối cảnh

- Công ty nhỏ, thành lập bởi nhóm kỹ sư tách ra từ SKF
- Bán đa hãng: SKF, FAG, NSK, Timken, NTN, KOYO, INA, Lincoln, Optibelt, SMC
- Core business: dịch vụ kỹ thuật, sản phẩm đi kèm
- Thế mạnh: chuyên môn kỹ thuật thật, hiểu sản phẩm sâu
- Khách hàng chủ yếu: nhà máy sản xuất lớn (xi măng, đạm, điện...)
- Website hiện tại đã có codebase Next.js + PayloadCMS, cần redesign theo UX spec mới

### 1.3 Vấn đề cần giải quyết

1. Website hiện tại layout như đại lý bán hàng (product catalog first), không phản ánh đúng bản chất services-first
2. Giao diện giống các đại lý khác (Ngọc Anh, TST), không khác biệt
3. Thiếu thể hiện "con người" - đội ngũ kỹ sư giỏi
4. Cần cân bằng services vs products: dịch vụ dẫn đầu, sản phẩm đầy đủ browse/search

---

## 2. Đối tượng người dùng

### 2.1 Primary: Kỹ sư bảo trì nhà máy

- Làm việc tại nhà máy sản xuất lớn
- Cần tư vấn kỹ thuật chuyên sâu, chọn đúng sản phẩm
- Quan tâm thông số kỹ thuật, giải pháp thực tế
- Liên hệ qua điện thoại, Zalo, email
- Truy cập desktop từ văn phòng, mobile từ hiện trường

### 2.2 Secondary: Phòng mua hàng (Procurement)

- Cần báo giá nhanh, chính xác
- So sánh sản phẩm, tìm mã tương đương
- Quan tâm năng lực nhà cung cấp

### 2.3 Tertiary: Admin VIES

- Quản lý sản phẩm, tin tức, dịch vụ qua Payload CMS admin
- Xem và xử lý yêu cầu báo giá (form submissions)

---

## 3. User Journeys

### 3.1 Journey 1: Search by SKU (60-70% traffic)

**Actor:** Kỹ sư / Phòng mua hàng
**Goal:** Tìm sản phẩm cụ thể và gửi yêu cầu báo giá

1. Vào trang chủ → thấy search bar trung tâm
2. Gõ mã sản phẩm (VD: "6205-2RS") → autocomplete dropdown hiện kết quả
3. Chọn sản phẩm → Product page (specs + ảnh + hãng)
4. Click "Yêu cầu báo giá" → form (tên, SĐT, SL, ghi chú)
5. Gửi form → xác nhận đã nhận

**Failure path:** Không tìm thấy → hiện gợi ý liên hệ kỹ sư (SĐT, Zalo, form)

### 3.2 Journey 2: Browse & Discover (20-25% traffic)

**Actor:** Phòng mua hàng / Kỹ sư chưa biết mã
**Goal:** Tìm sản phẩm theo danh mục/hãng

1. Vào trang chủ → chọn browse (theo hãng từ logo bar, theo loại từ menu)
2. Trang danh mục → grid sản phẩm + bộ lọc (hãng/loại/kích thước)
3. Tìm thấy → click → Product page → báo giá

### 3.3 Journey 3: Technical Services (10-15% traffic)

**Actor:** Kỹ sư bảo trì cần giải pháp
**Goal:** Liên hệ tư vấn kỹ thuật

1. Vào trang chủ → click Dịch vụ hoặc thấy section dịch vụ kỹ thuật
2. Trang dịch vụ → chọn dịch vụ cụ thể (VD: Đo rung động)
3. Xem chi tiết (mô tả, quy trình, case study)
4. Liên hệ: gọi SĐT, Zalo, hoặc gửi form tư vấn

---

## 4. Functional Requirements

### 4.1 Trang chủ (Homepage)

| ID | Requirement | Priority |
|----|-------------|----------|
| HP-01 | Top bar: SĐT báo giá + SĐT tư vấn + email, language switcher VI/EN | Must |
| HP-02 | Header: Logo VIES + Navigation + nút "Liên hệ" (amber CTA) | Must |
| HP-03 | Hero: Search bar lớn trung tâm + subtitle + quick search hints | Must |
| HP-04 | Dual section: Dịch vụ kỹ thuật (nền steel blue) + Sản phẩm (grid danh mục) | Must |
| HP-05 | Logo bar thương hiệu đối tác (SKF, FAG, NSK, TIMKEN, NTN, KOYO) | Must |
| HP-06 | CTA section: "Cần tư vấn hoặc báo giá?" + nút gọi + nút Zalo | Must |
| HP-07 | Footer: thông tin công ty, links, social | Must |

### 4.2 Search & Autocomplete

| ID | Requirement | Priority |
|----|-------------|----------|
| SR-01 | Search bar trên hero (lớn) và header (compact) | Must |
| SR-02 | Autocomplete: trigger sau 2 ký tự, debounce 300ms | Must |
| SR-03 | Dropdown: max 6 kết quả, hiện ảnh + tên + mã + hãng | Must |
| SR-04 | Keyboard navigation: Arrow keys, Enter, Escape | Should |
| SR-05 | No-results: gợi ý liên hệ kỹ sư, không trang trống | Must |
| SR-06 | Search results page: grid/list, sort, filter, pagination (load more) | Must |
| SR-07 | Mobile: full-screen search overlay | Must |

### 4.3 Sản phẩm (Products)

| ID | Requirement | Priority |
|----|-------------|----------|
| PR-01 | Product listing page: grid sản phẩm + bộ lọc sidebar | Must |
| PR-02 | Filter: theo hãng, theo loại (danh mục), theo kích thước | Must |
| PR-03 | Product card: ảnh + tên + mã SKU + hãng, KHÔNG hiện giá | Must |
| PR-04 | Product detail page: ảnh, specs kỹ thuật, hãng, danh mục | Must |
| PR-05 | Nút "Yêu cầu báo giá" nổi bật (amber) trên product page | Must |
| PR-06 | Sản phẩm liên quan (cùng danh mục/hãng) | Should |
| PR-07 | Số lượng SKU ban đầu: < 100, thêm dần | Info |

### 4.4 Dịch vụ (Services)

| ID | Requirement | Priority |
|----|-------------|----------|
| SV-01 | Services listing page: danh sách dịch vụ VIES | Must |
| SV-02 | Service detail page: mô tả, quy trình, benefits, case study | Must |
| SV-03 | CTA liên hệ tư vấn trên mỗi service page | Must |
| SV-04 | Homepage section dịch vụ (nền steel blue) link đến trang dịch vụ | Must |

### 4.5 Tin tức (News)

| ID | Requirement | Priority |
|----|-------------|----------|
| NW-01 | News listing page: danh sách bài viết, sorted by publishedAt | Must |
| NW-02 | News detail page: nội dung bài viết + related news | Must |
| NW-03 | Pagination cho listing | Must |

### 4.6 Thương hiệu (Brands)

| ID | Requirement | Priority |
|----|-------------|----------|
| BR-01 | Brand page: thông tin hãng + sản phẩm của hãng đó | Must |
| BR-02 | Logo bar trên homepage link đến brand pages | Must |

### 4.7 Danh mục (Categories)

| ID | Requirement | Priority |
|----|-------------|----------|
| CT-01 | Category page: danh mục + subcategories + sản phẩm | Must |
| CT-02 | Hỗ trợ parent-child categories (1 cấp) | Must |

### 4.8 Form báo giá & Liên hệ

| ID | Requirement | Priority |
|----|-------------|----------|
| FM-01 | Quote request form: tên (required), SĐT (required), email, sản phẩm, số lượng, ghi chú | Must |
| FM-02 | Pre-fill sản phẩm khi đến từ product page | Must |
| FM-03 | Contact page: form liên hệ + thông tin công ty + map | Must |
| FM-04 | Xác nhận sau submit: "Đã nhận yêu cầu" | Must |
| FM-05 | Form submissions lưu trong Payload CMS (admin xem qua panel) | Must |
| FM-06 | Không yêu cầu đăng ký tài khoản, không CAPTCHA | Must |

### 4.9 Trang tĩnh

| ID | Requirement | Priority |
|----|-------------|----------|
| PG-01 | Trang Giới thiệu (About) | Must |
| PG-02 | Trang Giao hàng (Shipping) | Should |
| PG-03 | Trang Thanh toán (Payment) | Should |
| PG-04 | Trang Bảo hành (Warranty) | Should |
| PG-05 | Trang FAQ | Should |
| PG-06 | Trang Chính sách bảo mật (Privacy) | Should |
| PG-07 | Trang Điều khoản (Terms) | Should |

### 4.10 Đa ngôn ngữ (i18n)

| ID | Requirement | Priority |
|----|-------------|----------|
| I18N-01 | 2 ngôn ngữ: Tiếng Việt (default), English | Must |
| I18N-02 | Language switcher trên topbar | Must |
| I18N-03 | Nội dung CMS localized (vi/en) | Must |
| I18N-04 | UI strings localized (next-intl messages) | Must |

### 4.11 SEO

| ID | Requirement | Priority |
|----|-------------|----------|
| SEO-01 | Meta title + description cho Products, News, Services, Pages | Must |
| SEO-02 | Auto-generate từ content (plugin-seo) | Must |
| SEO-03 | Sitemap.xml | Should |
| SEO-04 | Open Graph tags | Should |

### 4.12 Navigation & Layout

| ID | Requirement | Priority |
|----|-------------|----------|
| NV-01 | Topbar: steel blue, SĐT + email + language switcher | Must |
| NV-02 | Header: sticky, Logo + Menu + Search compact + CTA | Must |
| NV-03 | Mobile hamburger menu | Must |
| NV-04 | Mobile sticky bottom bar: Gọi + Zalo (trên product pages) | Should |
| NV-05 | Breadcrumb trên tất cả trang trừ homepage | Should |
| NV-06 | Footer: columns (info, links, brands, support) + copyright | Must |

---

## 5. Non-Functional Requirements

### 5.1 Performance

| ID | Requirement | Target |
|----|-------------|--------|
| PF-01 | First Contentful Paint | < 1.5s |
| PF-02 | Largest Contentful Paint | < 2.5s |
| PF-03 | Search autocomplete response | < 500ms |
| PF-04 | Image optimization | next/image, responsive srcset |
| PF-05 | Lighthouse Performance score | > 80 |

### 5.2 Accessibility

| ID | Requirement | Target |
|----|-------------|--------|
| A11Y-01 | WCAG AA compliance | Required |
| A11Y-02 | Color contrast | 4.5:1 minimum |
| A11Y-03 | Keyboard navigation | Full support |
| A11Y-04 | Touch targets | 44x44px minimum |
| A11Y-05 | Lighthouse Accessibility score | > 90 |

### 5.3 Responsive

| ID | Requirement | Target |
|----|-------------|--------|
| RS-01 | Mobile-first approach | < 768px |
| RS-02 | Tablet support | 768px - 1023px |
| RS-03 | Desktop | 1024px+ (max-width 1280px) |
| RS-04 | Breakpoints | Tailwind defaults (sm/md/lg/xl) |

### 5.4 Browser Support

- Chrome, Safari, Firefox, Edge (2 versions gần nhất)
- iOS Safari, Chrome Android
- Không hỗ trợ IE

### 5.5 Security

| ID | Requirement |
|----|-------------|
| SC-01 | PayloadCMS access control: public read, admin-only write |
| SC-02 | Form validation server-side |
| SC-03 | XSS protection (React default) |
| SC-04 | HTTPS enforced |

---

## 6. Tech Stack (Đã có)

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js | 16.1 |
| UI | React | 19.2 |
| Language | TypeScript | - |
| CMS | PayloadCMS | 3.74 |
| Database | PostgreSQL | - |
| Rich Text | Lexical Editor | - |
| Styling | Tailwind CSS | 4.1 |
| i18n | next-intl | 4.1 |
| Image | Sharp | 0.34 |
| SEO | @payloadcms/plugin-seo | 3.74 |
| Forms | @payloadcms/plugin-form-builder | 3.74 |
| Deployment | Dokploy (VPS) | - |

---

## 7. Data Model (Đã có trong PayloadCMS)

### Collections

| Collection | Drafts | Localized | Relationship |
|------------|--------|-----------|-------------|
| Products | Yes | Yes | → Brands (1:1), → Categories (1:many) |
| News | Yes | Yes | - |
| Services | Yes | Yes | - |
| Pages | Yes | Yes | Blocks (Hero, Content, CTA, FAQ, Gallery) |
| Categories | No | Yes | → Categories (parent, self-ref) |
| Brands | No | Yes | - |
| Media | No | Yes (alt, caption) | Image sizes: thumbnail, medium, large |
| Users | No | No | Role: admin, editor |

### Globals

| Global | Purpose |
|--------|---------|
| SiteSettings | Logo, favicon, contact info, social links |
| Header | Topbar config, navigation items |
| Footer | Footer columns, copyright |

---

## 8. Phạm vi & Giới hạn

### Trong phạm vi (In Scope)

- Redesign frontend theo UX spec (Direction A + topbar Direction B)
- Search autocomplete cho sản phẩm
- Quote request form (lưu trong CMS)
- Responsive mobile-first
- 2 ngôn ngữ VI/EN
- Deploy trên Dokploy VPS

### Ngoài phạm vi (Out of Scope)

- E-commerce (giỏ hàng, thanh toán online)
- User accounts / đăng ký khách hàng
- Realtime chat / chatbot
- Product import từ file (thêm thủ công qua CMS)
- Dark mode
- Push notifications
- Mobile app
- Khmer language (đã loại bỏ)

---

## 9. Success Metrics

| Metric | Target | Đo bằng |
|--------|--------|---------|
| Search hoạt động | Gõ mã → ra kết quả | Manual test |
| Form submission | Gửi được, lưu trong CMS | Manual test |
| Mobile responsive | Dùng được trên điện thoại | Chrome DevTools |
| Page load | < 2.5s LCP | Lighthouse |
| Accessibility | WCAG AA pass | Lighthouse > 90 |
| SEO | Meta tags đầy đủ | Lighthouse |

---

## 10. Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Search performance với lượng SKU tăng | Autocomplete chậm | PostgreSQL full-text search, index trên name + sku |
| Nội dung CMS chưa có đủ (ảnh, specs) | Website trống | Seed data mẫu, hướng dẫn admin nhập liệu |
| Localization chưa đầy đủ | Trang EN thiếu nội dung | Fallback về VI nếu EN chưa có |
