import type { BlockDefinition, BlockData } from "@/blocks/types";

export interface Office { name: string; address: string; phone: string; email: string; hours?: string; }
export interface MapContactData { mapEmbedUrl: string; offices: Office[]; title?: string; layout?: "map-left"|"map-right"|"full-width"; settings?: any; }

export const MapContactDef: BlockDefinition<BlockData<MapContactData>> = {
  type: "mapContact",
  label: "📍 Map Contact",
  description: "Google Maps + thông tin văn phòng.",
  category: "social",
  defaultData: {
    theme: "saas",
    settings: { paddingTop: "large", paddingBottom: "large", background: "default" },
    mapEmbedUrl: "",
    offices: [],
    layout: "map-left"
  },
  renderer: null as any,
  editor: null as any,
};
