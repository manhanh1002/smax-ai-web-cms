import React from "react";
import { BlockWrapper } from "@/blocks/BlockWrapper";
import { RichAccordionSaaS } from "./themes/saas";
export function RichAccordionDispatcher({ data }: { data: any }) {
  return <BlockWrapper settings={data.settings}><RichAccordionSaaS data={data} isDark={data.settings?.colorMode === "dark" || (!data.settings?.colorMode && (data.settings?.background === "dark" || data.settings?.background === "primary"))} /></BlockWrapper>;
}
