import React from "react";
import { BlockWrapper } from "@/blocks/BlockWrapper";
import { HeroCenteredSaaS } from "./themes/saas";
export function HeroCenteredDispatcher({ data }: { data: any }) {
  return <BlockWrapper settings={data.settings}><HeroCenteredSaaS data={data} isDark={data.settings?.colorMode === "dark" || (!data.settings?.colorMode && (data.settings?.background === "dark" || data.settings?.background === "primary"))} settings={data.settings} /></BlockWrapper>;
}
