# Hướng dẫn chuyển đổi sang Kiến trúc Block Mới (Theme-based Architecture)

Bạn là một chuyên gia về Next.js và CMS Architecture. Nhiệm vụ của bạn là chuyển đổi các Block cũ (đang nằm trong `src/components/sections`) sang kiến trúc mới (nằm trong `src/blocks`) với các tiêu chuẩn cao nhất về thiết kế, khả năng tùy biến và quản lý theme.

## 1. Cấu trúc Thư mục mới
Mỗi block phải nằm trong một thư mục riêng tại `src/blocks/[block-name]` với các tệp sau:
- `definition.ts`: Định nghĩa kiểu dữ liệu (Interface), nhãn, danh mục và dữ liệu mặc định.
- `index.tsx`: Dispatcher - Thành phần điều hướng chính, chọn theme để render và bọc trong `BlockWrapper`.
- `editor.tsx`: Giao diện chỉnh sửa trong Admin sử dụng các thành phần shared của hệ thống.
- `themes/`: Thư mục chứa các giao diện thực tế (ví dụ: `saas.tsx`).

## 2. Các quy tắc quan trọng
- **BlockWrapper**: Mọi block PHẢI được bọc trong `<BlockWrapper settings={data.settings}>` ở file `index.tsx`. Điều này đảm bảo các cài đặt về Padding, Background, và Animation hoạt động tự động.
- **Theme Support**: Renderer chính (`themes/saas.tsx`) nên nhận props `{ data, isDark, settings }`.
- **MediaPicker**: Luôn sử dụng `MediaPicker` thay vì ô nhập text thuần túy cho các trường hình ảnh.
- **Editor Shared Components**: Sử dụng `Field`, `Inp`, `Txt`, `BlockSettingsEditor` và ĐẶC BIỆT là `ActionPicker` từ `@/components/cms/block-editors/shared`.
- **Universal Action System**: Các trường URL hoặc nút bấm PHẢI sử dụng kiểu dữ liệu `ButtonAction` thay vì `string`.
- **Action Execution**: Trong Theme renderer, sử dụng hook `useActionExecutor` để thực thi hành động khi người dùng nhấn nút. Tránh sử dụng thẻ `<a>` trực tiếp cho các hành động phức tạp như Popup hoặc Block Anchor.
- **Lucide Icons**: Sử dụng Lucide icons cho nhãn trong `definition.ts`.

---

## 3. Ví dụ chi tiết

### Ví dụ 1: Block Phức tạp (Features Block)
Block này có danh sách các item, mỗi item có ảnh, text và nút bấm.

**File: `definition.ts`**
```typescript
import { BlockDefinition, BlockData } from "../types";
import { FeaturesBlockDispatcher } from "./index";
import { FeaturesBlockEditor } from "./editor";

export interface FeatureItem {
  tag?: string;
  title: string;
  points: string[];
  stat?: string;
  image?: string;
  reversed?: boolean;
}

export interface FeaturesBlockData {
  badge?: string;
  titleHighlight?: string;
  title?: string;
  subtitle?: string;
  items: FeatureItem[];
  // Ví dụ nút bấm chung của block
  primaryBtnText?: string;
  primaryBtnAction?: any; // ButtonAction
}

export const FeaturesBlockDef: BlockDefinition<BlockData<FeaturesBlockData>> = {
  type: "features",
  label: "⚡ Tính năng Row",
  description: "Các hàng tính năng xen kẽ với ảnh và nội dung chi tiết.",
  category: "content",
  defaultData: {
    theme: "saas",
    settings: {
      paddingTop: "large",
      paddingBottom: "large",
      background: "default"
    },
    badge: "Giải pháp tối ưu",
    title: "cho doanh nghiệp",
    items: []
  },
  renderer: FeaturesBlockDispatcher,
  editor: FeaturesBlockEditor
};
```

