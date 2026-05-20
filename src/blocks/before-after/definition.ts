import type { BlockDefinition, BlockData } from "@/blocks/types";
import { BeforeAfterDispatcher } from "./index";
import { BeforeAfterEditor } from "./editor";

export interface BeforeAfterData {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  title?: string;
  settings?: any;
}

export const BeforeAfterDef: BlockDefinition<BlockData<BeforeAfterData>> = {
  type: "beforeAfter",
  label: "🌓 Before & After",
  description: "Thanh trượt so sánh hai hình ảnh.",
  category: "content",
  defaultData: {
    theme: "saas",
    settings: { paddingTop: "medium", paddingBottom: "medium", background: "default" },
    beforeImage: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800",
    afterImage: "https://images.unsplash.com/photo-1611186871348-b1ec696e5238?auto=format&fit=crop&q=80&w=800",
    beforeLabel: "Trước",
    afterLabel: "Sau",
  },
  renderer: BeforeAfterDispatcher,
  editor: BeforeAfterEditor,
};
