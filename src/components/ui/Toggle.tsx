"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md";
}

export function Toggle({ checked, onChange, disabled, size = "md" }: ToggleProps) {
  const isSm = size === "sm";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative inline-flex flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary/20",
        isSm ? "h-4 w-7" : "h-5 w-9",
        checked ? "bg-primary" : "bg-gray-200",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
          isSm ? "h-3 w-3" : "h-4 w-4",
          checked ? (isSm ? "translate-x-3" : "translate-x-4") : "translate-x-0"
        )}
      />
    </button>
  );
}
