import { BlockDefinition } from "../types";
import { FAQBlockDispatcher } from "./index";
import { FAQBlockEditor } from "./editor";

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FAQBlockData {
  badge?: string;
  title?: string;
  titleHighlight?: string;
  columns?: 1 | 2;
  items: FAQItem[];
}

export const FAQBlockDef: BlockDefinition<FAQBlockData> = {
  type: "faq",
  label: "❓ Câu hỏi thường gặp (FAQ)",
  description: "Danh sách câu hỏi Accordion giúp giải đáp thắc mắc.",
  category: "content",
  supportedThemes: ["saas"],
  renderer: FAQBlockDispatcher as any,
  editor: FAQBlockEditor as any,
  defaultData: {
    badge: "Giải đáp thắc mắc",
    title: "Câu hỏi thường gặp",
    items: [
      {
        question: "SMAX AI có hỗ trợ tiếng Việt không?",
        answer: "Có, SMAX AI được tối ưu hóa hoàn toàn cho ngôn ngữ và ngữ cảnh tại Việt Nam."
      }
    ]
  }
};
