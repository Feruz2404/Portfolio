import type { Metadata } from "next";
import { DM_Mono, Inter, Space_Grotesk } from "next/font/google";
import { getLocale } from "next-intl/server";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" });
const dmMono = DM_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: {
    default: "Portfolio",
    template: "%s — Portfolio"
  },
  description: "A product engineer portfolio for expressive digital work, interface systems, and creative technology.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://portfolio-web-xi-tawny.vercel.app"),
  openGraph: {
    title: "Portfolio — Digital work with a point of view",
    description: "Expressive products, brands, and interfaces where strategy, engineering, and atmosphere meet.",
    type: "website"
  },
  icons: { icon: "/icon.svg" }
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();

  return (
    <html lang={locale} className={`${inter.variable} ${spaceGrotesk.variable} ${dmMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
