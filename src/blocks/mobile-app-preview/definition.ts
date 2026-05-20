import type { BlockDefinition, BlockData } from "@/blocks/types";
import { MobileAppPreviewDispatcher } from "./index";
import { MobileAppPreviewEditor } from "./editor";

export interface MobileAppPreviewData {
  title: string;
  subtitle?: string;
  mockupImage: string;
  appStoreAction?: any;
  playStoreAction?: any;
  appStoreText?: string;
  playStoreText?: string;
  features: string[];
  settings?: any;
}

export const MobileAppPreviewDef: BlockDefinition<BlockData<MobileAppPreviewData>> = {
  type: "mobileAppPreview",
  label: "📱 Mobile App Preview",
  description: "Mockup điện thoại + App Store/Play badges.",
  category: "marketing",
  defaultData: {
    theme: "saas",
    settings: { paddingTop: "large", paddingBottom: "large", background: "default" },
    title: "Ứng dụng của chúng tôi",
    mockupImage: "",
    appStoreText: "App Store",
    playStoreText: "Google Play",
    features: ["Tốc độ nhanh", "Giao diện đẹp", "Bảo mật cao"],
  },
  renderer: MobileAppPreviewDispatcher,
  editor: MobileAppPreviewEditor,
};
