import { BlockDefinition } from "../types";

export interface HorizontalTabItem {
  label: string;
  title: string;
  description: string;
  image?: string;
  btnText?: string;
  btnAction?: any;
}

export interface HorizontalTabsBlockData {
  badge?: string;
  title?: string;
  titleHighlight?: string;
  subtitle?: string;
  tabs: HorizontalTabItem[];
}

export const HorizontalTabsBlockDef: BlockDefinition<HorizontalTabsBlockData> = {
  type: "horizontalTabs",
  label: "📑 Horizontal Tabs",
  description: "Các tab ngang phân loại giải pháp.",
  category: "layout",
  supportedThemes: ["saas"],
  renderer: null as any,
  editor: null as any,
  defaultData: {
    badge: "Tính năng",
    title: "Khám phá các module",
    tabs: [
      { label: "Module A", title: "Chi tiết Module A", description: "Mô tả ngắn gọn về Module A." },
      { label: "Module B", title: "Chi tiết Module B", description: "Mô tả ngắn gọn về Module B." }
    ]
  }
};
