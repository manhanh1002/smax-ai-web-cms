import type { BlockDefinition, BlockData } from "@/blocks/types";
import { PageHeaderDispatcher } from "./index";
import { PageHeaderEditor } from "./editor";

export interface Breadcrumb { label: string; action?: any; }

export interface PageHeaderData {
  breadcrumbs?: Breadcrumb[];
  title: string;
  subtitle?: string;
  tags?: string[];
  publishDate?: string;
  readTime?: string;
  authorName?: string;
  authorAvatar?: string;
  alignment?: "left" | "center";
  settings?: any;
}

export const PageHeaderDef: BlockDefinition<BlockData<PageHeaderData>> = {
  type: "pageHeader",
  label: "📄 Page Header",
  description: "Header nội trang với breadcrumb, tags và metadata.",
  category: "layout",
  defaultData: {
    theme: "saas",
    settings: { paddingTop: "large", paddingBottom: "medium", background: "default" },
    title: "Tiêu đề trang",
    breadcrumbs: [{ label: "Home" }, { label: "Blog" }],
    tags: [],
    alignment: "left",
  },
  renderer: PageHeaderDispatcher,
  editor: PageHeaderEditor,
};
