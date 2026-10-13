#!/bin/sh
# Vân tay nội dung của bản dựng (SDO-300): băm những tệp tạo nên ảnh Docker.
# Dockerfile ghi kết quả ra public/version.txt; CI chạy lại đúng script này trên
# mã nguồn vừa đẩy rồi đợi vies.com.vn/version.txt trả cùng giá trị — cách duy
# nhất biết chắc bản đang chạy là bản vừa đẩy, vì build hỏng thì container cũ
# vẫn trả 200.
#
# Một script dùng chung cho cả hai phía để không có hai bản lệnh phải giữ khớp
# từng chữ. Chạy được cả trên busybox (alpine, lúc dựng) lẫn GNU (runner CI).
# Đổi danh sách bên dưới khi ứng dụng đọc thêm thư mục mới lúc build/chạy.
set -eu
find src public messages package.json pnpm-lock.yaml next.config.mjs \
  tsconfig.json postcss.config.mjs Dockerfile \
  -type f ! -path public/version.txt -print0 \
  | LC_ALL=C sort -z | xargs -0 sha256sum | sha256sum | cut -c1-16
