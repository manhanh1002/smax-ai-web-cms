import { BlockDefinition } from "../types";
import { RichTextBlockDispatcher } from "./index";
import { RichTextBlockEditor } from "./editor";

export interface RichTextBlockData {
  content: string;
}

export const RichTextBlockDef: BlockDefinition<RichTextBlockData> = {
  type: "richText",
  label: "📝 Rich Text / Blog Content",
  description: "Nội dung văn bản dài, hỗ trợ Markdown và HTML.",
  category: "content",
  supportedThemes: ["saas"],
  renderer: RichTextBlockDispatcher as any,
  editor: RichTextBlockEditor as any,
  defaultData: {
    content: "<h2>Tiêu đề bài viết</h2><p>Nội dung chi tiết...</p>"
  }
};
