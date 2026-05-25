import { BlockDefinition } from "../types";

export interface SuitableCard {
  tag?: string;
  title: string;
  description: string;
  image?: string;
  url?: any; // ButtonAction | string
}

export interface SuitableForBlockData {
  badge?: string;
  title?: string;
  titleHighlight?: string;
  subtitle?: string;
  cards: SuitableCard[];
}

export const SuitableForBlockDef: BlockDefinition<SuitableForBlockData> = {
  type: "suitableFor",
  label: "🗂️ Card list",
  description: "Danh sách thẻ đa năng (3 cột) kèm hình ảnh hoặc icon.",
  category: "marketing",
  supportedThemes: ["saas"],
  renderer: null as any,
  editor: null as any,
  defaultData: {
    badge: "DANH SÁCH",
    title: "Khám phá các tính năng",
    cards: [
      { tag: "Mới", title: "Thiết kế hiện đại", description: "Giao diện bắt mắt và chuyên nghiệp.", image: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=2340&ixlib=rb-4.0.3" },
      { tag: "AI", title: "Tích hợp AI", description: "Sử dụng trí tuệ nhân tạo để tối ưu quy trình.", image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2340&ixlib=rb-4.0.3" }
    ]
  }
};
