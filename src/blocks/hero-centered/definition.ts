import type { BlockDefinition, BlockData } from "@/blocks/types";
import { HeroCenteredDispatcher } from "./index";
import { HeroCenteredEditor } from "./editor";

export interface HeroCenteredData {
  badge?: string;
  eyebrowIcon?: string;
  title: string;
  highlight?: string;
  subtitle?: string;
  primaryBtnText?: string;
  primaryBtnAction?: any;
  secondaryBtnText?: string;
  secondaryBtnAction?: any;
  bgGradient?: "none"|"purple"|"blue"|"teal"|"orange";
  settings?: any;
}

export const HeroCenteredDef: BlockDefinition<BlockData<HeroCenteredData>> = {
  type: "heroCentered",
  label: "⬛ Hero Centered",
  description: "Full-screen hero text căn giữa, không split ảnh.",
  category: "layout",
  defaultData: {
    theme: "saas",
    settings: { paddingTop: "xlarge", paddingBottom: "xlarge", background: "default" },
    badge: "🚀 Tính năng mới",
    title: "Giải pháp tốt nhất cho",
    highlight: "doanh nghiệp của bạn",
    subtitle: "Mô tả ngắn gọn về giá trị mang lại.",
    primaryBtnText: "Dùng thử miễn phí",
    secondaryBtnText: "Xem demo",
    bgGradient: "purple",
  },
  renderer: HeroCenteredDispatcher,
  editor: HeroCenteredEditor,
};
