import { BlockDefinition } from "../types";
import { TestimonialsBlockDispatcher } from "./index";
import { TestimonialsBlockEditor } from "./editor";

export interface TestimonialItem {
  quote: string;
  author: string;
  role?: string;
  avatar?: string;
  rating?: number; // 1-5 stars
}

export interface TestimonialsBlockData {
  badge?: string;
  title?: string;
  titleHighlight?: string;
  displayMode?: "grid" | "slider" | "marquee";
  rows?: number;
  items: TestimonialItem[];
}

export const TestimonialsBlockDef: BlockDefinition<TestimonialsBlockData> = {
  type: "testimonials",
  label: "💬 Đánh giá khách hàng",
  description: "Trích dẫn khách hàng với ảnh đại diện, vai trò và đánh giá sao.",
  category: "social",
  supportedThemes: ["saas"],
  renderer: TestimonialsBlockDispatcher as any,
  editor: TestimonialsBlockEditor as any,
  defaultData: {
    items: [
      {
        quote: "SMAX AI đã thay đổi hoàn toàn cách chúng tôi vận hành doanh nghiệp.",
        author: "Nguyễn Văn A",
        role: "CEO tại TechFlow",
        avatar: "https://i.pravatar.cc/150?u=a",
        rating: 5
      }
    ]
  }
};
