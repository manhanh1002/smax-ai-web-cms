# Installation Guide - Custom Blocks Integration

Hướng dẫn chi tiết để integrate 11 custom blocks vào hệ thống CMS hiện tại của bạn.

---

## 📋 Yêu Cầu Trước Đó

- Node.js 18+
- React 18+
- TypeScript 4.9+
- Tailwind CSS 3+
- Codebase CMS Smax AI đã setup

---

## 🔧 Bước 1: Copy Files

### 1.1 Copy Renderer Components
```bash
# Copy từ new-blocks/src/components/sections/ 
# đến [YOUR_CMS_PROJECT]/src/components/sections/

cp HeroCentered.tsx ../../src/components/sections/
cp PageHeader.tsx ../../src/components/sections/
cp Timeline.tsx ../../src/components/sections/
cp QuoteHighlight.tsx ../../src/components/sections/
cp AuthorBio.tsx ../../src/components/sections/
cp RichAccordion.tsx ../../src/components/sections/
cp PricingToggle.tsx ../../src/components/sections/
cp CountUpStats.tsx ../../src/components/sections/
cp AnnouncementBar.tsx ../../src/components/sections/
cp TeamGrid.tsx ../../src/components/sections/
cp FeatureChecklist.tsx ../../src/components/sections/
```

### 1.2 Copy Editor Components
```bash
# Copy từ new-blocks/src/components/cms/block-editors/
# đến [YOUR_CMS_PROJECT]/src/components/cms/block-editors/

cp HeroCenteredEditor.tsx ../../src/components/cms/block-editors/
cp PageHeaderEditor.tsx ../../src/components/cms/block-editors/
cp TimelineEditor.tsx ../../src/components/cms/block-editors/
cp QuoteHighlightEditor.tsx ../../src/components/cms/block-editors/
cp AuthorBioEditor.tsx ../../src/components/cms/block-editors/
cp RichAccordionEditor.tsx ../../src/components/cms/block-editors/
cp PricingToggleEditor.tsx ../../src/components/cms/block-editors/
cp CountUpStatsEditor.tsx ../../src/components/cms/block-editors/
cp AnnouncementBarEditor.tsx ../../src/components/cms/block-editors/
cp TeamGridEditor.tsx ../../src/components/cms/block-editors/
cp FeatureChecklistEditor.tsx ../../src/components/cms/block-editors/
```

### 1.3 Copy Registry
```bash
# Copy registry-new-blocks.tsx
cp registry-new-blocks.tsx ../../src/lib/cms/block-system/
```

---

## 🔌 Bước 2: Update Master Registry

### 2.1 Locate Master Registry File
Tìm file `registry.tsx` hoặc `blocks-registry.tsx` hoặc tương tự:
```
src/lib/cms/block-system/registry.tsx
# hoặc
src/cms/registry.tsx
```

### 2.2 Import New Blocks Registry
Thêm import vào đầu file:
```typescript
// src/lib/cms/block-system/registry.tsx

// ... existing imports ...

// Import new blocks
import { CUSTOM_BLOCKS_REGISTRY } from "./registry-new-blocks";
```

### 2.3 Merge vào Master Registry
Tìm nơi định nghĩa `MASTER_BLOCK_REGISTRY` hoặc `BLOCK_REGISTRY` và update:

```typescript
// BEFORE:
export const MASTER_BLOCK_REGISTRY: BlockDefinition[] = [
  // ... existing 19 blocks ...
];

// AFTER:
export const MASTER_BLOCK_REGISTRY: BlockDefinition[] = [
  // ... existing 19 blocks ...
  ...CUSTOM_BLOCKS_REGISTRY,  // Add this line
];
```

### 2.4 Export Functions (Optional)
Nếu cần helper functions:
```typescript
// Thêm exports từ registry-new-blocks.tsx
export { getBlockByType, getBlocksByCategory } from "./registry-new-blocks";
```

---

## ✅ Bước 3: Verify TypeScript

### 3.1 Type Check
```bash
npm run type-check
# hoặc
tsc --noEmit
```

**Expected:** 0 errors

