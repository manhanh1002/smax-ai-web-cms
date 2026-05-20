import type { BlockDefinition, BlockData } from "@/blocks/types";
import { QuoteHighlightDispatcher } from "./index";
import { QuoteHighlightEditor } from "./editor";

export interface QuoteHighlightData {
  quote: string;
  author?: string;
  role?: string;
  company?: string;
  avatar?: string;
  alignment?: "left" | "center";
  accentColor?: "violet" | "blue" | "teal" | "orange" | "rose";
  settings?: any;
}

export const QuoteHighlightDef: BlockDefinition<BlockData<QuoteHighlightData>> = {
  type: "quoteHighlight",
  label: "❝ Pull Quote",
  description: "Trích dẫn nổi bật cỡ lớn.",
  category: "content",
  defaultData: {
    theme: "saas",
    settings: { paddingTop: "large", paddingBottom: "large", background: "default" },
    quote: "Đây là một trích dẫn nổi bật.",
    author: "Nguyễn Văn A",
    role: "CEO",
    accentColor: "violet",
    alignment: "left",
  },
  renderer: QuoteHighlightDispatcher,
  editor: QuoteHighlightEditor,
};
