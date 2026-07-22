import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import { getSiteUrl } from "@/lib/env";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: "Admin — Feruz",
  robots: { index: false, follow: false },
};

/**
 * Root layout for the (non-localized) /admin branch. Renders html/body so the
 * admin area is a self-contained root — the login page lives directly under it
 * (no auth gate), while the authed panel + chrome live in the (panel) group.
 */
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <body className="min-h-dvh bg-ink-950 font-body text-bone antialiased">{children}</body>
    </html>
  );
}
