import { BlockDefinition } from "../types";

export interface RichTextBlockData {
  content: string;
}

export const RichTextBlockDef: BlockDefinition<RichTextBlockData> = {
  type: "richText",
  label: "📝 Rich Text / Blog Content",
  description: "Nội dung văn bản dài, hỗ trợ Markdown và HTML.",
  category: "content",
  supportedThemes: ["saas"],
  renderer: null as any,
  editor: null as any,
  defaultData: {
    content: "<h2>Tiêu đề bài viết</h2><p>Nội dung chi tiết...</p>"
  }
};
