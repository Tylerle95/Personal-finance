# Next.js Development Rules & Guidelines

<!-- BEGIN:nextjs-agent-rules -->
## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

### Cấu trúc dự án và quy chuẩn (Vercel Standards)
- **App Router**: Sử dụng cấu trúc App Router trong thư mục `src/app/`.
- **Responsive & Mobile-First**: Sử dụng Tailwind CSS với hướng thiết kế ưu tiên giao diện di động.
- **PWA Integration**: Tích hợp các file cấu hình PWA (`manifest.json`, icon, metadata) trong dự án.
