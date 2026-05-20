import { BlockDefinition } from "../types";
import { BlogPreviewDispatcher } from "./index";
import { BlogPreviewEditor } from "./editor";

export interface BlogPreviewBlockData {
  badge?: string;
  title?: string;
  titleHighlight?: string;
  categorySlug?: string;
  limit?: number;
}

export const BlogPreviewBlockDef: BlockDefinition<BlogPreviewBlockData> = {
  type: "blogPreview",
  label: "📝 Blog Samples",
  description: "Xem trước các bài viết mới nhất từ chuyên mục.",
  category: "marketing",
  supportedThemes: ["saas"],
  renderer: BlogPreviewDispatcher as any,
  editor: BlogPreviewEditor as any,
  defaultData: {
    badge: "TIN TỨC",
    title: "Cập nhật mới nhất",
    limit: 3
  }
};
