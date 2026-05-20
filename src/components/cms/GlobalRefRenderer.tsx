"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { renderBlockRenderer } from "@/lib/cms/block-system/registry";

interface GlobalRefRendererProps {
  data: {
    block_id: string;
    _resolved?: { type: string; data: any };
  };
}

/**
 * Renders a Global Block by fetching its data from `cms_blocks` table.
 * On the public site this runs client-side; in SSR contexts the block_id
 * is resolved server-side and passed via `_resolved`.
 */
export function GlobalRefRenderer({ data }: GlobalRefRendererProps) {
  const resolved = data._resolved;
  const [block, setBlock] = useState<{ type: string; data: any } | null>(
    resolved ? { type: resolved.type, data: resolved.data } : null
  );

  useEffect(() => {
    if (!data.block_id) return;

    // Fetch latest data from DB to ensure synchronization
    // We fetch every time the component mounts or the block_id/snapshot changes
    const fetchLatest = async () => {
      const { data: b, error } = await supabase
        .from("cms_blocks")
        .select("type, data")
        .eq("id", data.block_id)
        .single();

      if (error) {
        console.error("Error fetching global block:", error);
        return;
      }

      if (b) {
        const newDataStr = JSON.stringify(b.data);
        const currentDataStr = block ? JSON.stringify(block.data) : "";
        
        if (newDataStr !== currentDataStr || b.type !== block?.type) {
          setBlock({ type: b.type, data: b.data });
        }
      }
    };

    fetchLatest();
  }, [data.block_id, data._resolved]); // Re-run if block_id or the snapshot changes (e.g. on page navigation)

  if (!block) return null;

  return <>{renderBlockRenderer(block, 0)}</>;
}
