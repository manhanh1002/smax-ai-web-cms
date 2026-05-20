import { BlockDefinition } from "../types";
import { FeaturesBlockDispatcher } from "./index";
import { FeaturesBlockEditor } from "./editor";

export interface FeatureItem {
  tag?: string;
  title: string;
  points?: string[];
  stat?: string;
  image?: string;
  reversed?: boolean;
  btnText?: string;
  url?: any; // ButtonAction | string
}

export interface FeaturesBlockData {
  badge?: string;
  title?: string;
  titleHighlight?: string;
  subtitle?: string;
  items: FeatureItem[];
}

export const FeaturesBlockDef: BlockDefinition<FeaturesBlockData> = {
  type: "features",
  label: "⚡ Tính năng Row",
  description: "Các hàng tính năng xen kẽ với điểm nhấn và số liệu.",
  category: "content",
  supportedThemes: ["saas"],
  renderer: FeaturesBlockDispatcher as any,
  editor: FeaturesBlockEditor as any,
  defaultData: {
    badge: "Tính năng chính",
    title: "Công cụ mạnh mẽ cho doanh nghiệp",
    items: [
      {
        tag: "TỐI ƯU HOÁ",
        title: "Tự động hóa quy trình làm việc",
        points: ["Tiết kiệm 70% thời gian", "Giảm thiểu sai sót thủ công"],
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426&ixlib=rb-4.0.3"
      }
    ]
  }
};
