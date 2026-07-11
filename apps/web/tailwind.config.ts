import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          violet: "#7C3AFF",
          pink: "#FF2D78",
          cyan: "#00CFFF"
        },
        surface: {
          "00": "#020208",
          "01": "#06060F",
          "02": "#0D0D1F"
        }
      },
      fontFamily: {
        display: ["var(--font-space)", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"]
      }
    }
  },
  plugins: []
} satisfies Config;
