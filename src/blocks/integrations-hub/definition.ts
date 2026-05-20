import type { BlockDefinition, BlockData } from "@/blocks/types";
import { IntegrationsHubDispatcher } from "./index";
import { IntegrationsHubEditor } from "./editor";

export interface Integration { name: string; logo: string; category: string; description?: string; action?: any; featured?: boolean; }
export interface IntegrationsHubData { title: string; integrations: Integration[]; categories: string[]; showSearch?: boolean; settings?: any; }

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
    showSearch: true
  },
  renderer: IntegrationsHubDispatcher,
  editor: IntegrationsHubEditor,
};
