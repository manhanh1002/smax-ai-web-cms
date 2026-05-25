import React from "react";
import { BlockWrapper } from "@/blocks/BlockWrapper";
import { TimelineSaaS } from "./themes/saas";
export function TimelineDispatcher({ data }: { data: any }) {
  return <BlockWrapper settings={data.settings}><TimelineSaaS data={data} isDark={data.settings?.colorMode === "dark" || (!data.settings?.colorMode && (data.settings?.background === "dark" || data.settings?.background === "primary"))} /></BlockWrapper>;
}
