import { BlockDefinition } from "../types";
import { ProcessDispatcher } from "./index";
import { ProcessEditor } from "./editor";

export interface ProcessStep {
  title: string;
  description: string;
  image?: string;
  url?: any; // ButtonAction | string
}

export interface ProcessBlockData {
  badge?: string;
  title?: string;
  titleHighlight?: string;
  steps: ProcessStep[];
}

export const ProcessBlockDef: BlockDefinition<ProcessBlockData> = {
  type: "process",
  label: "🛤️ Quy trình",
  description: "Các bước triển khai (1, 2, 3...).",
  category: "content",
  supportedThemes: ["saas"],
  renderer: ProcessDispatcher as any,
  editor: ProcessEditor as any,
  defaultData: {
    badge: "Quy trình",
    title: "Bắt đầu chỉ với 3 bước",
    steps: [
      { title: "Đăng ký", description: "Tạo tài khoản miễn phí trong 30 giây." },
      { title: "Cấu hình", description: "Thiết lập các tham số cơ bản cho AI." },
      { title: "Vận hành", description: "Tận hưởng kết quả kinh doanh vượt trội." }
    ]
  }
};
