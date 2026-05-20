import type { BlockDefinition, BlockData } from "@/blocks/types";
import { RichAccordionDispatcher } from "./index";
import { RichAccordionEditor } from "./editor";

export interface AccordionItem { heading: string; body: string; icon?: string; defaultOpen?: boolean; }
export interface RichAccordionData { sectionLabel?: string; title?: string; titleHighlight?: string; subtitle?: string; items: AccordionItem[]; allowMultiple?: boolean; settings?: any; }

export const RichAccordionDef: BlockDefinition<BlockData<RichAccordionData>> = {
  type: "richAccordion",
  label: "▼ Rich Accordion",
  description: "Accordion nội dung tổng quát.",
  category: "content",
  defaultData: {
    theme: "saas",
    settings: { paddingTop: "large", paddingBottom: "large", background: "default" },
    title: "Hỏi đáp",
    items: [],
    allowMultiple: false
  },
  renderer: RichAccordionDispatcher,
  editor: RichAccordionEditor,
};
