import { BlockDefinition } from "../types";
import { HeroSecondaryDispatcher } from "./index";
import { HeroSecondaryEditor } from "./editor";

export interface HeroSecondaryData {
  badge?: string;
  title?: string;
  titleHighlight?: string;
  subtitle?: string;
  image?: string;
  primaryBtn?: string;
  primaryBtnUrl?: string;
  imagePosition?: "left" | "right";
}

export const HeroSecondaryDef: BlockDefinition<HeroSecondaryData> = {
  type: "heroSecondary",
  label: "🖼️ Hero Phụ (Ảnh trái/phải)",
  description: "Khối tiêu đề phụ kèm ảnh lớn một bên.",
  category: "layout",
  supportedThemes: ["saas"],
  renderer: HeroSecondaryDispatcher as any,
  editor: HeroSecondaryEditor as any,
  defaultData: {
    badge: "GIỚI THIỆU",
    title: "Giải pháp toàn diện cho doanh nghiệp",
    subtitle: "Tối ưu hóa mọi quy trình với AI tiên tiến nhất.",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=2340&ixlib=rb-4.0.3",
    primaryBtn: "Tìm hiểu thêm",
    primaryBtnUrl: "#",
    imagePosition: "left"
  }
};
