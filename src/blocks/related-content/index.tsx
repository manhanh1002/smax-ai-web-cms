import React from "react";
import { BlockWrapper } from "@/blocks/BlockWrapper";
import { RelatedContentSaaS } from "./themes/saas";
export function RelatedContentDispatcher({ data }: { data: any }) {
  return <BlockWrapper settings={data.settings}><RelatedContentSaaS data={data} isDark={data.settings?.background==="dark"} /></BlockWrapper>;
}
