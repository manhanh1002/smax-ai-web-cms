import type { BlockDefinition, BlockData } from "@/blocks/types";
import { ReviewBadgesDispatcher } from "./index";
import { ReviewBadgesEditor } from "./editor";

export interface ReviewBadge { platform: "g2"|"capterra"|"trustpilot"|"google"|"custom"; rating: number; reviewCount: number; badgeUrl?: string; action?: any; }
export interface ReviewBadgesData { title?: string; badges: ReviewBadge[]; settings?: any; }

export const ReviewBadgesDef: BlockDefinition<BlockData<ReviewBadgesData>> = {
  type: "reviewBadges",
  label: "⭐ Review Badges",
  description: "Badges từ G2, Capterra, Trustpilot.",
  category: "social",
  defaultData: {
    theme: "saas",
    settings: { paddingTop: "large", paddingBottom: "large", background: "default" },
    title: "Được tin tưởng",
    badges: []
  },
  renderer: ReviewBadgesDispatcher,
  editor: ReviewBadgesEditor,
};
