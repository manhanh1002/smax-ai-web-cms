import { BlockDefinition } from "../types";

export interface BentoCard {
  title: string;
  description: string;
  image?: string;
  size?: "small" | "medium" | "large";
  url?: any; // ButtonAction | string
}

export interface BentoBlockData {
  badge?: string;
  title?: string;
  titleHighlight?: string;
  subtitle?: string;
  cards: BentoCard[];
}

export const BentoBlockDef: BlockDefinition<BentoBlockData> = {
  type: "bentoGrid",
  label: "✨ Bento Grid",
  description: "Lưới tính năng phong cách Apple (Bento) hiện đại.",
  category: "layout",
  supportedThemes: ["saas"],
  renderer: null as any,
  editor: null as any,
  defaultData: {
    badge: "Tính năng",
    title: "Mọi thứ bạn cần",
    subtitle: "Tận hưởng bộ công cụ mạnh mẽ và dễ sử dụng.",
    cards: [
      { title: "Tự động hóa", description: "Tiết kiệm thời gian với AI" },
      { title: "Bảo mật", description: "Dữ liệu luôn an toàn" },
      { title: "Tốc độ", description: "Xử lý tức thì" },
      { title: "Tích hợp", description: "Kết nối mọi nền tảng" },
      { title: "Báo cáo", description: "Phân tích dữ liệu sâu" },
      { title: "Tương tác", description: "Gắn kết khách hàng" },
      { title: "Mở rộng", description: "Phát triển không giới hạn" },
    ]
  }
};
