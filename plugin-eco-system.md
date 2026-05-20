# 🌐 SCALECLAW AI-Native CMS: The Comprehensive Master Plan (Whitepaper)

Bản kế hoạch chi tiết xây dựng hệ sinh thái CMS mã nguồn mở thế hệ mới, nơi AI không chỉ là trợ lý mà là trung tâm của mọi hoạt động quản trị, thiết kế và sáng tạo.

---

## 1. Triết lý & Tầm nhìn chiến lược (Core Philosophy)

### 1.1. AI-First: Chuyển dịch từ "Công cụ" sang "Người vận hành"
Đa số các CMS hiện nay (WordPress, Strapi, Contentful) coi AI là một tính năng "viết hộ" (Add-on). SCALECLAW định nghĩa lại AI là **"Cư dân bản địa" (Native)**.
- **AI-Native CMS:** Toàn bộ hệ thống được xây dựng để AI có thể "đọc" và "hiểu" từng module. AI không chỉ viết text, nó có khả năng **điều khiển** hệ thống (tạo trang, đổi layout, cấu hình SEO, tích hợp plugin).
- **Hành trình người dùng (UX):** Thay vì người dùng phải mò mẫm trong Admin Panel phức tạp, họ chỉ cần ra lệnh: *"Xây dựng cho tôi một chiến dịch marketing mùa hè cho sản phẩm kem chống nắng"*. AI sẽ tự động chọn Template, viết nội dung, cấu hình SEO và xuất bản.

### 1.2. Section-Based Architecture (SBA): Giải pháp tối ưu cho AI & Người dùng
SCALECLAW kiên định với triết lý **"Xây dựng theo Section"** thay vì "Atomic Design" (kéo thả từng cái nút, cái ảnh).
- **Tại sao không dùng Atomic Builder (như Elementor/Figma)?**
    - AI rất khó để tạo ra một layout đẹp nếu nó có quá nhiều quyền tự do (quá nhiều biến số về padding, margin, font-size của từng thẻ). Kết quả thường là các layout "vô hồn" hoặc lỗi giao diện.
    - Người dùng không phải là Designer chuyên nghiệp. Việc để họ tự kéo thả thường dẫn đến kết quả xấu.
- **Tại sao chọn Section-Based?**
    - **Design by Pros:** Các Section (Hero, Features, Pricing) được thiết kế bởi các chuyên gia UI/UX. AI chỉ việc "đổ" dữ liệu vào các "Slots" có sẵn.
    - **AI-Friendly:** AI chỉ cần gửi một mảng JSON ngắn gọn để điều khiển. Cấu trúc dữ liệu cực kỳ sạch sẽ và dễ hiểu cho LLM.
    - **Tốc độ:** Xây dựng website nhanh gấp 10 lần so với việc kéo thả thủ công.

---

## 2. Kiến trúc Kỹ thuật đa tầng (Multi-layer Architecture)

Để giải quyết bài toán "Linh hoạt tối đa nhưng vẫn giữ được tính nhất quán", SCALECLAW chia giao diện thành 3 lớp độc lập:

### 2.1. Lớp 1: Global Design Tokens (The Soul)
Quản lý tập trung tại `/admin/theme`. Đây là nơi định nghĩa "Linh hồn" của thương hiệu:
- **Typography:** Font family chủ đạo, Base line-height, Weight hệ thống.
- **Visuals:** Primary Color, Border Radius, Shadow Depth (độ sâu đổ bóng).
- **Lợi ích:** Khi thay đổi ở đây, toàn bộ website (kể cả các plugin từ các bên khác nhau) đều sẽ đồng bộ theo thương hiệu, tránh tình trạng "râu ông nọ cắm cằm bà kia".

### 2.2. Lớp 2: Block Layout Themes (The Skeleton)
Đây là lớp "Logic trình bày" của riêng từng ngành nghề, nằm bên trong các Plugin Packs:
- **Sự khác biệt:** Cùng là một bộ dữ liệu `FeaturesBlockData`, nhưng **SaaS Theme** sẽ render với tiêu đề cực lớn (Heading Scale 1.5) và khoảng cách thoáng đãng; trong khi **Law Theme** sẽ dùng font Serif, khoảng cách chặt chẽ và trang trọng hơn.
- **Logic Layout:** Quy định margin giữa các item, thứ tự hiển thị của các component nhỏ (Heading -> Subtitle -> Button vs Subtitle -> Heading -> Button).
- **Cơ chế:** Layout Themes sử dụng các biến từ Global Design Tokens nhưng định nghĩa lại **Tỷ lệ (Scaling)** và **Cấu trúc (Structure)**.

### 2.3. Lớp 3: Content Layer (The Muscle)
Dữ liệu thuần túy được lưu dưới dạng JSON trong Database. Lớp này hoàn toàn không chứa thông tin về hiển thị, giúp AI có thể dễ dàng phân tích và tái sử dụng nội dung trên nhiều nền tảng khác nhau.

---

