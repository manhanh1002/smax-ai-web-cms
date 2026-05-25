import type { BlockDefinition, BlockData } from "@/blocks/types";

export interface StatItem { value: number; suffix?: string; prefix?: string; label: string; description?: string; icon?: string; }
export interface CountUpStatsData { sectionLabel?: string; title?: string; titleHighlight?: string; subtitle?: string; stats: StatItem[]; columns?: 2|3|4; layout?: "cards"|"minimal"; settings?: any; }

export const CountUpStatsDef: BlockDefinition<BlockData<CountUpStatsData>> = {
  type: "countUpStats",
  label: "🔢 Animated Counters",
  description: "Số liệu đếm lên animated.",
  category: "marketing",
  defaultData: {
    theme: "saas",
    settings: { paddingTop: "large", paddingBottom: "large", background: "default" },
    title: "Con số ấn tượng",
    stats: [],
    columns: 3,
    layout: "cards"
  },
  renderer: null as any,
  editor: null as any,
};
