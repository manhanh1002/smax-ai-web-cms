import { BlockDefinition } from "@/lib/cms/block-system/types";
import { FormBlock } from "@/components/sections/FormBlock";
import { FormBlockEditor } from "@/components/cms/block-editors/FormBlockEditor";

export const FormBlockDef: BlockDefinition = {
  type: "form",
  label: "📋 Native Form",
  description: "Nhúng form tự thiết kế với các tùy chọn layout chuyên nghiệp.",
  renderer: null as any,
  editor: null as any,
  defaultData: {
    badge: "LIÊN HỆ",
    title: "Sẵn sàng bắt đầu",
    titleHighlight: "Cùng Smax AI?",
    subtitle: "Vui lòng để lại thông tin, đội ngũ của chúng tôi sẽ hỗ trợ bạn trong vòng 24h.",
    formId: "",
    layout: "centered",
    darkMode: false,
    maxWidth: "md",
    features: [
      { text: "Dữ liệu được bảo mật 100% theo tiêu chuẩn quốc tế.", icon: "✓" },
      { text: "Phản hồi siêu tốc trong vòng 5 phút làm việc.", icon: "⚡" }
    ]
  }
};
