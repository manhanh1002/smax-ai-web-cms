import React from "react";
import { BlockWrapper } from "@/blocks/BlockWrapper";
import { AnnouncementBarSaaS } from "./themes/saas";

export function AnnouncementBarDispatcher({ data }: { data: any }) {
  return (
    <BlockWrapper settings={data.settings}>
      <AnnouncementBarSaaS data={data} />
    </BlockWrapper>
  );
}
