import type { BlockDefinition, BlockData } from "@/blocks/types";
import { TimelineDispatcher } from "./index";
import { TimelineEditor } from "./editor";

export interface TimelineItem { year: string; title: string; description: string; icon?: string; highlight?: boolean; }
export interface TimelineData { sectionLabel?: string; title: string; titleHighlight?: string; subtitle?: string; items: TimelineItem[]; orientation?: "vertical"|"horizontal"; settings?: any; }

export const TimelineDef: BlockDefinition<BlockData<TimelineData>> = {
  type: "timeline",
  label: "⏱ Timeline",
  description: "Dòng thời gian dọc/ngang.",
  category: "content",
  defaultData: {
    theme: "saas",
    settings: { paddingTop: "large", paddingBottom: "large", background: "default" },
    title: "Các mốc phát triển",
    items: [],
    orientation: "vertical"
  },
  renderer: TimelineDispatcher,
  editor: TimelineEditor,
};
