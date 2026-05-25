import type { BlockDefinition, BlockData } from "@/blocks/types";

export interface JobListing { title: string; department: string; location: string; type: "full-time"|"part-time"|"contract"|"remote"; applyAction?: any; salary?: string; description?: string; }
export interface JobListingsData {
  sectionLabel?: string;
  title: string;
  subtitle?: string;
  jobs: JobListing[];
  departments: string[];
  showFilter?: boolean;
  applyBtnText?: string;
  allFilterLabel?: string;
  emptyStateText?: string;
  settings?: any;
}

export const JobListingsDef: BlockDefinition<BlockData<JobListingsData>> = {
  type: "jobListings",
  label: "💼 Job Listings",
  description: "Danh sách vị trí tuyển dụng.",
  category: "social",
  defaultData: {
    theme: "saas",
    settings: { paddingTop: "large", paddingBottom: "large", background: "default" },
    title: "Tuyển dụng",
    jobs: [],
    departments: [],
    showFilter: true,
    applyBtnText: "Chi tiết →",
    allFilterLabel: "Tất cả",
    emptyStateText: "Không có vị trí nào",
  },
  renderer: null as any,
  editor: null as any,
};
