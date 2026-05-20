import type { BlockDefinition, BlockData } from "@/blocks/types";
import { CompareTableDispatcher } from "./index";
import { CompareTableEditor } from "./editor";

export interface Feature { label: string; values: (boolean|string|number)[]; }
export interface FeatureCategory { name: string; features: Feature[]; }
export interface CompareTableData { sectionLabel?: string; title: string; titleHighlight?: string; subtitle?: string; plans: string[]; categories: FeatureCategory[]; highlightCol?: number; settings?: any; }

export const CompareTableDef: BlockDefinition<BlockData<CompareTableData>> = {
  type: "compareTable",
  label: "⊞ Compare Table",
  description: "Ma trận so sánh tính năng.",
  category: "marketing",
  defaultData: {
    theme: "saas",
    settings: { paddingTop: "large", paddingBottom: "large", background: "default" },
    title: "So sánh tính năng",
    plans: [],
    categories: []
  },
  renderer: CompareTableDispatcher,
  editor: CompareTableEditor,
};
