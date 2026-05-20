import { BlockDefinition } from "../types";
import { StatsBlockDispatcher } from "./index";
import { StatsBlockEditor } from "./editor";

export interface StatItem {
  value: string;
  label: string;
  prefix?: string;
  suffix?: string;
  description?: string;
  icon?: string;
}

export interface StatsBlockData {
  badge?: string;
  title?: string;
  titleHighlight?: string;
  subtitle?: string;
  columns?: number;
  items: StatItem[];
}

export const StatsBlockDef: BlockDefinition<StatsBlockData> = {
  type: "stats",
  label: "📊 Số liệu ấn tượng",
  description: "Dải con số thống kê nổi bật với hiệu ứng đếm số.",
  category: "content",
  supportedThemes: ["saas"],
  renderer: StatsBlockDispatcher as any,
  editor: StatsBlockEditor as any,
  defaultData: {
    badge: "Số liệu",
    title: "Sức mạnh từ",
    titleHighlight: "Những con số",
    subtitle: "Chúng tôi tự hào về những gì đã đạt được cùng khách hàng.",
    columns: 3,
    items: [
      { value: "20000", prefix: "", suffix: "+", label: "Người dùng tin dùng", description: "Trên toàn thế giới" },
      { value: "99", prefix: "", suffix: "%", label: "Hài lòng", description: "Đánh giá 5 sao" },
      { value: "24", prefix: "", suffix: "/7", label: "Hỗ trợ", description: "Tận tâm 24/7" }
    ]
  }
};
