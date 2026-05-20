import { BlockDefinition, BlockData } from "../types";
import { HeroBlockDispatcher } from "./index";
import { HeroBlockEditor } from "./editor";

export interface HeroBlockData {
  theme?: "saas" | "corporate";
  badgeType?: "text" | "image";
  badge?: string;
  badgeImage?: string;
  title?: string;
  highlight?: string;
  subtitle?: string;
  primaryBtn?: string;
  primaryBtnUrl?: string;
  secondaryBtn?: string;
  secondaryBtnUrl?: string;
  image?: string;
  darkMode?: boolean;
}

export const HeroBlockDef: BlockDefinition<BlockData<HeroBlockData>> = {
  type: "hero",
  label: "🚀 Hero Main",
  description: "Tiêu đề chính, badge, 2 nút bấm và ảnh hero.",
  category: "layout",
  supportedThemes: ["saas"],
  defaultData: {
    theme: "saas",
    settings: {
      paddingTop: "large",
      paddingBottom: "none",
      containerWidth: "boxed",
      background: "muted",
      entranceAnimation: "fadeUp"
    },
    badgeType: "text",
    badge: "",
    badgeImage: "",
    title: "",
    highlight: "",
    subtitle: "",
    primaryBtn: "Dùng thử miễn phí",
    primaryBtnUrl: "#",
    secondaryBtn: "Đặt lịch tư vấn",
    secondaryBtnUrl: "#",
    image: "",
    darkMode: false
  },
  renderer: HeroBlockDispatcher,
  editor: HeroBlockEditor
};
