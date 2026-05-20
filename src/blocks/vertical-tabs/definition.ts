import { BlockDefinition } from "../types";
import { VerticalTabsDispatcher } from "./index";
import { VerticalTabsEditor } from "./editor";

export interface VerticalTabItem {
  label: string;
  title: string;
  description: string;
  image?: string;
  btnText?: string;
  btnAction?: any;
}

export interface VerticalTabsBlockData {
  badge?: string;
  title?: string;
  titleHighlight?: string;
  subtitle?: string;
  tabs: VerticalTabItem[];
}

export const VerticalTabsBlockDef: BlockDefinition<VerticalTabsBlockData> = {
  type: "verticalTabs",
  label: "📂 Vertical Tabs",
  description: "Menu dọc bên trái, nội dung thay đổi bên phải.",
  category: "layout",
  supportedThemes: ["saas"],
  renderer: VerticalTabsDispatcher as any,
  editor: VerticalTabsEditor as any,
  defaultData: {
    badge: "Giải pháp",
    title: "Phân loại theo nhu cầu",
    tabs: [
      { label: "Cá nhân", title: "Dành cho cá nhân", description: "Công cụ mạnh mẽ cho người dùng đơn lẻ." },
      { label: "Doanh nghiệp", title: "Dành cho doanh nghiệp", description: "Quản lý quy mô lớn với bảo mật tối đa." }
    ]
  }
};
