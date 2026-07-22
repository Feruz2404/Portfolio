import { Inter, Unbounded, JetBrains_Mono } from "next/font/google";

/**
 * Typography — loaded via next/font (self-hosted, zero layout shift).
 * All three faces ship Latin + Cyrillic so uz / en / ru render consistently.
 *
 *  - display: Unbounded — cinematic, wide, distinctive statement headings
 *  - body:    Inter     — highly readable UI / long-form text
 *  - mono:    JetBrains Mono — technical eyebrows, labels, metrics ("atelier" voice)
 */

export const fontDisplay = Unbounded({
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

export const fontBody = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-body",
  display: "swap",
});

export const fontMono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const fontVariables = `${fontDisplay.variable} ${fontBody.variable} ${fontMono.variable}`;
