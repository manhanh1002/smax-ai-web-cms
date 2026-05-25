import { BlockDefinition } from "../types";

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
  renderer: null as any,
  editor: null as any,
  defaultData: {
    label: "Hơn 2,000+ doanh nghiệp tin dùng",
    logos: []
  }
};
