import React from "react";
import { BlockWrapper } from "@/blocks/BlockWrapper";
import { CountUpStatsSaaS } from "./themes/saas";
export function CountUpStatsDispatcher({ data }: { data: any }) {
  return <BlockWrapper settings={data.settings}><CountUpStatsSaaS data={data} isDark={data.settings?.background==="dark"} /></BlockWrapper>;
}
