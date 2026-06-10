import type { Metadata } from "next";
import "./globals.css";
import { Inter, JetBrains_Mono, Syne } from "next/font/google";

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-inter" });
const syne = Syne({ subsets: ["latin"], variable: "--font-syne" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: {
    default: "Enterprise Portfolio",
    template: "%s · Enterprise Portfolio",
  },
  description: "Enterprise-grade portfolio platform.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <body className={`${inter.variable} ${syne.variable} ${jetbrains.variable} min-h-screen antialiased`}>
        {children}
      </body>
    </html>
  );
}
