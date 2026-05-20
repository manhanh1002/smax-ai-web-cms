import type { BlockDefinition, BlockData } from "@/blocks/types";
import { DownloadCardsDispatcher } from "./index";
import { DownloadCardsEditor } from "./editor";

export interface Resource { title: string; description: string; fileType: "pdf"|"doc"|"xls"|"zip"|"video"; fileSize: string; thumbnailUrl?: string; downloadAction?: any; category?: string; }
export interface DownloadCardsData { sectionLabel?: string; title: string; subtitle?: string; resources: Resource[]; columns?: 2|3; settings?: any; }

export const DownloadCardsDef: BlockDefinition<BlockData<DownloadCardsData>> = {
  type: "downloadCards",
  label: "⬇ Download Cards",
  description: "Cards tài nguyên ebook/whitepaper.",
  category: "marketing",
  defaultData: {
    theme: "saas",
    settings: { paddingTop: "large", paddingBottom: "large", background: "default" },
    title: "Tài nguyên",
    resources: [],
    columns: 3
  },
  renderer: DownloadCardsDispatcher,
  editor: DownloadCardsEditor,
};
