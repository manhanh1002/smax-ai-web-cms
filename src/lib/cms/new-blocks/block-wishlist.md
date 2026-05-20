# Block Wishlist - Chưa Hoàn Thành

Các blocks sau đây chưa được triển khai và sẵn sàng cho AI khác hoặc phát triển tiếp theo.

---

## Layout Blocks

### `videoHero`
**Label:** ▶ Video Hero  
**Nơi dùng:** Trang chủ, landing page  
**Mô tả:** Video autoplay nền toàn màn hình, overlay mờ, text + CTA nổi lên trên.

**Data fields:**
```typescript
interface VideoHeroData {
  videoUrl: string;           // URL video (YouTube, Vimeo, hoặc direct mp4)
  posterUrl?: string;         // Thumbnail hiển thị trước khi load video
  title: string;              // Tiêu đề chính
  subtitle?: string;          // Mô tả ngắn
  ctaText?: string;           // Text nút CTA
  ctaUrl?: string;            // URL nút CTA
  overlayOpacity?: number;    // 0-100, mức độ mờ overlay
  darkMode?: boolean;
}
```

**Yêu cầu:**
- Video tự động phát (autoplay), loop
- Overlay tối để text dễ đọc
- Responsive: trên mobile có thể dùng poster image thay video
- Hỗ trợ mute/unmute control
- Fallback cho browser không support video

---

### `stickyAnchorNav`
**Label:** 📌 Sticky Anchor Nav  
**Nơi dùng:** Trang dài có nhiều section, trang product  
**Mô tả:** Thanh nav sticky theo scroll, highlight section hiện tại, link đến các phần của trang.

**Data fields:**
```typescript
interface AnchorItem {
  label: string;
  anchor: string;             // ID element để scroll tới (e.g., "#features")
}

interface StickyAnchorNavData {
  items: AnchorItem[];
  offset?: number;            // Pixel offset khi scroll tới
  darkMode?: boolean;
  alignment?: "left" | "center";  // Vị trí nav trên trang
  position?: "top" | "side";  // sticky ở top hay bên cạnh
}
```

**Yêu cầu:**
- Theo dõi scroll position, highlight active section
- Smooth scroll khi click item
- Responsive: mobile dùng horizontal scroll, desktop side/top
- Intersection Observer để detect active section

---

## Content Blocks

### `beforeAfter`
**Label:** ↔ Before / After Slider  
**Nơi dùng:** Portfolio, case study, product demo  
**Mô tả:** Kéo thanh trượt để so sánh ảnh trước/sau trực quan.

**Data fields:**
```typescript
interface BeforeAfterData {
  beforeImage: string;        // URL ảnh trước
  afterImage: string;         // URL ảnh sau
  beforeLabel?: string;       // "Trước"
  afterLabel?: string;        // "Sau"
  title?: string;
  subtitle?: string;
  darkMode?: boolean;
}
```

**Yêu cầu:**
- Drag slider hoặc click/touch trượt
- Smooth animation khi drag
- Handle responsive images
- Accessibility: keyboard support

---

### `imageGallery`
**Label:** 🖼 Image Gallery  
**Nơi dùng:** Portfolio, event, product showcase  
**Mô tả:** Lưới ảnh masonry hoặc grid đều, click mở lightbox.

**Data fields:**
```typescript
interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
  category?: string;
}

interface ImageGalleryData {
  title?: string;
  images: GalleryImage[];
  columns?: 2 | 3 | 4;
  layout?: "grid" | "masonry";
  showFilter?: boolean;       // Filter theo category
  enableLightbox?: boolean;
  darkMode?: boolean;
}
```

**Yêu cầu:**
- Lightbox modal với prev/next navigation
- Masonry layout: Pinterest-style dynamic height
- Filter by category nếu có
- Lazy loading hình ảnh
- Keyboard navigation (arrow keys, ESC)

---

### `videoSection`
**Label:** ▶ Video Embed  
**Nơi dùng:** Bài blog, trang sản phẩm, tutorial  
**Mô tả:** Thumbnail lớn + nút play, embed YouTube/Vimeo, mô tả bên dưới.

