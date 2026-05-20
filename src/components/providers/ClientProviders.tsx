"use client";

import { SiteSettingsProvider } from "@/context/SiteSettingsContext";
import { Toaster } from "sonner";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <SiteSettingsProvider>
      {children}
      <Toaster position="top-right" richColors />
    </SiteSettingsProvider>
  );
}
