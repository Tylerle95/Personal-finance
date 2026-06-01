# Supabase & PostgreSQL Development Rules

## 1. RLS (Row Level Security) - Bảo mật mặc định
- **Bắt buộc kích hoạt**: Mọi bảng mới được tạo trong database phải kích hoạt RLS bằng câu lệnh:
  ```sql
  alter table public.name_table enable row level security;
  ```
- **Chính sách phân quyền**:
  * Đảm bảo người dùng chỉ có quyền CRUD trên dữ liệu thuộc sở hữu của họ (sử dụng `auth.uid() = user_id`).
  * Tránh sử dụng chính sách công khai (public write/read) trừ khi đó là các bảng cấu hình tĩnh.

## 2. Type-Safety (An toàn kiểu dữ liệu)
- **Database Types**: Sử dụng CLI của Supabase để tạo ra tệp type định nghĩa cho database:
  ```bash
  npx supabase gen types typescript --project-id your-project-id > src/core/types/supabase.ts
  ```
- **Sử dụng Type**: Luôn truyền Database Type vào Supabase Client khi khởi tạo và sử dụng các kiểu dữ liệu tự động sinh ra cho các đối tượng Row, Insert, Update:
  ```typescript
  import { Database } from '@/core/types/supabase';
  type Transaction = Database['public']['Tables']['transactions']['Row'];
  ```

## 3. Tối ưu hóa truy vấn & Kết nối
- **Tránh N+1 Query**: Sử dụng các câu lệnh `.select('*, categories(*)')` để JOIN dữ liệu trực tiếp dưới database thay vì lấy danh sách rồi chạy vòng lặp gọi API.
- **Lập chỉ mục (Indexing)**:
  * Tạo chỉ mục cho tất cả các cột khóa ngoại (Foreign Keys) như `user_id`, `category_id`.
  * Tạo chỉ mục composite nếu thường xuyên lọc (filter) giao dịch theo nhiều tiêu chí cùng lúc (ví dụ: `user_id` + `transaction_date`).
- **Phân trang (Pagination)**: Luôn sử dụng `.range(from, to)` khi truy vấn danh sách giao dịch để tránh quá tải bộ nhớ và tối ưu hóa lượt đọc (Reads).
