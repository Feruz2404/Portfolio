/**
 * Feruz Digital Atelier — centralized design tokens.
 *
 * Single source of truth for the visual language. Consumed by:
 *  - tailwind.config.ts (colors, fonts, radii, shadows, z-index, screens, widths, motion)
 *  - app/globals.css (a small mirrored subset for raw CSS: cursor, scrollbar, selection)
 *  - components that need token values in JS (e.g. the 3D scene palette)
 *
 * Visual direction: cinematic obsidian/ink foundation, warm bone-white text,
 * a single cyan/emerald interactive accent, violet used only as a restrained
 * depth accent. No neon-template gradients, no glowing borders.
 */

export const color = {
  // Obsidian / ink backgrounds (near-black, faintly cool)
  ink: {
    950: "#05070A", // page background
    900: "#080B10",
    850: "#0C1016", // raised surface
    800: "#12171F", // card / panel
    700: "#1A212B", // hover / border-strong
    600: "#26303C",
  },
  // Warm bone-white text on ink
  bone: {
    DEFAULT: "#F2EFE6",
    100: "#F7F5EE",
    200: "#E9E5D8",
    muted: "rgba(242,239,230,0.64)",
    faint: "rgba(242,239,230,0.40)",
    ghost: "rgba(242,239,230,0.22)",
  },
  // Primary interactive accent: cyan / emerald
  accent: {
    DEFAULT: "#2FE3C2", // signature aqua — bright but not neon on ink
    soft: "#79F0DC",
    deep: "#12B39A",
    emerald: "#34D399", // sibling emerald
    // low-alpha washes for tints/rings
    a12: "rgba(47,227,194,0.12)",
    a20: "rgba(47,227,194,0.20)",
    a40: "rgba(47,227,194,0.40)",
  },
  // Restrained secondary depth accent — use sparingly
  violet: {
    DEFAULT: "#8B7BF0",
    deep: "#5B4BD6",
    a12: "rgba(139,123,240,0.12)",
  },
  // Hairline borders (bone at low alpha)
  line: {
    DEFAULT: "rgba(242,239,230,0.10)",
    strong: "rgba(242,239,230,0.16)",
    faint: "rgba(242,239,230,0.06)",
  },
  // Semantic
  success: "#34D399",
  warning: "#F5B851",
  danger: "#F26D6D",
} as const;

export const font = {
  display: "var(--font-display)",
  body: "var(--font-body)",
  mono: "var(--font-mono)",
} as const;

/** Fluid type scale (clamp-based, set as Tailwind fontSize entries). */
export const fontSize = {
  "2xs": ["0.6875rem", { lineHeight: "1rem", letterSpacing: "0.04em" }],
  xs: ["0.75rem", { lineHeight: "1.1rem" }],
  sm: ["0.875rem", { lineHeight: "1.35rem" }],
  base: ["1rem", { lineHeight: "1.6rem" }],
  lg: ["1.125rem", { lineHeight: "1.7rem" }],
  xl: ["1.25rem", { lineHeight: "1.7rem" }],
  "2xl": ["1.5rem", { lineHeight: "1.25" }],
  "3xl": ["1.875rem", { lineHeight: "1.2" }],
  "4xl": ["2.375rem", { lineHeight: "1.12", letterSpacing: "-0.02em" }],
  "5xl": ["clamp(2.6rem, 5.2vw, 3.5rem)", { lineHeight: "1.04", letterSpacing: "-0.025em" }],
  "6xl": ["clamp(3.2rem, 7vw, 4.75rem)", { lineHeight: "1.0", letterSpacing: "-0.03em" }],
  "7xl": ["clamp(3.8rem, 10vw, 7rem)", { lineHeight: "0.96", letterSpacing: "-0.035em" }],
  "8xl": ["clamp(4.5rem, 13vw, 9.5rem)", { lineHeight: "0.92", letterSpacing: "-0.04em" }],
} as const;

export const radius = {
  none: "0px",
  sm: "0.375rem",
  DEFAULT: "0.625rem",
  md: "0.875rem",
  lg: "1.125rem",
  xl: "1.5rem",
  "2xl": "2rem",
  full: "9999px",
} as const;

export const shadow = {
  // Cinematic, soft — no glow. Depth via shadow + hairline, not neon borders.
  sm: "0 1px 2px rgba(0,0,0,0.4)",
  DEFAULT: "0 8px 30px -12px rgba(0,0,0,0.6)",
  lg: "0 24px 60px -24px rgba(0,0,0,0.7)",
  ring: "0 0 0 1px rgba(242,239,230,0.08)",
  // The one permitted accent lift — subtle, for the primary CTA on hover.
  accent: "0 12px 40px -16px rgba(47,227,194,0.35)",
} as const;

export const z = {
  base: 0,
  raised: 10,
  sticky: 20,
  header: 40,
  overlay: 50,
  modal: 60,
  cursor: 90,
  toast: 100,
} as const;

/** Content widths. */
export const width = {
  prose: "42rem", // long-form reading
  content: "72rem", // standard content column
  wide: "82rem", // wide/editorial
  full: "96rem",
} as const;

/** Responsive breakpoints (min-width). Mirror the QA matrix in the brief. */
export const screens = {
  xs: "375px",
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1440px",
} as const;

/** Motion — durations (ms) and easing curves. */
export const motion = {
  duration: {
    fast: "150ms",
    DEFAULT: "300ms",
    slow: "600ms",
    slower: "900ms",
  },
  ease: {
    // expressive "out" curve for entrances
    out: "cubic-bezier(0.22, 1, 0.36, 1)",
    // gentle in-out for loops / hovers
    inOut: "cubic-bezier(0.65, 0, 0.35, 1)",
    // sharp exit
    in: "cubic-bezier(0.5, 0, 0.75, 0)",
  },
  // Framer-motion friendly numeric easing (matches ease.out)
  easeArray: [0.22, 1, 0.36, 1] as [number, number, number, number],
} as const;

export const tokens = { color, font, fontSize, radius, shadow, z, width, screens, motion };
export type Tokens = typeof tokens;
