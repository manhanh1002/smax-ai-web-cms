import type { BlockDefinition, BlockData } from "@/blocks/types";
import { ContactFormDispatcher } from "./index";
import { ContactFormEditor } from "./editor";

export interface FormField { name: string; label: string; type: "text"|"email"|"tel"|"textarea"|"select"; required: boolean; placeholder?: string; options?: string[]; }
export interface ContactInfo { address?: string; phone?: string; email?: string; hours?: string; }
export interface ContactFormData {
  title: string;
  subtitle?: string;
  fields: FormField[];
  submitUrl: string;
  submitText?: string;
  contactInfo?: ContactInfo;
  addressLabel?: string;
  phoneLabel?: string;
  emailLabel?: string;
  hoursLabel?: string;
  layout?: "side-by-side"|"form-only";
  settings?: any;
}

export const ContactFormDef: BlockDefinition<BlockData<ContactFormData>> = {
  type: "contactForm",
  label: "✉ Contact Form",
  description: "Form liên hệ có validation.",
  category: "social",
  defaultData: {
    theme: "saas",
    settings: { paddingTop: "large", paddingBottom: "large", background: "default" },
    title: "Liên hệ",
    fields: [],
    submitUrl: "/api/contact",
    layout: "form-only",
    addressLabel: "📍 Địa chỉ",
    phoneLabel: "☎️ SĐT",
    emailLabel: "✉️ Email",
    hoursLabel: "🕐 Giờ",
  },
  renderer: ContactFormDispatcher,
  editor: ContactFormEditor,
};