**Data fields:**
```typescript
interface VideoSectionData {
  videoUrl: string;           // YouTube/Vimeo URL
  thumbnailUrl?: string;      // Custom thumbnail
  title: string;
  description?: string;
  layout?: "centered" | "split";  // split = thumbnail trái, info phải
  darkMode?: boolean;
}
```

**Yêu cầu:**
- Embed video responsive (16:9, 21:9, 4:3)
- Custom thumbnail click mở video
- Hỗ trợ YouTube, Vimeo, HTML5 video
- lazyload iframe

---

### `glossary`
**Label:** 📖 Glossary / Terms  
**Nơi dùng:** Trang docs, knowledge base, product feature  
**Mô tả:** Từ điển thuật ngữ: lọc theo chữ cái, tìm kiếm, accordion định nghĩa.

**Data fields:**
```typescript
interface Term {
  term: string;
  definition: string;
  category?: string;
  example?: string;           // Ví dụ sử dụng
}

interface GlossaryData {
  title: string;
  terms: Term[];
  showFilter?: boolean;       // A-Z filter
  showSearch?: boolean;       // Tìm kiếm
  groupByCategory?: boolean;
  darkMode?: boolean;
}
```

**Yêu cầu:**
- A-Z filter buttons
- Search input real-time
- Group by category optional
- Accordion hoặc modal definition
- Sorting options

---

## Marketing Blocks

### `compareTable`
**Label:** ⊞ Feature Compare Matrix  
**Nơi dùng:** Pricing page, product feature, enterprise comparison  
**Mô tả:** Ma trận so sánh tính năng: ✓/✗/giá trị, sticky header, group theo category.

**Data fields:**
```typescript
interface Feature {
  label: string;
  values: (boolean | string | number)[];  // Giá trị cho từng plan
}

interface FeatureCategory {
  name: string;
  features: Feature[];
}

interface CompareTableData {
  plans: string[];            // Tên các gói
  categories: FeatureCategory[];
  highlightCol?: number;      // Index plan được highlight
  darkMode?: boolean;
}
```

**Yêu cầu:**
- Sticky header khi scroll ngang/dọc
- Responsive: mobile dùng card view hoặc horizontal scroll
- Color coding cho values: ✓ = green, ✗ = gray, value = neutral
- Highlight so sánh cột được chọn

---

### `integrationsHub`
**Label:** ⚡ Integrations Hub  
**Nơi dùng:** Trang integrations, partners, ecosystem  
**Mô tả:** Grid tích hợp có thể lọc theo category, search, link đến trang chi tiết.

**Data fields:**
```typescript
interface Integration {
  name: string;
  logo: string;               // URL logo
  category: string;           // "Analytics", "CRM", "Payment", etc
  description?: string;
  url: string;                // Link chi tiết
  featured?: boolean;
}

interface IntegrationsHubData {
  title: string;
  integrations: Integration[];
  categories: string[];
  showSearch?: boolean;
  columnsPerRow?: 3 | 4 | 5;
  darkMode?: boolean;
}
```

**Yêu cầu:**
- Filter by category buttons
- Search input
- Featured integrations hiện trên top
- Card hover effect
- Responsive grid

---

### `downloadCards`
**Label:** ⬇ Resource Downloads  
**Nơi dùng:** Resource center, lead magnet, content marketing  
**Mô tả:** Cards tài nguyên: ebook, whitepaper, template — icon loại file, nút download.

**Data fields:**
```typescript
interface Resource {
  title: string;
  description: string;
  fileType: "pdf" | "doc" | "xls" | "zip" | "video";  // Để hiển thị icon
  fileSize: string;           // "2.4 MB"
  thumbnailUrl?: string;
  downloadUrl: string;
  category?: string;
}

interface DownloadCardsData {
  title: string;
  subtitle?: string;
  resources: Resource[];
  columns?: 2 | 3;
  darkMode?: boolean;
}
```

**Yêu cầu:**
- File type icons (PDF, Word, Excel, ZIP, Video)
- Download button
- Optional file size/info badge
- Responsive grid
- Category filter optional

---

### `mobileAppPreview`
**Label:** 📱 Mobile App Preview  
**Nơi dùng:** App landing page, product showcase  
**Mô tả:** Mockup điện thoại + badge App Store/Google Play + feature list bên cạnh.

