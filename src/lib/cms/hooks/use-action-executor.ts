"use client";

import { useRouter } from "next/navigation";
import { ButtonAction } from "@/blocks/types";
import { useCallback } from "react";

export function useActionExecutor() {
  const router = useRouter();

  const executeAction = useCallback((action: ButtonAction | string | undefined | null) => {
    if (!action) return;

    // Backward compatibility for string URLs
    if (typeof action === "string") {
      if (action.startsWith("#")) {
        const id = action.substring(1);
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      } else if (action.startsWith("/")) {
        router.push(action);
      } else if (action.startsWith("http")) {
        window.location.href = action;
      }
      return;
    }

    const { type, url, pageSlug, blockId, popupId, target } = action;

    switch (type) {
      case "url":
        if (url) {
          if (target === "_blank") {
            window.open(url, "_blank");
          } else {
            router.push(url);
          }
        }
        break;

      case "page":
        if (pageSlug) {
          router.push(`/${pageSlug}`);
        }
        break;

      case "block":
        if (blockId) {
          const element = document.getElementById(blockId);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }
        break;

      case "popup":
        if (popupId) {
          window.dispatchEvent(new CustomEvent("smax-open-popup", { detail: { id: popupId } }));
        }
        break;

      default:
        console.warn("Unknown action type:", type);
    }
  }, [router]);

  return { executeAction };
}
