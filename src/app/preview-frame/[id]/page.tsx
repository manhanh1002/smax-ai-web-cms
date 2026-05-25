"use client";

import { useEffect, useState, use } from "react";
import { supabase } from "@/lib/supabase";
import PageRenderer from "@/components/cms/PageRenderer";

export default function PagePreview({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [previewConfig, setPreviewConfig] = useState<any>(null);

  useEffect(() => {
    // Listen for messages from the parent window to update preview in real-time
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "UPDATE_PREVIEW") {
        setPreviewConfig(event.data.config);
      }
    };

    window.addEventListener("message", handleMessage);
    
    // Initial fetch
    fetchPage();

    return () => window.removeEventListener("message", handleMessage);
  }, [id]);

  async function fetchPage() {
    const { data } = await supabase
      .from("pages")
      .select(`
        *,
        page_templates (*)
      `)
      .eq("id", id)
      .single();

    if (data) {
      setPreviewConfig({
        page_type: data.type || "custom",
        product_config: data.content_config || {},
        blocks: data.content_config?.blocks || data.blocks || [],
        settings: data.settings || {},
        pageBackground: data.content_config?.pageBackground
      });
    }
  }

  if (!previewConfig) return null;

  return (
    <PageRenderer config={previewConfig} />
  );
}
