import type { BlockDefinition, BlockData } from "@/blocks/types";

export interface GalleryImage { src: string; alt: string; caption?: string; category?: string; }
export interface ImageGalleryData { title?: string; images: GalleryImage[]; columns?: 2|3|4; showFilter?: boolean; enableLightbox?: boolean; settings?: any; }

export const ImageGalleryDef: BlockDefinition<BlockData<ImageGalleryData>> = {
  type: "imageGallery",
  label: "🖼 Image Gallery",
  description: "Lưới ảnh với lightbox.",
  category: "content",
  defaultData: {
    theme: "saas",
    settings: { paddingTop: "large", paddingBottom: "large", background: "default" },
    images: [],
    columns: 3,
    showFilter: true,
    enableLightbox: true
  },
  renderer: null as any,
  editor: null as any,
};
