import React from "react";
import { BlockWrapper } from "@/blocks/BlockWrapper";
import { AuthorBioSaaS } from "./themes/saas";
export function AuthorBioDispatcher({ data }: { data: any }) {
  return <BlockWrapper settings={data.settings}><AuthorBioSaaS data={data} isDark={data.settings?.background==="dark"} /></BlockWrapper>;
}
