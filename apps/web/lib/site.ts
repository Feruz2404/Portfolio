/**
 * Static, honest facts about the studio that are not per-record content.
 * The technology stack below is the real toolset this project uses — no
 * invented tools. Tech names are universal, so they are not translated.
 */

export const SITE = {
  name: "Feruz",
  domain: "portfolio-web-xi-tawny.vercel.app",
} as const;

export const TECH_GROUPS = [
  { labelKey: "techFrontend", items: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Framer Motion"] },
  { labelKey: "techBackend", items: ["Node.js", "Prisma", "PostgreSQL", "Zod", "NextAuth"] },
  { labelKey: "techInfra", items: ["Vercel", "GitHub", "UploadThing", "Resend"] },
  { labelKey: "techCraft", items: ["Three.js", "React Three Fiber", "GSAP", "Figma"] },
] as const;

export const CAPABILITY_KEYS = ["cap1", "cap2", "cap3", "cap4"] as const;
export const PROCESS_STEPS = ["step1", "step2", "step3", "step4"] as const;