Nếu có error:
- Check import paths chính xác
- Đảm bảo types.ts hoặc BlockDefinition interface exist
- Verify path aliases (@/components, etc) match tsconfig.json

### 3.2 Build Check
```bash
npm run build
```

**Expected:** Success, no TypeScript or build errors

---

## 🚀 Bước 4: Test trong Development

### 4.1 Start Dev Server
```bash
npm run dev
```

### 4.2 Test Admin Panel
1. Mở admin panel
2. Tạo page mới hoặc edit trang hiện tại
3. Kiểm tra block list → phải thấy 11 blocks mới:
   - ⬛ Hero Centered
   - 📄 Page Header
   - ⏱ Timeline
   - ❝ Pull Quote
   - 👤 Author Bio
   - ▼ Rich Accordion
   - 💰 Pricing with Toggle
   - 🔢 Animated Counters
   - 📢 Announcement Bar
   - ✓ Feature Checklist
   - 👥 Team Grid

### 4.3 Test Each Block
Với mỗi block, làm theo:
1. **Add block** → Kéo block vào page
2. **Default data** → Nhìn thấy content mặc định
3. **Edit** → Click block, check editor form xuất hiện
4. **Change data** → Chỉnh sửa field, xem preview update
5. **Save** → Save page, reload → data persist
6. **View** → Xem public site, block render đúng

### 4.4 Test Dark Mode
Nếu site support dark mode:
1. Toggle dark mode
2. Check blocks adapt color scheme
3. Verify contrast ratio (text readable)

### 4.5 Test Responsive
```bash
# Chrome DevTools: F12 → Toggle device toolbar
# Test breakpoints: 375px, 768px, 1024px, 1440px
```

- Mobile (375px): Single column, stacked layout
- Tablet (768px): 2 columns where applicable
- Desktop (1024px+): Full 3+ column grid

---

## 📦 Bước 5: Database Migration (Nếu Cần)

Nếu CMS có migration system, tạo migration để seed default block instances:

```typescript
// migrations/[timestamp]_add_custom_blocks.ts

export async function up(knex: Knex) {
  // Insert sample blocks vào database (nếu cần)
  await knex("blocks").insert([
    {
      type: "heroCentered",
      name: "Sample Hero",
      data: { /* defaultData */ },
      createdAt: new Date(),
    },
    // ... other sample blocks
  ]);
}

export async function down(knex: Knex) {
  await knex("blocks").whereIn("type", [
    "heroCentered", "pageHeader", "timeline", // ... etc
  ]).delete();
}
```

---

## 🎨 Bước 6: Customize (Optional)

### 6.1 Thay đổi Default Colors
```typescript
// src/components/sections/HeroCentered.tsx

const gradients: Record<string, string> = {
  none: "",
  purple: "bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-100",
  // Thay đổi colors tại đây
  blue: "bg-gradient-to-br from-sky-50 via-blue-50 to-cyan-100",
};
```

### 6.2 Thay đổi Typography
```typescript
// Trong component
className="text-3xl md:text-4xl font-black"  // Thay font-black thành font-bold, etc
```

### 6.3 Thêm Custom CSS
Nếu site dùng global CSS, có thể add:
```css
/* src/styles/custom-blocks.css */

.block-hero-centered {
  /* custom styles */
}
```

Sau đó import trong component:
```typescript
import "@/styles/custom-blocks.css";
```

---

## 🔍 Bước 7: Performance Optimization

### 7.1 Code Splitting (Optional)
```typescript
// registry.tsx
import { lazy } from "react";

const HeroCenteredBlock = lazy(() => 
  import("@/components/sections/HeroCentered").then(m => ({ default: m.HeroCenteredBlock }))
);
```

### 7.2 Image Optimization
Đảm bảo image URLs:
- Dùng Next.js `Image` component nếu có
- Lazy load background images
- Compress images trước upload

### 7.3 Bundle Size Check
```bash
npm run build -- --analyze
# hoặc
npx webpack-bundle-analyzer
```

Expected impact: +~50-80KB gzipped (11 blocks + editors)

---

## 📝 Bước 8: Documentation

### 8.1 Update Project Docs
Thêm vào project documentation:
- List 11 blocks mới
- Data structure cho mỗi block
- Screenshot / preview mỗi block
- Link tới wishlist (14 blocks chưa làm)

