import type { Config } from "tailwindcss";
import { color, fontSize, radius, shadow, z, width, screens, motion } from "./lib/design/tokens";

export default {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    screens,
    extend: {
      colors: {
        ink: color.ink,
        bone: color.bone,
        accent: color.accent,
        violet: color.violet,
        line: color.line,
        success: color.success,
        warning: color.warning,
        danger: color.danger,
        // Back-compat aliases so legacy classes keep compiling during migration.
        surface: { "00": color.ink[950], "01": color.ink[850], "02": color.ink[800] },
        brand: { violet: color.violet.DEFAULT, pink: color.accent.DEFAULT, cyan: color.accent.DEFAULT },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      fontSize: fontSize as unknown as Record<string, [string, { lineHeight: string; letterSpacing?: string }]>,
      borderRadius: radius,
      boxShadow: shadow,
      zIndex: Object.fromEntries(Object.entries(z).map(([k, v]) => [k, String(v)])),
      maxWidth: {
        prose: width.prose,
        content: width.content,
        wide: width.wide,
        "screen-full": width.full,
      },
      transitionTimingFunction: {
        out: motion.ease.out,
        "in-out-smooth": motion.ease.inOut,
        "in-sharp": motion.ease.in,
      },
      transitionDuration: {
        fast: "150",
        DEFAULT: "300",
        slow: "600",
        slower: "900",
      },
      keyframes: {
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.9)", opacity: "0.7" },
          "70%,100%": { transform: "scale(2.2)", opacity: "0" },
        },
        shimmer: { from: { backgroundPosition: "0 0" }, to: { backgroundPosition: "-200% 0" } },
      },
      animation: {
        marquee: "marquee 32s linear infinite",
        "fade-up": "fade-up 0.7s cubic-bezier(0.22,1,0.36,1) both",
        "pulse-ring": "pulse-ring 2.4s cubic-bezier(0.65,0,0.35,1) infinite",
        shimmer: "shimmer 2.2s linear infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
