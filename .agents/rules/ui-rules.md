# UI, Tailwind CSS & PWA Development Rules

## 1. Nguyên tắc Responsive (Mobile-First)
- **Thiết kế Mobile-First**: Viết CSS mặc định cho màn hình di động, sau đó mới mở rộng cho màn hình lớn hơn bằng các prefix như `sm:`, `md:`, `lg:`...
- **Bảng biểu (Tables)**: Tuyệt đối không dùng thẻ `<table>` truyền thống chứa nhiều cột trên Mobile. Thay vào đó, hãy chuyển đổi dữ liệu thành danh sách dạng thẻ (Card List) hoặc danh sách chi tiết (List Item) xếp chồng để cuộn dọc mượt mà.
- **Thanh điều hướng (Navigation)**:
  * Trên Mobile: Sử dụng Bottom Navigation Bar để người dùng dễ dàng bấm bằng ngón tay cái.
  * Trên Desktop: Chuyển đổi sang Sidebar hoặc Top Navigation.

## 2. Quy chuẩn Tailwind CSS
- **Design Tokens**: Sử dụng các giá trị kích thước chuẩn của Tailwind (`p-4`, `m-2`, `gap-4`). Tránh lạm dụng các giá trị tùy biến không chuẩn trừ khi có yêu cầu đặc biệt.
- **Kích thước vùng chạm (Touch Targets)**: Mọi phần tử có thể tương tác (Nút bấm, Input, Select, Links...) trên Mobile phải có chiều cao tối thiểu **48px** hoặc padding đủ lớn để đảm bảo diện tích chạm tốt.
- **Hiệu ứng Hover**: Chỉ áp dụng hiệu ứng `:hover` với prefix `hover:` cho các thiết bị Desktop để tránh lỗi hiển thị bóng mờ (sticky hover) trên màn hình cảm ứng di động.

## 3. Quy chuẩn PWA (Progressive Web App)
- **Manifest**: Đảm bảo tệp `manifest.json` được cấu hình đầy đủ thông tin tên, màu chủ đạo (theme_color), và các biểu tượng (icons) chuẩn.
- **Viewport**: Giữ thẻ viewport luôn có các thuộc tính:
  ```typescript
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
  ```
  Để ngăn chặn hành vi tự động phóng to (zoom) khi người dùng tập trung vào thẻ `<input>` trên iOS/Android, tạo trải nghiệm mượt mà như app gốc.
- **Service Worker**: Đảm bảo cấu hình caching hợp lý (network-first cho API, cache-first cho assets tĩnh) để tối ưu tốc độ tải trang.
