"use client";

import { useParams } from "next/navigation";
import { PostEditor } from "@/components/cms/PostEditor";

export default function EditPostPage() {
  const { id } = useParams() as { id: string };
  return <PostEditor id={id} />;
}

