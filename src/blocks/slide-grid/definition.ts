import { BlockDefinition, PageBlock } from "../types";
import { SlideGridDispatcher } from "./index";
import { SlideGridEditor } from "./editor";

export type GridLayout = 
  | "1x2" // 2 cols
  | "2x1" // 2 rows
  | "1-left-2-right" // 1 left, 2 right
  | "2-left-1-right" // 2 left, 1 right
  | "1-top-2-bottom" // 1 top, 2 bottom
  | "2-top-1-bottom" // 2 top, 1 bottom
  | "2x2"; // 4 blocks

export interface SlideGridData {
  layout: GridLayout;
  gap: "none" | "small" | "medium" | "large";
  background?: string;
  slots: Record<string, any>;
}

export const SlideGridDef: BlockDefinition<SlideGridData> = {
  type: "slideGrid",
  label: "🔲 Slide Grid (Multi-Block)",
  description: "Bố cục chia lưới đặc biệt cho slide, chứa tới 4 block con.",
  category: "layout",
  supportedThemes: ["saas", "corporate", "minimal"],
  renderer: SlideGridDispatcher as any,
  editor: SlideGridEditor as any,
  defaultData: {
    layout: "1x2",
    gap: "medium",
    background: "default",
    slots: {}
  }
};
