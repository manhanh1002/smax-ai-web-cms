import React from "react";
import { BlockWrapper } from "@/blocks/BlockWrapper";
import { QuoteHighlightSaaS } from "./themes/saas";

export function QuoteHighlightDispatcher({ data }: { data: any }) {
  return (
    <BlockWrapper settings={data.settings}>
      <QuoteHighlightSaaS data={data} isDark={data.settings?.background === "dark"} />
    </BlockWrapper>
  );
}
