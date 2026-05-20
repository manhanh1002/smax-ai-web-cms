import type { BlockDefinition, BlockData } from "@/blocks/types";
import { TeamGridDispatcher } from "./index";
import { TeamGridEditor } from "./editor";

export interface TeamMember { name: string; role: string; avatar?: string; bio?: string; linkedin?: string; twitter?: string; }
export interface TeamGridData { sectionLabel?: string; title: string; titleHighlight?: string; subtitle?: string; members: TeamMember[]; columns?: 3|4; avatarShape?: "circle"|"rounded"; showBio?: boolean; settings?: any; }

export const TeamGridDef: BlockDefinition<BlockData<TeamGridData>> = {
  type: "teamGrid",
  label: "👥 Team Grid",
  description: "Grid thành viên công ty.",
  category: "social",
  defaultData: {
    theme: "saas",
    settings: { paddingTop: "large", paddingBottom: "large", background: "default" },
    title: "Đội ngũ",
    members: [],
    columns: 3,
    avatarShape: "circle",
    showBio: true
  },
  renderer: TeamGridDispatcher,
  editor: TeamGridEditor,
};
