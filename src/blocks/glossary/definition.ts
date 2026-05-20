import type { BlockDefinition, BlockData } from "@/blocks/types";
import { GlossaryDispatcher } from "./index";
import { GlossaryEditor } from "./editor";

export interface GlossaryTerm { term: string; definition: string; category?: string; example?: string; }
export interface GlossaryData { title: string; terms: GlossaryTerm[]; showFilter?: boolean; showSearch?: boolean; settings?: any; }

export const GlossaryDef: BlockDefinition<BlockData<GlossaryData>> = {
  type: "glossary",
  label: "📖 Glossary",
  description: "Từ điển thuật ngữ có tìm kiếm.",
  category: "content",
  defaultData: {
    theme: "saas",
    settings: { paddingTop: "large", paddingBottom: "large", background: "default" },
    title: "Thuật ngữ",
    terms: [],
    showSearch: true,
    showFilter: true
  },
  renderer: GlossaryDispatcher,
  editor: GlossaryEditor,
};
