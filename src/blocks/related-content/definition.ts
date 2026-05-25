import type { BlockDefinition, BlockData } from "@/blocks/types";

export interface ContentItem { type: "blog"|"case-study"|"video"|"resource"; title: string; thumbnail: string; action?: any; date?: string; tag?: string; excerpt?: string; }
export interface RelatedContentData { title?: string; items: ContentItem[]; columns?: 2|3; showType?: boolean; showDate?: boolean; settings?: any; }

export const RelatedContentDef: BlockDefinition<BlockData<RelatedContentData>> = {
  type: "relatedContent",
  label: "🔗 Related Content",
  description: "Grid bài viết liên quan.",
  category: "social",
  defaultData: {
    theme: "saas",
    settings: { paddingTop: "large", paddingBottom: "large", background: "default" },
    title: "Bài liên quan",
    items: [],
    columns: 3,
    showType: true,
    showDate: true
  },
  renderer: null as any,
  editor: null as any,
};
