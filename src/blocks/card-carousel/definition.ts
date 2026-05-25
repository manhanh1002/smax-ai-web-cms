import { BlockDefinition } from "../types";

export interface CarouselCard {
  title: string;
  subtitle?: string;
  description?: string;
  features?: string[];
  image?: string;
  url?: string;
}

export interface CardCarouselBlockData {
  badge?: string;
  title?: string;
  titleHighlight?: string;
  subtitle?: string;
  cards: CarouselCard[];
  autoplay?: boolean;
  autoplayInterval?: number;
  imageFit?: "cover" | "contain";
  showArrows?: boolean;
  arrowIcon?: string;
  showPagination?: boolean;
}

export const CardCarouselBlockDef: BlockDefinition<CardCarouselBlockData> = {
  type: "cardCarousel",
  label: "🎠 Card Slider",
  description: "Dải card tính năng trượt ngang mượt mà.",
  category: "social",
  supportedThemes: ["saas"],
  renderer: null as any,
  editor: null as any,
  defaultData: {
    badge: "KHÁM PHÁ",
    title: "Dự án tiêu biểu",
    autoplay: true,
    autoplayInterval: 5000,
    imageFit: "cover",
    showArrows: true,
    showPagination: true,
    cards: [
      { 
        title: "Dự án A", 
        subtitle: "Lĩnh vực Bất động sản",
        description: "Giải pháp quản lý bất động sản thông minh tích hợp AI.",
        features: ["Quản lý giỏ hàng", "Tính toán dòng tiền", "VR Tour 360"]
      },
      { 
        title: "Dự án B", 
        subtitle: "Lĩnh vực Tài chính",
        description: "Hệ thống phân tích rủi ro tín dụng tự động.",
        features: ["Scoring khách hàng", "Phát hiện gian lận", "Báo cáo Real-time"]
      }
    ]
  }
};
