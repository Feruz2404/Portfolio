"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import Hero3D from "@/components/3d/Hero3D";
import { ButtonLink } from "@/components/ui/Button";
import { tokens } from "@/lib/design/tokens";

export default function HomeHero() {
  const t = useTranslations("hero");
  const reduce = useReducedMotion();

  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: reduce ? 0 : 0.08, delayChildren: reduce ? 0 : 0.05 } },
  };
  const item: Variants = reduce
    ? { hidden: {}, visible: {} }
    : {
        hidden: { opacity: 0, y: 18 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: tokens.motion.easeArray } },
      };

  const signals = [t("signalTrilingual"), t("signalDiscipline"), t("signalOpen")];

  return (
    <section className="relative overflow-hidden">
      {/* Faint schematic grid */}
      <div className="atelier-grid pointer-events-none absolute inset-0 opacity-30" aria-hidden />

      {/* Full-bleed 3D background (Spline). Poster on SSR / reduced-motion / mobile. */}
      <div className="absolute inset-0" aria-hidden>
        <Hero3D />
      </div>

      {/* Readability scrims over the scene so the copy stays legible. */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden
        style={{
          background:
            "linear-gradient(90deg, rgba(5,7,10,0.95) 0%, rgba(5,7,10,0.82) 32%, rgba(5,7,10,0.42) 58%, rgba(5,7,10,0.08) 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40"
        aria-hidden
        style={{ background: "linear-gradient(to top, rgba(5,7,10,1), rgba(5,7,10,0))" }}
      />

      {/* Copy over the scene */}
      <div className="container-wide relative z-raised flex min-h-[calc(100dvh-4rem)] items-center py-16">
        <motion.div variants={container} initial="hidden" animate="visible" className="max-w-2xl">
          <motion.div
            variants={item}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-ink-950/50 px-3 py-1.5 text-sm text-bone-muted backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-accent" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            {t("availability")}
          </motion.div>

          <motion.h1
            variants={item}
            className="mt-6 text-6xl font-semibold leading-[0.98] tracking-tight text-bone md:text-7xl"
          >
            {t("headingLine1")} {t("headingLine2")}{" "}
            <span className="text-gradient-accent">{t("headingAccent")}</span> {t("headingLine3")}
          </motion.h1>

          <motion.p variants={item} className="mt-6 max-w-xl text-base leading-relaxed text-bone-muted md:text-lg">
            {t("subtitle")}
          </motion.p>

          <motion.div variants={item} className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href="/projects" size="lg">
              {t("viewProjects")}
            </ButtonLink>
            <ButtonLink href="/contact" size="lg" variant="secondary">
              {t("contactUs")}
            </ButtonLink>
          </motion.div>

          <motion.ul variants={item} className="mt-12 flex flex-wrap gap-x-6 gap-y-3">
            {signals.map((signal) => (
              <li key={signal} className="flex items-center gap-2 font-mono text-2xs uppercase tracking-wider text-bone-faint">
                <span aria-hidden className="h-1 w-1 rounded-full bg-accent" />
                {signal}
              </li>
            ))}
          </motion.ul>
        </motion.div>
      </div>
    </section>
  );
}
