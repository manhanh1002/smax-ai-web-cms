import React from "react";
import { BlockWrapper } from "@/blocks/BlockWrapper";
import { CompareTableSaaS } from "./themes/saas";
export function CompareTableDispatcher({ data }: { data: any }) {
  return <BlockWrapper settings={data.settings}><CompareTableSaaS data={data} isDark={data.settings?.background==="dark"} /></BlockWrapper>;
}
