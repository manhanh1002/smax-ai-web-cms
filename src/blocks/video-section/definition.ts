import type { BlockDefinition, BlockData } from "@/blocks/types";

export interface VideoSectionData {
  videoUrl: string;
  thumbnailUrl?: string;
  title: string;
  titleHighlight?: string;
  description?: string;
  layout?: "centered" | "split";
  settings?: any;
}

export const VideoSectionDef: BlockDefinition<BlockData<VideoSectionData>> = {
  type: "videoSection",
  label: "▶ Video Embed",
  description: "Embed YouTube/Vimeo với thumbnail và mô tả.",
  category: "content",
  defaultData: {
    theme: "saas",
    settings: { paddingTop: "large", paddingBottom: "large", background: "default" },
    videoUrl: "",
    title: "Tiêu đề video",
    layout: "centered",
  },
  renderer: null as any,
  editor: null as any,
};
