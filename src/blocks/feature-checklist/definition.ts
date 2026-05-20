import type { BlockDefinition, BlockData } from "@/blocks/types";
import { FeatureChecklistDispatcher } from "./index";
import { FeatureChecklistEditor } from "./editor";

export interface ChecklistCol { label: string; sublabel?: string; items: {text:string;checked:boolean}[]; }
export interface FeatureChecklistData { sectionLabel?: string; title: string; subtitle?: string; columnA: ChecklistCol; columnB: ChecklistCol; settings?: any; }

export const FeatureChecklistDef: BlockDefinition<BlockData<FeatureChecklistData>> = {
  type: "featureChecklist",
  label: "✓ Feature Checklist",
  description: "So sánh 2 cột ✓/✗.",
  category: "marketing",
  defaultData: {
    theme: "saas",
    settings: { paddingTop: "large", paddingBottom: "large", background: "default" },
    title: "So sánh",
    columnA: { label: "Gói A", items: [] },
    columnB: { label: "Gói B", items: [] }
  },
  renderer: FeatureChecklistDispatcher,
  editor: FeatureChecklistEditor,
};
