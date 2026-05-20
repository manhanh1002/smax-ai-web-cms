import { BlockDefinition } from "../../lib/cms/block-system/types";
import { CustomCodeSaaS } from "./themes/saas";
import { CustomCodeEditor } from "./editor";

export interface CustomCodeData {
  html: string;
  css?: string;
  js?: string;
}

export const CustomCodeBlockDef: BlockDefinition<CustomCodeData> = {
  type: "custom-code",
  label: "Code tùy chỉnh",
  description: "Chèn HTML/CSS/JS tùy chỉnh với hỗ trợ Tailwind CSS",
  category: "content",
  icon: "Code",
  defaultData: {
    html: '<div class="p-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl text-white text-center shadow-2xl">\n  <h2 class="text-3xl font-black mb-4">Xin chào từ Custom Code!</h2>\n  <p class="text-white/80 text-lg">Bạn có thể sử dụng Tailwind CSS trực tiếp tại đây.</p>\n  <button id="myBtn" class="mt-6 px-8 py-3 bg-white text-indigo-600 font-bold rounded-full hover:scale-105 transition-transform active:scale-95">\n    Bấm vào tôi\n  </button>\n</div>',
    css: "/* Thêm CSS tùy chỉnh tại đây */",
    js: "// Thêm JS tùy chỉnh tại đây\ndocument.getElementById('myBtn')?.addEventListener('click', () => {\n  alert('Xin chào! JS của bạn đang hoạt động.');\n});"
  },
  renderer: CustomCodeSaaS as any,
  editor: CustomCodeEditor as any,
};