## 3. Hệ điều hành AI & Chuẩn Plugin (AI Orchestration)

### 3.1. Plugin Interface & MCP Standard
Mọi Plugin trong SCALECLAW phải tuân thủ chuẩn **Model Context Protocol (MCP)**. Mỗi plugin export:
- **`metadata`**: ID, Version, Permissions.
- **`tools`**: Danh sách hàm được mô tả bằng JSON Schema (Vd: `send_email`, `generate_chart`, `sync_inventory`).
- **`execute`**: Hàm thực thi logic khi AI gọi đến.
- **`ui`**: Renderer và Editor cho người dùng.

### 3.2. AI Orchestrator (Bộ não trung tâm)
Hệ thống AI không chỉ đơn thuần là một khung chat. Nó hoạt động như một **Hệ điều hành**:
1. **Discovery:** Khi khởi động, AI quét toàn bộ Manifest của các Plugin đang cài để đăng ký "năng lực".
2. **Planning:** Khi nhận yêu cầu phức tạp (Vd: "Bán sản phẩm X trên web và đồng bộ với Zalo"), AI sẽ tự chia nhỏ task:
    - Task 1: Dùng Plugin `ProductBlock` để tạo trang sản phẩm.
    - Task 2: Dùng Plugin `ZaloConnector` để cấu hình webhook.
3. **Execution:** AI tự động điền các tham số vào hàm `execute` của từng Plugin và báo cáo kết quả.

---

## 4. Mô hình Marketplace & Hệ sinh thái (The Marketplace)

### 4.1. Common Logic - Different Design (Mô hình kinh doanh)
Đây là "Vũ khí tối thượng" của SCALECLAW:
- Các Developer sẽ không cạnh tranh nhau bằng việc "ai có nhiều tính năng hơn" mà là "ai có thiết kế đẹp và phù hợp với ngành nghề X hơn".
- **Theme Packs:** Dev có thể bán các bộ Layout Themes cho từng ngành (Vd: "The Luxury Clinic Pack", "The Tech Startup Pack"). 
- **Khả năng "Thay áo" (Re-skinning):** Khách hàng có thể đổi Layout Theme cho website chỉ trong 1 click. Dữ liệu (Content) vẫn nguyên vẹn nhưng diện mạo hoàn toàn thay đổi.

### 4.2. Developer Experience (DX)
- **SCALECLAW CLI:** Công cụ tạo plugin, xem trước (Hot Reload) và Publish.
- **AI-Assisted Scaffolding:** Dev chỉ cần đưa một ảnh thiết kế (UI Screenshot), AI của SCALECLAW sẽ hỗ trợ sinh ra mã nguồn của Block tương ứng theo đúng chuẩn của CMS.

---

## 5. Thách thức kỹ thuật & Giải pháp (Technical Hurdles)

- **Isolation (Cô lập):** Sử dụng **Tailwind Prefixing** hoặc **Shadow DOM** để CSS của Plugin không làm vỡ giao diện Core.
- **Dynamic Loading:** Sử dụng cơ chế nạp JS động (Native ESM) giúp hệ thống không bao giờ phải khởi động lại khi cài plugin mới.
- **Remote SSR:** Để SEO tốt, SCALECLAW xây dựng bộ render server-side cho phép server nạp code JS từ URL để sinh ra HTML tĩnh cho Google Bot.

---

## 6. Lộ trình triển khai (Roadmap)

### Giai đoạn 1: Foundations & Core Refactor (Hiện tại)
- [ ] Xây dựng **Dynamic Block Registry**: Cho phép nạp block từ biến trạng thái thay vì import tĩnh.
- [ ] Hoàn thiện **Global Theme Editor**: Quản lý Design Tokens tại `/admin/theme`.
- [ ] Xây dựng **Remote Loader Alpha**: Nạp thử nghiệm một file JS từ Supabase Storage.

### Giai đoạn 2: AI Orchestration (Intelligence)
- [ ] Tích hợp **AI Agent** vào trung tâm điều khiển CMS.
- [ ] Triển khai chuẩn **MCP Manifest** cho các block hiện tại.
- [ ] Xây dựng **Permission System**: Phân quyền cho AI khi gọi các hàm nhạy cảm.

### Giai đoạn 3: Open Source & Marketplace Launch
- [ ] Công bố tài liệu **SCALECLAW SDK** và **CLI**.
- [ ] Mở cổng **Marketplace Beta** cho các đối tác chiến lược.
- [ ] Chiến dịch Hackathon: "Xây dựng 100 Block Themes đầu tiên".

---

## 7. Kết luận (The Conclusion)
SCALECLAW AI-Native CMS không chỉ là một công cụ tạo website. Nó là một nền tảng **Intelligent Platform** nơi mọi thành phần đều có khả năng giao tiếp và cộng tác dưới sự điều phối của AI. Bằng cách tách biệt tuyệt đối giữa Dữ liệu - Logic - Trình bày, SCALECLAW mở ra một kỷ nguyên mới cho ngành CMS mã nguồn mở.
