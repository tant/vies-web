# Hướng dẫn quản trị website VIES (dành cho Marketing)

Tài liệu này hướng dẫn cách đăng nhập, đăng sản phẩm, viết bài, quản lý nội dung và làm SEO trên trang quản trị (admin) của website **vies.com.vn**. Không cần biết lập trình.

---

## Mục lục
1. [Đăng nhập](#1-đăng-nhập)
2. [Tổng quan trang quản trị](#2-tổng-quan-trang-quản-trị)
3. [4 quy tắc PHẢI nhớ](#3-bốn-quy-tắc-phải-nhớ)
4. [Quản lý hình ảnh (Media)](#4-quản-lý-hình-ảnh-media)
5. [Đăng & sửa SẢN PHẨM](#5-đăng--sửa-sản-phẩm)
6. [Danh mục & Thương hiệu](#6-danh-mục--thương-hiệu)
7. [Viết & sửa BÀI VIẾT (Tin tức)](#7-viết--sửa-bài-viết-tin-tức)
8. [Quản lý DỊCH VỤ](#8-quản-lý-dịch-vụ)
9. [Làm SEO](#9-làm-seo)
10. [Thông tin chung website (Cài đặt, Header, Footer)](#10-thông-tin-chung-website)
11. [Form & Yêu cầu báo giá](#11-form--yêu-cầu-báo-giá)
12. [Checklist trước khi xuất bản](#12-checklist-trước-khi-xuất-bản)
13. [Cẩm nang SEO](#13-cẩm-nang-seo)
14. [Xử lý sự cố thường gặp](#14-xử-lý-sự-cố-thường-gặp)

---

## 1. Đăng nhập

- Truy cập: **https://vies.com.vn/admin**
- Nhập **Email** và **Mật khẩu** được cấp → bấm **Login**.
- Lần đầu tiên (nếu chưa có tài khoản nào): trang sẽ hiện **"Create your first user"** — nhập Email, Mật khẩu, Tên, chọn **Role = Admin** → **Create**. Đây sẽ là tài khoản quản trị.
- Quên mật khẩu: bấm **Forgot password** ở màn hình đăng nhập (cần email đã cấu hình), hoặc nhờ người quản trị tạo lại.

> **Bảo mật:** không chia sẻ tài khoản; mỗi người một tài khoản riêng. Đăng xuất khi dùng máy chung (góc trên bên phải → **Log out**).

---

## 2. Tổng quan trang quản trị

Sau khi đăng nhập, cột menu bên trái chia theo nhóm:

| Nhóm | Mục | Dùng để |
|---|---|---|
| **Content** | **Products** (Sản phẩm) | Đăng/sửa sản phẩm |
| | **News** (Tin tức) | Viết bài, tin tức |
| | **Services** (Dịch vụ) | Trang dịch vụ |
| | **Categories** (Danh mục) | Nhóm sản phẩm |
| | **Brands** (Thương hiệu) | Các hãng (SKF, FAG…) |
| | **Pages** (Trang) | Trang tĩnh (Giới thiệu, chính sách…) |
| **Media** | **Media** | Kho hình ảnh dùng chung |
| **Forms** | **Forms / Submissions** | Mẫu form & dữ liệu khách gửi |
| **Admin** | **Users** | Tài khoản quản trị |

Trong mỗi mục: danh sách bản ghi + nút **Create New** (tạo mới) ở góc trên bên phải. Bấm vào một dòng để sửa.

---

## 3. Bốn quy tắc PHẢI nhớ

### ① Song ngữ (Tiếng Việt 🇻🇳 / English 🇬🇧)
Website có 2 ngôn ngữ. Khi đang sửa một bản ghi, ở **góc trên có ô chọn ngôn ngữ** (Locale): **Tiếng Việt** hoặc **English**.
- Nhập nội dung tiếng Việt → chọn **Tiếng Việt**, điền, **Save**.
- Chuyển sang **English** → dịch/điền lại các trường, **Save** lần nữa.
- Hình ảnh, giá, SKU dùng chung — chỉ phần chữ là tách theo ngôn ngữ.

> ⚠️ Nếu chỉ điền tiếng Việt, trang tiếng Anh sẽ hiển thị tạm nội dung tiếng Việt. Nên điền cả 2 để chuẩn.

### ② Nháp vs Xuất bản (Draft / Published)
Sản phẩm, Tin tức, Dịch vụ, Trang có 2 trạng thái:
- **Save Draft** (Lưu nháp): lưu nhưng **chưa hiện** trên website.
- **Publish** (Xuất bản): **hiện công khai** trên website.
- Muốn ẩn tạm: đổi về **Draft** / **Unpublish**.

> Nội dung mới tạo mặc định là **Draft** — phải bấm **Publish** mới lên web.

### ③ Slug (đường dẫn)
Mỗi sản phẩm/bài viết có **Slug** = phần đuôi URL (vd `vong-bi-cau-skf-6205`). Hệ thống **tự tạo từ tên**, không dấu, gạch nối. Có thể sửa, nhưng **không nên đổi slug của bài đã xuất bản** (sẽ làm hỏng link cũ và ảnh hưởng SEO).

### ④ Hình ảnh phải tải vào Media trước
Mọi hình đều lấy từ kho **Media**. Khi chọn ảnh, có nút **Upload** ngay tại chỗ hoặc chọn ảnh đã có. Xem mục 4.

---

## 4. Quản lý hình ảnh (Media)

**Menu → Media**.

**Tải ảnh mới:** **Create New** → kéo-thả hoặc chọn file → điền **Alt text** (mô tả ảnh, quan trọng cho SEO, vd "Vòng bi cầu SKF 6205-2RS") → **Save**.

Lưu ý:
- Định dạng: **JPG/PNG/WEBP**. Nên dùng **WEBP** (nhẹ) hoặc JPG.
- Kích thước khuyến nghị sản phẩm: **vuông ~1000×1000px**, nền trắng/sáng.
- Đặt tên file rõ ràng, không dấu (vd `vong-bi-skf-6205.jpg`).
- Dung lượng nên < 300KB/ảnh để web tải nhanh.
- Hệ thống tự tạo các bản nhỏ (thumbnail/medium/large) — không cần làm thủ công.
- **Alt text**: luôn điền, mô tả đúng nội dung ảnh có kèm tên hãng/mã.

---

## 5. Đăng & sửa SẢN PHẨM

**Menu → Products → Create New.**

Điền các trường (ở tab **Content**):

| Trường | Hướng dẫn |
|---|---|
| **Name** (Tên) | Tên đầy đủ, gồm loại + hãng + mã. VD: `Vòng bi cầu SKF 6205-2RS1` |
| **Slug** | Tự tạo từ tên — để nguyên |
| **SKU** | **Mã sản phẩm chuẩn (ISO)**, vd `6205-2RS1`. Đây cũng là mã tra cứu/lắp lẫn giữa các hãng |
| **Short Description** | Mô tả ngắn 1–2 câu (hiện ở thẻ sản phẩm & dùng cho SEO) |
| **Description** | Mô tả chi tiết (trình soạn thảo: in đậm, danh sách, tiêu đề…) |
| **Brand** | Chọn hãng (SKF/FAG/NTN/TIMKEN/Optibelt/Bando/Tsubaki) |
| **Categories** | Chọn **nhóm cha + nhóm con** (vd "Vòng bi" + "Vòng bi cầu"). Có thể chọn nhiều |
| **Images** | Bấm **Add** → Upload/chọn ảnh. Ảnh đầu tiên là ảnh đại diện |
| **Specifications** | Bảng **thông số** dạng Khoá–Giá trị. Bấm **Add** từng dòng |
| **Featured** | Tích ✓ nếu muốn sản phẩm xuất hiện ở khu **"Sản phẩm nổi bật"** trang chủ |

**Gợi ý nội dung Specifications** (mỗi dòng 1 thông số):
- `Ký hiệu` = `6205-2RS1`
- `Kích thước (d×D×B)` = `25×52×15 mm`
- `Loại` = `Bi cầu một dãy`
- `Đặc điểm` = `2 phớt cao su, bôi mỡ sẵn`
- `Mã tương đương (lắp lẫn)` = `FAG / NTN / NSK / KOYO 6205-2RS1 — cùng chuẩn ISO`

**Các bước chuẩn:**
1. Điền đầy đủ trường **tiếng Việt** → **Save Draft**.
2. Sang tab **SEO** điền meta (xem mục 9).
3. Đổi ngôn ngữ sang **English** → dịch Name/Short Description/Description/Specifications → **Save**.
4. Kiểm tra lại → **Publish**.
5. Mở `vies.com.vn/products` xem kết quả.

**Sửa sản phẩm:** Products → bấm vào dòng cần sửa → chỉnh → **Save** (rồi **Publish** nếu cần áp dụng).

---

## 6. Danh mục & Thương hiệu

### Danh mục (Categories)
Cấu trúc **2 cấp**: Nhóm cha → Nhóm con.
- **Create New** → **Name**, **Slug** (tự tạo), **Parent** (để trống = nhóm cha; chọn 1 nhóm = nhóm con), **Order** (thứ tự hiển thị, số nhỏ lên trước), **Image** (tuỳ chọn).
- 8 nhóm cha hiện có: Vòng bi, Gối đỡ & Bạc, Truyền động, Bôi trơn, Dụng cụ bảo trì, Giám sát tình trạng, Phớt & Gioăng, Khí nén.
- Khi thêm nhóm cha mới, nhớ cập nhật **Menu Header** (mục 10) nếu muốn hiện trên thanh điều hướng.

### Thương hiệu (Brands)
- **Create New** → **Name**, **Slug**, **Logo**.
- Logo các hãng đang dùng file tĩnh — nếu cần đổi logo, liên hệ kỹ thuật (không chỉ upload qua đây).

---

## 7. Viết & sửa BÀI VIẾT (Tin tức)

**Menu → News → Create New.**

| Trường | Hướng dẫn |
|---|---|
| **Title** (Tiêu đề) | Tiêu đề bài, hấp dẫn, có từ khoá |
| **Slug** | Tự tạo — để nguyên |
| **Excerpt** (Tóm tắt) | 1–2 câu tóm tắt (hiện ở danh sách tin & dùng cho SEO) |
| **Featured Image** | Ảnh đại diện bài (tỷ lệ ngang ~16:9 đẹp nhất) |
| **Content** | Nội dung bài: tiêu đề phụ, đoạn văn, ảnh chèn, danh sách, link… |
| **Published At** | Ngày đăng (dùng để sắp xếp tin mới nhất) |

**Cách viết Content tốt:**
- Chia đoạn ngắn, dùng **tiêu đề phụ (Heading)** cho mỗi phần.
- Chèn ảnh minh hoạ (qua nút chèn ảnh trong trình soạn thảo).
- Câu đầu nên chứa từ khoá chính.

**Các bước:** điền tiếng Việt → Save Draft → tab SEO → đổi sang English dịch → **Publish**. Bài mới sẽ hiện ở `/news` và khu **"Tin tức mới nhất"** trang chủ.

---

## 8. Quản lý DỊCH VỤ

**Menu → Services.** Tương tự bài viết:
- **Title**, **Slug**, **Excerpt**, **Featured Image**, **Content**, **Benefits** (danh sách lợi ích — bấm Add từng dòng), **Order** (thứ tự).
- Điền song ngữ → tab SEO → **Publish**. Hiện ở `/services`.

---

## 9. Làm SEO

Mỗi Sản phẩm / Tin tức / Dịch vụ / Trang có **tab "SEO"** (bên cạnh tab Content) ở màn hình sửa.

### Các trường SEO
| Trường | Khuyến nghị |
|---|---|
| **Meta Title** | Tiêu đề hiển thị trên Google. **50–60 ký tự**. Có từ khoá + tên/mã. Hệ thống tự thêm "\| VIES" ở cuối nên **không cần gõ "VIES"**. VD: `Vòng bi cầu SKF 6205-2RS1 25×52×15mm` |
| **Meta Description** | Đoạn mô tả dưới tiêu đề trên Google. **120–160 ký tự**, có từ khoá + lời kêu gọi. VD: `Vòng bi cầu SKF 6205-2RS1 chính hãng (25×52×15mm). Lắp lẫn FAG/NTN/NSK. Báo giá nhanh tại VIES.` |

> Có **bộ đếm ký tự** và thanh màu (xanh = tốt, đỏ = quá dài/ngắn) ngay tại trường. Cố giữ ở mức **xanh**.

### Quy tắc SEO khi đăng nội dung
1. **Điền Meta Title + Meta Description cho CẢ tiếng Việt và English** (đổi ngôn ngữ ở góc trên rồi điền lại).
2. **Alt text** cho mọi ảnh (mục 4).
3. **Slug ngắn gọn, có từ khoá**, không đổi sau khi xuất bản.
4. Mỗi trang nên có **1 từ khoá chính** xuất hiện ở: Tiêu đề, Meta Title, Meta Description, đoạn đầu nội dung.
5. Đặt link nội bộ: trong bài viết, link tới sản phẩm/dịch vụ liên quan.

### Những thứ SEO đã tự động (không cần làm)
- Sitemap (`/sitemap.xml`), robots.txt.
- Thẻ ngôn ngữ (hreflang vi/en), canonical.
- Dữ liệu có cấu trúc (Google hiểu được Sản phẩm/Bài viết/Doanh nghiệp).
- Ảnh chia sẻ mạng xã hội (Open Graph) — tự lấy ảnh sản phẩm/bài.

> Nếu **bỏ trống** Meta Title/Description, hệ thống tự dùng Tên/Tóm tắt — vẫn ổn, nhưng **tự điền sẽ tốt hơn**.

---

## 10. Thông tin chung website

**Menu → Globals** (Cài đặt chung). Sửa xong bấm **Save** (áp dụng ngay, song ngữ).

- **Site Settings:** Tên site, **Liên hệ** (số điện thoại — nhiều số kèm nhãn, email, **địa chỉ**), **Mạng xã hội** (Facebook, Zalo, YouTube). → Hiện ở Header, Footer, trang Liên hệ.
- **Header:** **Top bar** (dòng hotline trên cùng), **Navigation** (menu). Menu "Sản phẩm" có **submenu** trỏ tới các nhóm — khi thêm nhóm mới, thêm 1 dòng con tại đây (Label + Link dạng `/products?category=slug-nhom`).
- **Footer:** các cột link + dòng **Copyright** (có tên công ty + MST).

> Địa chỉ/điện thoại sửa **một nơi (Site Settings)** là cập nhật toàn site.

---

## 11. Form & Yêu cầu báo giá

- **Forms:** mẫu **Quote Request** (yêu cầu báo giá) và **Contact** (liên hệ) — chỉnh các trường nếu cần (thường để nguyên).
- **Submissions:** **dữ liệu khách gửi** từ các form. Vào đây để xem/đọc yêu cầu báo giá & liên hệ của khách. Nên kiểm tra hằng ngày.

---

## 12. Checklist trước khi xuất bản

Trước khi bấm **Publish** một sản phẩm/bài viết:
- [ ] Tên/Tiêu đề rõ ràng, đúng chính tả
- [ ] Slug hợp lý
- [ ] Ảnh đại diện đẹp + **Alt text** đã điền
- [ ] Mô tả ngắn + mô tả chi tiết đầy đủ
- [ ] (Sản phẩm) SKU, Brand, Categories (cha + con), Specifications
- [ ] Tab **SEO**: Meta Title (xanh) + Meta Description (xanh)
- [ ] Đã điền **cả tiếng Việt và English**
- [ ] Bấm **Publish**
- [ ] Mở web kiểm tra thực tế (vi + /en)

---

## 13. Cẩm nang SEO

- **Từ khoá:** nghĩ theo cách khách tìm: mã vòng bi (`6205`, `22210`), "vòng bi SKF", "vòng bi cầu", "mỡ bôi trơn SKF"… Đưa vào Tiêu đề, Meta, đoạn đầu.
- **Tiêu đề hấp dẫn + đúng:** không nhồi nhét từ khoá; viết tự nhiên.
- **Nội dung chất lượng:** bài viết kỹ thuật hữu ích (cách chọn, so sánh, bảo trì) thu hút tìm kiếm tốt hơn bài ngắn sơ sài.
- **Ảnh tối ưu:** nhẹ (<300KB), tên file & Alt có từ khoá.
- **Cập nhật đều:** đăng tin/sản phẩm mới thường xuyên giúp Google đánh giá site "sống".
- **Liên kết nội bộ:** bài viết → trỏ tới sản phẩm/dịch vụ; sản phẩm → cùng nhóm.
- **Đừng đổi slug** bài đã lên top.
- **Việc cần kỹ thuật làm 1 lần (không thuộc marketing):** khai báo & xác minh **Google Search Console**, submit sitemap, theo dõi thứ hạng.

---

## 14. Xử lý sự cố thường gặp

| Hiện tượng | Cách xử lý |
|---|---|
| Đăng xong nhưng **không thấy trên web** | Chưa **Publish** (đang Draft) → mở lại, bấm **Publish** |
| **Trang tiếng Anh hiện tiếng Việt** | Chưa điền nội dung English → đổi ngôn ngữ, dịch, Save |
| **Ảnh không hiện / mờ** | Ảnh chưa upload đúng, hoặc quá nhỏ → tải lại ảnh ≥1000px |
| **Sản phẩm không vào đúng nhóm** | Kiểm tra trường **Categories** đã chọn nhóm cha + con chưa |
| Sửa xong **web chưa đổi ngay** | Đợi ~1–2 phút (web có bộ nhớ đệm) rồi tải lại trang (Ctrl/Cmd+Shift+R) |
| **Sản phẩm nổi bật không lên trang chủ** | Tích ✓ **Featured** và **Publish** |
| Quên mật khẩu | Dùng **Forgot password** hoặc nhờ Admin |

---

### Liên hệ hỗ trợ kỹ thuật
Những việc sau cần đội kỹ thuật (không thao tác qua admin): đổi logo hãng, thêm ngôn ngữ mới, sửa giao diện/bố cục, cấu hình tên miền/email, Google Search Console, backup. Khi gặp lỗi lạ, **chụp màn hình** và gửi kèm đường link trang đang gặp lỗi.