### 8.2 Create Block Guide
Tạo file `BLOCKS_GUIDE.md`:
```markdown
# Block Reference Guide

## Available Blocks

### HeroCentered
- Used for: Homepage hero, landing page
- Default Data: {...}
- Customization: Change gradient color, text, buttons

### PageHeader
...
```

---

## ⚠️ Troubleshooting

### Error: "Cannot find module '@/components/sections/HeroCentered'"
**Solution:**
- Check file exists: `ls src/components/sections/HeroCentered.tsx`
- Check import path matches file location
- Verify tsconfig.json path aliases correct

### Editor fields not showing
**Solution:**
- Check `defaultData` trong registry có tất cả required fields
- Verify editor component import correct
- Check browser console for React errors

### Block not appearing in list
**Solution:**
- Verify registry entry có `type`, `label`, `renderer`, `editor`
- Check CUSTOM_BLOCKS_REGISTRY merged vào MASTER_BLOCK_REGISTRY
- Restart dev server: `npm run dev`

### TypeScript error "Property 'xyz' does not exist"
**Solution:**
- Check interface definition match actual data usage
- Import interface correct: `import { HeroCenteredData } from "@/components/sections/HeroCentered"`
- Verify all interface fields defined

### Responsive layout broken
**Solution:**
- Check Tailwind CSS classes spelled correctly
- Verify responsive prefixes: `md:`, `lg:`, `sm:`
- Test in browser DevTools (F12 → Toggle device toolbar)

### Dark mode not working
**Solution:**
- Check `darkMode` prop passed correctly to component
- Verify conditional classes use `isDark` variable
- Check dark: prefix in Tailwind config: `darkMode: 'class'`

---

## 📊 Bước 9: Analytics/Monitoring (Optional)

### 9.1 Track Block Usage
```typescript
// Track when blocks are added/removed
function onBlockAdd(blockType: string) {
  analytics.track("block_added", { type: blockType });
}
```

### 9.2 Performance Metrics
```typescript
// Monitor render performance
import { measureWeb Vitals } from "web-vitals";

measureWebVitals(console.log);
```

---

## ✨ Bước 10: Deploy

### 10.1 Staging
```bash
# Build & deploy to staging
npm run build
npm run deploy:staging
```

### 10.2 Test on Staging
- Create test pages with all 11 blocks
- Test on multiple devices/browsers
- Check performance (Lighthouse)
- Verify SEO (if applicable)

### 10.3 Production
```bash
npm run deploy:production
```

### 10.4 Post-Deploy
- Monitor error logs
- Check analytics
- Gather user feedback

---

## 📞 Support Checklist

Sebelum reach out cho support:

- [ ] Copy files completed
- [ ] Registry merged
- [ ] TypeScript clean (`npm run type-check`)
- [ ] Build success (`npm run build`)
- [ ] Blocks visible dalam admin panel
- [ ] Test add/edit/view block berhasil
- [ ] Responsive test passed (mobile, tablet, desktop)
- [ ] Dark mode tested (if applicable)
- [ ] No console errors (F12)

---

## 🎓 Learning Resources

### Tailwind CSS
- https://tailwindcss.com/docs
- Responsive Design: https://tailwindcss.com/docs/responsive-design

### React Best Practices
- Hooks: https://react.dev/reference/react
- Performance: https://react.dev/reference/react/memo

### TypeScript
- Interfaces: https://www.typescriptlang.org/docs/handbook/2/objects.html
- Generics: https://www.typescriptlang.org/docs/handbook/2/generics.html

---

## 📚 Next Steps

1. **Complete installation** → Follow steps 1-8
2. **Test thoroughly** → Step 4 & 8
3. **Deploy** → Step 10
4. **Document** → Keep block-wishlist.md updated
5. **Develop wishlist blocks** → Implement remaining 14 blocks
6. **Community** → Share blocks, get feedback

---

## 📝 Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Apr 2025 | Initial release: 11 blocks + 14 wishlist |

---

**Installation Guide Version:** 1.0.0  
**Last Updated:** April 2025  
**Status:** Ready for Production