**Data fields:**
```typescript
interface MobileAppPreviewData {
  title: string;
  subtitle?: string;
  mockupImage: string;        // Screenshot hoặc GIF app
  appStoreUrl?: string;       // URL tới App Store
  playStoreUrl?: string;      // URL tới Google Play
  features: string[];         // 4-5 feature highlight
  layout?: "image-left" | "image-right" | "stacked";
  darkMode?: boolean;
}
```

**Yêu cầu:**
- Device frame mockup (iPhone 15, Android device)
- App Store / Google Play badges
- Feature list beside/below mockup
- Responsive: mobile stacked layout
- Optional: video loop thay image

---

## Social / Forms Blocks

### `contactForm`
**Label:** ✉ Contact Form  
**Nơi dùng:** Trang contact, footer, modal  
**Mô tả:** Form liên hệ standalone: tên, email, SĐT, nội dung + info bên cạnh.

**Data fields:**
```typescript
interface FormField {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "textarea" | "select" | "checkbox";
  required: boolean;
  placeholder?: string;
  options?: string[];         // Cho select
}

interface ContactInfo {
  address?: string;
  phone?: string;
  email?: string;
  hours?: string;             // "Mon-Fri 9-5"
}

interface ContactFormData {
  title: string;
  subtitle?: string;
  fields: FormField[];
  submitUrl: string;          // POST endpoint
  submitText?: string;
  contactInfo?: ContactInfo;
  layout?: "side-by-side" | "form-only";
  darkMode?: boolean;
}
```

**Yêu cầu:**
- Form validation client-side
- Submit handling (POST to submitUrl)
- Success/error message display
- Contact info card optional bên cạnh
- CSRF token handling

---

### `newsletterSignup`
**Label:** 📧 Newsletter Signup  
**Nơi dùng:** Homepage, blog, footer, modal  
**Mô tả:** Section đăng ký nhận bản tin: email input, social proof, subscriber count.

**Data fields:**
```typescript
interface NewsletterSignupData {
  title: string;
  subtitle?: string;
  placeholder?: string;       // "Nhập email của bạn..."
  submitText?: string;        // "Đăng ký"
  submitUrl: string;          // POST endpoint
  subscriberCount?: string;   // "10,000+ đã đăng ký"
  bgStyle?: "light" | "dark" | "gradient";
  darkMode?: boolean;
}
```

**Yêu cầu:**
- Email validation
- Single field email input
- Submit button
- Optional: subscriber count badge
- Success: confirmation message hoặc redirect
- Optional: double opt-in email

---

### `mapContact`
**Label:** 📍 Map + Contact Info  
**Nơi dùng:** Trang liên hệ, office locations  
**Mô tả:** Google Maps embed bên trái, thông tin văn phòng (địa chỉ, giờ, SĐT) bên phải.

**Data fields:**
```typescript
interface Office {
  name: string;
  address: string;
  phone: string;
  email: string;
  hours?: string;             // "Mon-Fri 9am-5pm"
  mapEmbed?: string;          // Google Maps embed iframe
}

interface MapContactData {
  mapEmbedUrl: string;        // Google Maps iframe src
  offices: Office[];
  layout?: "map-left" | "map-right" | "full-width";
  darkMode?: boolean;
}
```

**Yêu cầu:**
- Google Maps embed responsive
- Multiple offices support
- Tab/select để chuyển office
- Contact card format
- Mobile: stacked layout

---

### `reviewBadges`
**Label:** ⭐ Review Platform Badges  
**Nơi dùng:** Homepage, product page, footer  
**Mô tả:** Badges rating từ G2, Capterra, Trustpilot, Google Reviews.

**Data fields:**
```typescript
interface ReviewBadge {
  platform: "g2" | "capterra" | "trustpilot" | "google" | "custom";
  rating: number;             // 4.5
  reviewCount: number;        // 1234
  badgeUrl?: string;          // Logo/badge image
  url: string;                // Link tới review page
}

interface ReviewBadgesData {
  title?: string;
  badges: ReviewBadge[];
  layout?: "horizontal" | "grid";
  darkMode?: boolean;
}
```

**Yêu cầu:**
- Badge display với rating stars
- Review count
- Link tới review page
- Responsive grid layout
- Platform-specific styling optional

