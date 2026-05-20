# Custom Blocks Package - 11 New CMS Blocks

Một bộ **11 custom blocks** hoàn chỉnh được xây dựng cho hệ thống CMS Smax AI, với đầy đủ renderer, editor component, TypeScript types, và registry integration.

**Progress: 44% hoàn thành (11/25 blocks) - 14 blocks trong wishlist chờ phát triển tiếp**

---

## 📦 Cấu Trúc Package

```
new-blocks/
├── src/
│   ├── components/
│   │   ├── sections/              # Render components cho public site
│   │   │   ├── HeroCentered.tsx
│   │   │   ├── PageHeader.tsx
│   │   │   ├── Timeline.tsx
│   │   │   ├── QuoteHighlight.tsx
│   │   │   ├── AuthorBio.tsx
│   │   │   ├── RichAccordion.tsx
│   │   │   ├── PricingToggle.tsx
│   │   │   ├── CountUpStats.tsx
│   │   │   ├── AnnouncementBar.tsx
│   │   │   ├── TeamGrid.tsx
│   │   │   └── FeatureChecklist.tsx
│   │   └── cms/block-editors/     # Editor components cho admin panel
│   │       ├── HeroCenteredEditor.tsx
│   │       ├── PageHeaderEditor.tsx
│   │       ├── TimelineEditor.tsx
│   │       ├── QuoteHighlightEditor.tsx
│   │       ├── AuthorBioEditor.tsx
│   │       ├── RichAccordionEditor.tsx
│   │       ├── PricingToggleEditor.tsx
│   │       ├── CountUpStatsEditor.tsx
│   │       ├── AnnouncementBarEditor.tsx
│   │       ├── TeamGridEditor.tsx
│   │       └── FeatureChecklistEditor.tsx
├── registry-new-blocks.tsx         # Registry + default data
├── block-wishlist.md               # 14 blocks chưa làm - chi tiết từng block
├── README.md                       # File này
└── INSTALL.md                      # Hướng dẫn cài đặt

```

---

## ✨ Blocks Đã Hoàn Thành (11)

### Layout Category (2 blocks)
1. **HeroCentered** - Hero toàn màn hình text căn giữa, có gradient nền
2. **PageHeader** - Header cho inner pages, breadcrumb, metadata, tags

### Content Category (4 blocks)
3. **Timeline** - Dòng thời gian dọc/ngang (milestones, roadmap, lịch sử)
4. **QuoteHighlight** - Trích dẫn nổi bật với tác giả và avatar
5. **AuthorBio** - Card tác giả với tiểu sử, mạng xã hội
6. **RichAccordion** - Accordion nội dung tổng quát (hỗ trợ rich text)

### Marketing Category (4 blocks)
7. **PricingToggle** - Bảng giá với toggle tháng/năm animated
8. **CountUpStats** - Số liệu đếm lên animated khi scroll vào (animated counters)
9. **AnnouncementBar** - Dải thông báo dismissible (khuyến mãi, sự kiện)
10. **FeatureChecklist** - Ma trận so sánh 2 cột (✓/✗ checkmarks)

### Social / Forms Category (1 block)
11. **TeamGrid** - Grid thành viên công ty (ảnh, tên, chức danh, social links)

---

## 🚀 Quick Start - Cài Đặt

### Bước 1: Copy Files vào Codebase
```bash
# Copy components
cp -r src/components/sections/* [YOUR_CMS]/src/components/sections/
cp -r src/components/cms/block-editors/* [YOUR_CMS]/src/components/cms/block-editors/

# Copy registry
cp registry-new-blocks.tsx [YOUR_CMS]/src/lib/cms/block-system/
```

### Bước 2: Merge Registry
Thêm các blocks mới vào `MASTER_BLOCK_REGISTRY` hiện tại:

```typescript
// Trong src/lib/cms/block-system/registry.tsx

// Import các blocks mới
import { CUSTOM_BLOCKS_REGISTRY } from "./registry-new-blocks";

// Merge vào master registry
export const MASTER_BLOCK_REGISTRY: BlockDefinition[] = [
  ...EXISTING_BLOCKS,  // 19 blocks hiện tại
  ...CUSTOM_BLOCKS_REGISTRY  // 11 blocks mới
];
```

### Bước 3: Kiểm Tra
- Validate TypeScript: `npm run type-check`
- Build: `npm run build`
- Test components: Mở admin panel, check các blocks mới trong list

---

## 📋 Data Structures

Mỗi block có một interface `[BlockName]Data` chứa tất cả props:

### Ví dụ: HeroCenteredData
```typescript
interface HeroCenteredData {
  badge?: string;
  title: string;                // Required
  highlight?: string;           // Highlighted text (màu nổi)
  subtitle?: string;
  primaryBtn?: string;
  primaryBtnUrl?: string;
  secondaryBtn?: string;
  secondaryBtnUrl?: string;
  bgGradient?: "none" | "purple" | "blue" | "teal" | "orange";
  darkMode?: boolean;
  eyebrowIcon?: string;          // Emoji icon trước badge
}
```

Tất cả interfaces được export từ component file (ví dụ: `HeroCentered.tsx`).

---

## 🎨 Design System

### Tailwind Setup
- Sử dụng Tailwind CSS v3+
- Responsive breakpoints: `sm:`, `md:`, `lg:`
- Max-width sections: `max-w-6xl`, `max-w-5xl`, `max-w-4xl`
- Spacing: `py-20 px-4` cho section padding

### Dark Mode
- Tất cả blocks support dark mode (`darkMode` prop)
- Use `cn()` utility để conditional classes
- Color: `bg-slate-900` (dark), `bg-white` (light)

