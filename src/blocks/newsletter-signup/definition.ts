import type { BlockDefinition, BlockData } from "@/blocks/types";
import { NewsletterSignupDispatcher } from "./index";
import { NewsletterSignupEditor } from "./editor";

export interface NewsletterSignupData {
  title: string;
  subtitle?: string;
  placeholder?: string;
  submitText?: string;
  submitUrl: string;
  subscriberCount?: string;
  bgStyle?: "light" | "dark" | "gradient";
  settings?: any;
}

export const NewsletterSignupDef: BlockDefinition<BlockData<NewsletterSignupData>> = {
  type: "newsletterSignup",
  label: "📧 Newsletter Signup",
  description: "Section đăng ký nhận bản tin.",
  category: "social",
  defaultData: {
    theme: "saas",
    settings: { paddingTop: "large", paddingBottom: "large", background: "default" },
    title: "Đăng ký nhận bản tin",
    subtitle: "Nhận tin tức mới nhất mỗi tuần.",
    submitUrl: "/api/newsletter",
    submitText: "Đăng ký",
    bgStyle: "light",
  },
  renderer: NewsletterSignupDispatcher,
  editor: NewsletterSignupEditor,
};
