import { BlockDefinition } from "../types";

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
  renderer: null as any,
  editor: null as any,
  defaultData: {
    badge: "TIN TỨC",
    title: "Cập nhật mới nhất",
    limit: 3
  }
};
