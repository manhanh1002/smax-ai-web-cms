import type { BlockDefinition, BlockData } from "@/blocks/types";
import { AuthorBioDispatcher } from "./index";
import { AuthorBioEditor } from "./editor";

export interface SocialLink { platform: "linkedin"|"twitter"|"facebook"|"website"|"github"; url: string; }

export interface AuthorBioData {
  name: string;
  title?: string;
  company?: string;
  bio: string;
  avatar?: string;
  socials?: SocialLink[];
  layout?: "horizontal" | "vertical";
  authorLabel?: string;
  settings?: any;
}

export const AuthorBioDef: BlockDefinition<BlockData<AuthorBioData>> = {
  type: "authorBio",
  label: "👤 Author Bio",
  description: "Card tác giả với tiểu sử và mạng xã hội.",
  category: "content",
  defaultData: {
    theme: "saas",
    settings: { paddingTop: "medium", paddingBottom: "medium", background: "default" },
    name: "Nguyễn Văn A",
    title: "Senior Developer",
    bio: "Mô tả ngắn về tác giả.",
    socials: [],
    layout: "horizontal",
    authorLabel: "Về tác giả",
  },
  renderer: AuthorBioDispatcher,
  editor: AuthorBioEditor,
};
