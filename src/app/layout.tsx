import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ThemeInjector from "@/components/layout/ThemeInjector";
import TrackingInjector from "@/components/layout/TrackingInjector";
import { supabase } from "@/lib/supabase";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const revalidate = 0;


export async function generateMetadata(): Promise<Metadata> {
  const { data } = await supabase.from("site_settings").select("site_name, site_description, favicon_url, favicon_dark_url, social_image_url").single();
  return {
    title: data?.site_name || "Smax AI",
    description: data?.site_description || "Next-gen AI Advertising Platform",
    icons: {
      icon: data?.favicon_url || "/favicon.ico",
      shortcut: data?.favicon_url || "/favicon.ico",
      apple: data?.favicon_url || "/favicon.ico",
      other: data?.favicon_dark_url ? [
        {
          url: data.favicon_dark_url,
          media: "(prefers-color-scheme: dark)",
        },
      ] : [],
    },
    openGraph: data?.social_image_url ? {
      images: [
        {
          url: data.social_image_url,
          width: 1200,
          height: 630,
          alt: data?.site_name || "Smax AI",
        }
      ]
    } : undefined,
    twitter: data?.social_image_url ? {
      card: "summary_large_image",
      images: [data.social_image_url],
    } : undefined,
  };
}

import { ClientProviders } from "@/components/providers/ClientProviders";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeInjector />
        <TrackingInjector />
      </head>
      <body className={`${inter.variable} antialiased`} style={{ fontFamily: 'var(--font-body)' }} suppressHydrationWarning>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