**File: `editor.tsx`**
```tsx
"use client";
import React, { useState } from "react";
import { Field, Inp, Txt, BlockSettingsEditor, ActionPicker } from "@/components/cms/block-editors/shared";
import { MediaPicker } from "@/components/cms/MediaPicker";
import { Button } from "@/components/ui/Button";
import { Plus, Trash2, Image as ImageIcon, LayoutTemplate, Type } from "lucide-react";

export function FeaturesBlockEditor({ data, onChange }) {
  const [activeTab, setActiveTab] = useState("content");
  const updateData = (key, val) => onChange({ ...data, [key]: val });

  const addItem = () => {
    const next = [...(data.items || []), { title: "Tính năng mới", points: [] }];
    updateData("items", next);
  };

  return (
    <div className="space-y-6">
      <div className="flex border-b border-slate-200">
        <button onClick={() => setActiveTab("content")} className="...">Nội dung</button>
        <button onClick={() => setActiveTab("design")} className="...">Thiết kế</button>
      </div>

      {activeTab === "content" ? (
        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Badge"><Inp value={data.badge} onChange={v => updateData("badge", v)} /></Field>
            <Field label="Highlight"><Inp value={data.titleHighlight} onChange={v => updateData("titleHighlight", v)} /></Field>
            <div className="col-span-2"><Field label="Tiêu đề"><Inp value={data.title} onChange={v => updateData("title", v)} /></Field></div>
            <Field label="Nút bấm"><Inp value={data.primaryBtnText} onChange={v => updateData("primaryBtnText", v)} /></Field>
            <ActionPicker label="Hành động" value={data.primaryBtnAction} onChange={v => updateData("primaryBtnAction", v)} />
          </div>

          <div className="space-y-4">
             {data.items?.map((item, i) => (
               <div key={i} className="p-6 border rounded-2xl bg-white space-y-4">
                 <div className="flex justify-between">
                   <h4 className="font-bold">Item #{i + 1}</h4>
                   <Button variant="ghost" onClick={() => deleteItem(i)}><Trash2 className="w-4 h-4" /></Button>
                 </div>
                 <Field label="Ảnh">
                   <div className="flex gap-2">
                     <Inp value={item.image} onChange={v => updateItem(i, "image", v)} />
                     <MediaPicker onSelect={url => updateItem(i, "image", url)} trigger={<Button ...><ImageIcon /></Button>} />
                   </div>
                 </Field>
                 <Field label="Tiêu đề item"><Inp value={item.title} onChange={v => updateItem(i, "title", v)} /></Field>
               </div>
             ))}
             <Button onClick={addItem} className="w-full border-dashed"><Plus /> Thêm hàng mới</Button>
          </div>
        </div>
      ) : (
        <BlockSettingsEditor settings={data.settings} onChange={v => updateData("settings", v)} />
      )}
    </div>
  );
}
```

import { BlockWrapper } from "../BlockWrapper";
import { FeaturesSaaS } from "./themes/saas";

export function FeaturesBlockDispatcher({ data }) {
  const theme = data.theme || "saas";
  const isDark = data.settings?.background === "dark";

  return (
    <BlockWrapper settings={data.settings}>
      {theme === "saas" && <FeaturesSaaS data={data} isDark={isDark} settings={data.settings} />}
    </BlockWrapper>
  );
}

### Ví dụ về thực thi Action trong Theme (`themes/saas.tsx`)
```tsx
import { useActionExecutor } from "@/lib/cms/hooks/use-action-executor";

export function FeaturesSaaS({ data, isDark }) {
  const { executeAction } = useActionExecutor();

  return (
    <div>
      {/* ... render nội dung ... */}
      {data.primaryBtnText && (
        <button onClick={() => executeAction(data.primaryBtnAction)}>
          {data.primaryBtnText}
        </button>
      )}
    </div>
  );
}
```

---

## 4. Quy trình yêu cầu AI viết lại Block
Khi bạn yêu cầu AI viết lại một block, hãy cung cấp:
1. File cũ của block đó (trong `src/components/sections`).
2. Yêu cầu AI: "Hãy viết lại block [Tên Block] theo kiến trúc theme mới, tách biệt định nghĩa, editor và renderer saas. Đảm bảo sử dụng BlockWrapper và tích hợp đầy đủ MediaPicker."

---
## 5. Danh sách các Component cần lưu ý
- **BlockWrapper**: `@/blocks/BlockWrapper`
- **Shared Editor UI**: `@/components/cms/block-editors/shared` (bao gồm `ActionPicker`)
- **Action Executor**: `@/lib/cms/hooks/use-action-executor` (dùng trong Themes)
- **MediaPicker**: `@/components/cms/MediaPicker`
- **Lucide Icons**: `lucide-react`
- **Registry**: Sau khi tạo xong, PHẢI đăng ký block mới vào `MASTER_BLOCK_REGISTRY` trong `src/lib/cms/block-system/registry.tsx`.