### Colors (Accent)
- Primary: Violet (#8B5CF6)
- Secondary: Blue, Teal, Orange, Rose (tuỳ block)
- Success: Emerald
- Muted: Slate gray

---

## 🛠️ Customization Guide

### Thay đổi Default Data
Sửa `defaultData` field trong `registry-new-blocks.tsx`:

```typescript
{
  type: "heroCentered",
  // ...
  defaultData: {
    title: "Your custom default title",
    // ...
  }
}
```

### Thêm Custom CSS
Tất cả styling đã inline hoặc Tailwind. Để thêm custom:

```typescript
// Trong component
<div className={cn("base-classes", customClass)}>
```

### Extend Block Data
```typescript
// Thêm field mới
interface HeroCenteredData {
  // ... existing
  customField?: string;  // Thêm field này
}

// Update editor
<Input value={data.customField ?? ""} onChange={(e) => update({ customField: e.target.value })} />
```

---

## 📱 Responsive Behavior

Tất cả blocks được thiết kế mobile-first:

| Screen | Breakpoint | Layout |
|--------|-----------|--------|
| Mobile | < 640px   | Single column, stacked |
| Tablet | 640-1024px | 2 columns |
| Desktop | > 1024px   | 3+ columns, full layout |

Ví dụ:
```typescript
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
```

---

## 🌙 Dark Mode Support

Mỗi block nhận `darkMode: boolean` prop:

```typescript
const isDark = data.darkMode ?? false;

// Conditional styling
className={isDark ? "bg-slate-900 text-white" : "bg-white text-slate-900"}
```

---

## 📖 Component Patterns

### Renderer Component
```typescript
export interface MyBlockData {
  title: string;
  // ... other fields
  darkMode?: boolean;
}

export function MyBlock({ data }: { data: MyBlockData }) {
  const isDark = data.darkMode ?? false;
  return (
    <section className={cn("py-20 px-4", isDark ? "bg-slate-900" : "bg-white")}>
      {/* Component markup */}
    </section>
  );
}
```

### Editor Component
```typescript
export function MyBlockEditor({ data, onChange }: { data: MyBlockData; onChange: (data: MyBlockData) => void }) {
  const update = (updates: Partial<MyBlockData>) => onChange({ ...data, ...updates });
  
  return (
    <div className="space-y-4">
      <Input value={data.title} onChange={(e) => update({ title: e.target.value })} />
      {/* Editor fields */}
    </div>
  );
}
```

---

## 🔌 Registry Integration

Mỗi block phải có entry trong registry:

```typescript
{
  type: "myBlock",
  label: "🎨 My Block",
  description: "Mô tả ngắn gọn",
  category: "layout" | "content" | "marketing" | "social",
  renderer: MyBlock,
  editor: MyBlockEditor,
  defaultData: { /* default values */ }
}
```

---

## ✅ Validation

### TypeScript
Tất cả blocks đã compile clean, không có `any` types.

### Performance
- Lazy load hình ảnh nếu có
- Intersection Observer cho animated counters
- Memoization cho heavy re-renders

### Accessibility
- Semantic HTML (section, nav, button, etc.)
- ARIA labels cho interactive elements
- Keyboard navigation (Tab, Enter, Escape)
- Color contrast ratio >= 4.5:1

---

## 📚 Wishlist - Blocks Chưa Làm

14 blocks trong `block-wishlist.md` đợi phát triển:

**Layout (1):**
- `videoHero` - Video autoplay nền toàn màn hình
- `stickyAnchorNav` - Navigation sticky theo scroll

**Content (5):**
- `beforeAfter` - Slider so sánh ảnh trước/sau
- `imageGallery` - Lưới ảnh masonry + lightbox
- `videoSection` - Embed video YouTube/Vimeo
- `glossary` - Từ điển thuật ngữ với search + filter

**Marketing (5):**
- `compareTable` - Ma trận so sánh tính năng chi tiết
- `integrationsHub` - Grid tích hợp lọc theo category
- `downloadCards` - Tài nguyên ebook/whitepaper
- `mobileAppPreview` - Mockup app + App Store/Play badges
- `jobListings` - Danh sách vị trí tuyển dụng

**Social/Forms (3):**
- `contactForm` - Form liên hệ standalone
- `newsletterSignup` - Email signup lightweight
- `mapContact` - Google Maps + contact info
- `reviewBadges` - Rating badges từ G2, Capterra, Trustpilot
- `relatedContent` - Grid bài liên quan cuối trang

Xem `block-wishlist.md` để chi tiết từng block (data fields, requirements, etc).

---

## 🤝 Contributing

Để thêm block mới từ wishlist:

1. Tạo issue / PR với block name
2. Sao chép template từ block hiện có
3. Implement theo spec trong wishlist
4. Test: renderer + editor + responsive
5. Đảm bảo TypeScript clean
6. Submit PR + add entry vào registry

---

## 📝 File Naming

```
Block Name: FeatureChecklist
File: FeatureChecklist.tsx (renderer)
File: FeatureChecklistEditor.tsx (editor)
Interface: interface FeatureChecklistData { }
Type: type: "featureChecklist" (camelCase)
Label: "✓ Feature Checklist" (with emoji + Title Case)
```

---

## 🐛 Troubleshooting

### Build Error: "Cannot find module"
→ Kiểm tra import paths trong registry

### Editor không hiện fields
→ Đảm bảo `data` object có tất cả required fields

### Dark mode không hoạt động
→ Check `isDark` variable được dùng đúng, `data.darkMode` tồn tại

### Responsive layout lỗi
→ Kiểm tra grid columns, padding, max-width

---

## 📞 Support

Nếu gặp vấn đề:
1. Check TypeScript errors: `npm run type-check`
2. Kiểm tra console browser (F12)
3. Validate data structure với interface
4. Test từng component riêng lẻ

---

## 🎯 Next Steps

1. **Merge code** → Copy files vào codebase
2. **Test** → Kiểm tra admin panel
3. **Deploy** → Build + deploy
4. **Develop wishlist** → Implement 14 blocks còn lại

---

**Created:** April 2025  
**Version:** 1.0.0  
**Status:** Production Ready (11/25 blocks complete)
