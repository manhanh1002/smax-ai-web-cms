import type { BlockDefinition, BlockData } from "@/blocks/types";

export interface Integration { name: string; logo: string; category: string; description?: string; action?: any; featured?: boolean; }
export interface IntegrationsHubData { title: string; integrations: Integration[]; categories: string[]; showSearch?: boolean; searchPlaceholder?: string; featuredLabel?: string; settings?: any; }

export const IntegrationsHubDef: BlockDefinition<BlockData<IntegrationsHubData>> = {
  type: "integrationsHub",
  label: "⚡ Integrations Hub",
  description: "Grid tích hợp có filter.",
  category: "marketing",
  defaultData: {
    theme: "saas",
    settings: { paddingTop: "large", paddingBottom: "large", background: "default" },
    title: "Tích hợp",
    integrations: [],
    categories: [],
    showSearch: true,
    searchPlaceholder: "Tìm kiếm tích hợp...",
    featuredLabel: "Nổi bật",
  },
  renderer: null as any,
  editor: null as any,
};
