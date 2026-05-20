# Hướng dẫn Phát triển Theme mới cho Hệ thống Block

Tài liệu này dành cho các nhà phát triển muốn tạo một bộ giao diện (Theme) mới (ví dụ: `corporate`, `minimal`, `dark-mode-only`) dựa trên hệ thống block hiện có mà không cần thay đổi cấu trúc dữ liệu lõi.

## 1. Nguyên lý hoạt động
Hệ thống sử dụng mô hình **Dispatcher**. Một Block duy nhất (ví dụ: `Hero`) sẽ có một bộ dữ liệu (`data`) và một trình chỉnh sửa (`editor`), nhưng có thể có nhiều cách hiển thị (`themes`).

Cấu trúc thư mục của một block:
```
src/blocks/my-block/
├── definition.ts  (Dữ liệu dùng chung)
├── editor.tsx      (Giao diện chỉnh sửa dùng chung)
├── index.tsx       (Bộ điều hướng - Dispatcher)
└── themes/         (Nơi chứa các theme)
    ├── saas.tsx    (Theme mặc định hiện tại)
    └── corporate.tsx (Theme mới bạn sắp tạo)
```

## 2. Các bước tạo Theme mới

### Bước 1: Tạo file giao diện mới
Tạo tệp mới trong thư mục `themes/` của block bạn muốn thay đổi.

**Ví dụ: `src/blocks/hero/themes/corporate.tsx`**
```tsx
"use client";
import React from "react";
import { cn } from "@/lib/utils";

export function HeroCorporate({ data, isDark, settings }) {
  return (
    <div className="py-20 text-center border-b border-slate-100">
      <h1 className="text-6xl font-serif mb-6">{data.title}</h1>
      <p className="text-xl text-slate-600 mb-10">{data.subtitle}</p>
      {/* Logic hiển thị kiểu Corporate khác hoàn toàn với SaaS */}
    </div>
  );
}
```

### Bước 2: Đăng ký Theme vào Dispatcher
Mở file `index.tsx` của block đó và thêm điều kiện để hiển thị theme mới.

**File: `src/blocks/hero/index.tsx`**
```tsx
import { BlockWrapper } from "../BlockWrapper";
import { HeroSaaS } from "./themes/saas";
import { HeroCorporate } from "./themes/corporate"; // Import theme mới

export function HeroBlockDispatcher({ data }) {
  const theme = data.theme || "saas"; // Lấy theme từ dữ liệu
  const isDark = data.settings?.background === "dark";

  return (
    <BlockWrapper settings={data.settings}>
      {theme === "saas" && <HeroSaaS data={data} isDark={isDark} settings={data.settings} />}
      {theme === "corporate" && <HeroCorporate data={data} isDark={isDark} settings={data.settings} />}
    </BlockWrapper>
  );
}
```

### Bước 3: Thêm lựa chọn Theme trong Editor (Tùy chọn)
Nếu bạn muốn người dùng có thể chọn theme ngay trong lúc sửa block, hãy thêm trường `theme` vào `editor.tsx`.

**File: `src/blocks/hero/editor.tsx`**
```tsx
<Field label="Giao diện (Theme)">
  <select 
    value={data.theme || "saas"} 
    onChange={e => onChange({ ...data, theme: e.target.value })}
    className="..."
  >
    <option value="saas">SaaS Theme</option>
    <option value="corporate">Corporate Theme</option>
  </select>
</Field>
```

## 3. Các lưu ý khi phát triển Theme
1. **Sử dụng BlockWrapper**: Luôn đảm bảo `index.tsx` bọc các theme trong `BlockWrapper`. Theme con không nên tự bọc lại để tránh lồng nhau quá nhiều lớp.
2. **Tận dụng Props**: Luôn nhận đủ `{ data, isDark, settings }` để theme có thể phản ứng với các cài đặt về căn lề (textAlign) hoặc chế độ tối (isDark).
3. **Giữ nguyên Dữ liệu**: Không được thay đổi cấu trúc của `data` vì nó sẽ làm hỏng khả năng tương thích của các theme khác. Nếu cần thêm dữ liệu, hãy thêm vào `definition.ts` dưới dạng thuộc tính tùy chọn (optional).
4. **CSS**: Ưu tiên sử dụng TailwindCSS. Nếu cần CSS tùy chỉnh, hãy khai báo trong file theme hoặc sử dụng CSS Modules để tránh xung đột giữa các theme.

## 5. Tạo Block hoàn toàn mới cho Theme
Nếu bạn muốn tạo một block chỉ dành riêng cho theme của mình (không có trong bộ block mặc định), hãy làm theo các bước sau:

1. **Khởi tạo cấu trúc**: Tạo thư mục `src/blocks/[block-name]` với đầy đủ 4 file như hướng dẫn ở trên.
2. **Gắn nhãn Theme**: Trong `definition.ts`, hãy thêm thông tin theme vào nhãn hoặc mô tả để dễ nhận diện.
3. **Đăng ký vào Hệ thống**: Mở `src/lib/cms/block-system/registry.tsx` và:
   - Import `[BlockName]Def` từ thư mục block của bạn.
   - Thêm nó vào mảng `MASTER_BLOCK_REGISTRY`.

**Lưu ý quan trọng về tính tương thích:**
Nếu block của bạn chỉ hoạt động với một theme nhất định, hãy đảm bảo `defaultData` của nó chứa thuộc tính `theme: 'tên-theme-của-bạn'`.

## 6. Hiển thị thông tin Theme trong Admin
Hệ thống Admin hỗ trợ hiển thị các tag theme để người dùng biết block nào thuộc về theme nào. Để kích hoạt tính năng này, hãy đảm bảo `definition.ts` của bạn có thuộc tính `supportedThemes` (nếu có).

```typescript
export const MyNewBlockDef: BlockDefinition = {
  type: "my-new-block",
  label: "🎁 Special Block",
  supportedThemes: ["corporate", "minimal"], // Danh sách theme hỗ trợ
  // ...
};
```
