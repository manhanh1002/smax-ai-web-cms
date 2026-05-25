import { BlockDefinition } from "../types";

export interface IconGridItem {
  title: string;
  description: string;
  icon?: string;
}

export interface IconGridData {
  badge?: string;
  title?: string;
  titleHighlight?: string;
  description?: string;
  image?: string;
  itemAlign?: "left" | "center" | "right";
  itemStyle?: "standard" | "compact";
  columns?: 3 | 4 | 5;
  items: IconGridItem[];
}

export const IconGridDef: BlockDefinition<IconGridData> = {
  type: "featureIconGrid",
  label: "🛠️ Icon Grid",
  description: "Lưới các tính năng kỹ thuật kèm Icon nhỏ.",
  category: "content",
  supportedThemes: ["saas"],
  renderer: null as any,
  editor: null as any,
  defaultData: {
    badge: "Tính năng kỹ thuật",
    title: "Sức mạnh từ bên trong",
    items: [
      { title: "API mạnh mẽ", description: "Kết nối với mọi nền tảng", icon: "Zap" },
      { title: "Cloud Native", description: "Vận hành trên nền tảng đám mây", icon: "Cloud" },
    ]
  }
};
