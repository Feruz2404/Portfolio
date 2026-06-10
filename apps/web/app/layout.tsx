import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "Portfolio",
    template: "%s — Portfolio"
  },
  description: "Enterprise portfolio platform"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
