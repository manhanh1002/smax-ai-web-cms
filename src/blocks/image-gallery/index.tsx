import React from "react";
import { BlockWrapper } from "@/blocks/BlockWrapper";
import { ImageGallerySaaS } from "./themes/saas";
export function ImageGalleryDispatcher({ data }: { data: any }) {
  return <BlockWrapper settings={data.settings}><ImageGallerySaaS data={data} isDark={data.settings?.background==="dark"} /></BlockWrapper>;
}