---

### `relatedContent`
**Label:** 🔗 Related Content  
**Nơi dùng:** Cuối blog post, article footer  
**Mô tả:** Grid bài liên quan cuối trang: blog posts, case studies, hoặc mixed content.

**Data fields:**
```typescript
interface ContentItem {
  type: "blog" | "case-study" | "video" | "resource";
  title: string;
  thumbnail: string;
  url: string;
  date?: string;
  tag?: string;
  excerpt?: string;
}

interface RelatedContentData {
  title?: string;
  items: ContentItem[];
  columns?: 2 | 3;
  showType?: boolean;         // Hiện "Blog", "Case Study", etc
  showDate?: boolean;
  showTags?: boolean;
  maxItems?: number;
  darkMode?: boolean;
}
```

**Yêu cầu:**
- Content type badge
- Responsive grid
- Optional: filter by tag
- Thumbnail + metadata
- Related items sorting (by date, popularity)

---

## Hướng Dẫn Hoàn Thành

### Cho AI Developer:
1. Sao chép file template từ folder hiện tại
2. Tạo `[BlockName].tsx` trong `src/components/sections/`
3. Tạo `[BlockName]Editor.tsx` trong `src/components/cms/block-editors/`
4. Export `interface [BlockName]Data` từ renderer component
5. Thêm entry vào `registry-new-blocks.tsx` (copy format từ blocks hiện có)
6. Test renderer + editor hoạt động đúng
7. Commit + PR

### Quy Chuẩn Code:
- Dùng Tailwind CSS cho styling
- Hỗ trợ darkMode từ data object
- Responsive design: mobile-first
- TypeScript types bắt buộc
- Max width: `max-w-6xl` hoặc `max-w-5xl`
- Spacing: `py-20 px-4` cho section
- Accessibility: semantic HTML, ARIA labels

### Testing Checklist:
- [ ] Renderer display đúng
- [ ] Editor fields đều hoạt động
- [ ] Dark mode hoạt động
- [ ] Responsive mobile (375px, 768px, 1024px)
- [ ] Default data đầy đủ
- [ ] Không có console errors
- [ ] TypeScript compile clean

---

## Status Summary

| Block | Renderer | Editor | Status |
|-------|----------|--------|--------|
| heroCentered | ✅ | ✅ | Done |
| pageHeader | ✅ | ✅ | Done |
| timeline | ✅ | ✅ | Done |
| quoteHighlight | ✅ | ✅ | Done |
| authorBio | ✅ | ✅ | Done |
| richAccordion | ✅ | ✅ | Done |
| pricingToggle | ✅ | ✅ | Done |
| countUpStats | ✅ | ✅ | Done |
| announcementBar | ✅ | ✅ | Done |
| teamGrid | ✅ | ✅ | Done |
| featureChecklist | ✅ | ✅ | Done |
| videoHero | ❌ | ❌ | Wishlist |
| stickyAnchorNav | ❌ | ❌ | Wishlist |
| beforeAfter | ❌ | ❌ | Wishlist |
| imageGallery | ❌ | ❌ | Wishlist |
| videoSection | ❌ | ❌ | Wishlist |
| glossary | ❌ | ❌ | Wishlist |
| compareTable | ❌ | ❌ | Wishlist |
| integrationsHub | ❌ | ❌ | Wishlist |
| downloadCards | ❌ | ❌ | Wishlist |
| mobileAppPreview | ❌ | ❌ | Wishlist |
| contactForm | ❌ | ❌ | Wishlist |
| newsletterSignup | ❌ | ❌ | Wishlist |
| mapContact | ❌ | ❌ | Wishlist |
| reviewBadges | ❌ | ❌ | Wishlist |
| relatedContent | ❌ | ❌ | Wishlist |

**Progress: 11/25 blocks = 44% hoàn thành**

---

## Ghi Chú

- Tất cả blocks đã hoàn thành đều có đầy đủ TypeScript types
- Registry file có thể được merge vào codebase hiện tại
- Blocks được thiết kế để tái sử dụng và mở rộng
- Dark mode là tính năng bắt buộc trên tất cả blocks
- Responsive design tested trên mobile, tablet, desktop
