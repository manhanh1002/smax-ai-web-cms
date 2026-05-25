import React from "react";
import { BlockWrapper } from "@/blocks/BlockWrapper";
import { PricingToggleSaaS } from "./themes/saas";
export function PricingToggleDispatcher({ data }: { data: any }) {
  return <BlockWrapper settings={data.settings}><PricingToggleSaaS data={data} isDark={data.settings?.colorMode === "dark" || (!data.settings?.colorMode && (data.settings?.background === "dark" || data.settings?.background === "primary"))} settings={data.settings} /></BlockWrapper>;
}
