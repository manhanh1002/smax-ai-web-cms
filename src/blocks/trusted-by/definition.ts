import { BlockDefinition } from "../types";
import { TrustedByBlockDispatcher } from "./index";
import { TrustedByBlockEditor } from "./editor";

export interface TrustedByBlockData {
  label?: string;
  highlight?: string;
  logos: string[];
}

export const TrustedByBlockDef: BlockDefinition<TrustedByBlockData> = {
  type: "trustedBy",
  label: "🤝 Tin dùng bởi (Logos)",
  description: "Dải logo các đối tác/khách hàng chạy ngang.",
  category: "social",
  supportedThemes: ["saas"],
  renderer: TrustedByBlockDispatcher as any,
  editor: TrustedByBlockEditor as any,
  defaultData: {
    label: "Hơn 2,000+ doanh nghiệp tin dùng",
    logos: []
  }
};
