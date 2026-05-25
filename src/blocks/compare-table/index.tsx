import React from "react";
import { BlockWrapper } from "@/blocks/BlockWrapper";
import { CompareTableSaaS } from "./themes/saas";
export function CompareTableDispatcher({ data }: { data: any }) {
  const isDark = data.settings?.colorMode === "dark" || (!data.settings?.colorMode && (data.settings?.background === "dark" || data.settings?.background === "primary"));
  return <BlockWrapper settings={data.settings}><CompareTableSaaS data={data} isDark={isDark} /></BlockWrapper>;
}
