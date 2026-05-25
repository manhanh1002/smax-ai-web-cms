import React from "react";
import { BlockWrapper } from "@/blocks/BlockWrapper";
import { BeforeAfterSaaS } from "./themes/saas";
export function BeforeAfterDispatcher({ data }: { data: any }) {
  return <BlockWrapper settings={data.settings}><BeforeAfterSaaS data={data} isDark={data.settings?.colorMode === "dark" || (!data.settings?.colorMode && (data.settings?.background === "dark" || data.settings?.background === "primary"))} /></BlockWrapper>;
}
