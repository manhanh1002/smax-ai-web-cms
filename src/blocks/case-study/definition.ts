import { BlockDefinition } from "../types";
import { CaseStudyDispatcher } from "./index";
import { CaseStudyEditor } from "./editor";

export interface CaseStudyItem {
  title: string;
  description: string;
  image?: string;
  highlights?: { icon?: string; text: string }[];
  quote?: string;
  author?: string;
  btnText?: string;
  url?: any; // ButtonAction | string
}

export interface CaseStudyBlockData {
  badge?: string;
  title?: string;
  items: CaseStudyItem[];
}

export const CaseStudyBlockDef: BlockDefinition<CaseStudyBlockData> = {
  type: "caseStudy",
  label: "🏆 Case Studies",
  description: "Slider dự án thực tế kèm số liệu và trích dẫn.",
  category: "social",
  supportedThemes: ["saas"],
  renderer: CaseStudyDispatcher as any,
  editor: CaseStudyEditor as any,
  defaultData: {
    badge: "THÀNH TỰU",
    title: "Câu chuyện thành công",
    items: [
      { 
        title: "Tăng trưởng 200% doanh thu cho TechFlow", 
        description: "Chúng tôi đã giúp TechFlow tối ưu hóa quy trình vận hành và triển khai hệ thống AI giúp tự động hóa 80% công việc thủ công.",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426",
        highlights: [
          { icon: "Zap", text: "Tự động hóa toàn diện quy trình" },
          { icon: "TrendingUp", text: "Tối ưu hóa phễu chuyển đổi" }
        ],
        quote: "Giải pháp tuyệt vời, giúp chúng tôi tiết kiệm hàng ngàn giờ làm việc mỗi năm.",
        author: "Nguyễn Văn A - CEO TechFlow",
        btnText: "Xem chi tiết dự án"
      }
    ]
  }
};
