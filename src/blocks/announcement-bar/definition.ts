import type { BlockDefinition, BlockData } from "@/blocks/types";

export interface AnnouncementBarData {
  message: string;
  ctaText?: string;
  ctaAction?: any;
  icon?: string;
  bgColor?: "violet" | "blue" | "emerald" | "amber" | "rose" | "slate";
  dismissible?: boolean;
  settings?: any;
}

export const AnnouncementBarDef: BlockDefinition<BlockData<AnnouncementBarData>> = {
  type: "announcementBar",
  label: "📢 Announcement Bar",
  description: "Dải thông báo dismissible trên cùng trang.",
  category: "marketing",
  defaultData: {
    theme: "saas",
    settings: { paddingTop: "none", paddingBottom: "none", background: "default" },
    message: "🎉 Ưu đãi đặc biệt! Giảm 30% trong tháng này.",
    ctaText: "Xem ngay",
    icon: "🎉",
    bgColor: "violet",
    dismissible: true,
  },
  renderer: null as any,
  editor: null as any,
};
