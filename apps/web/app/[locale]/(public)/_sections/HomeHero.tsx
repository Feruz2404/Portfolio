"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { fadeInUp, staggerContainer } from "@/components/animations/variants";

const HeroScene = dynamic(() => import("@/components/3d/HeroScene"), { ssr: false });

const stats = [
  { key: "s_projects", number: "50+" },
  { key: "s_experience", number: "5+" },
  { key: "s_languages", number: "3" }
];

const servicesTicker = [
  "WEB DEVELOPMENT",
  "MOBILE APPS",
  "UI/UX DESIGN",
  "DATABASE ARCHITECTURE",
  "API DEVELOPMENT",
  "CLOUD INFRASTRUCTURE"
];

export default function HomeHero() {
  const t = useTranslations("hero");
  const home = useTranslations("home");

  return (
    <>
      <section className="relative grid min-h-screen grid-cols-1 items-center overflow-hidden lg:grid-cols-2">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/30 via-purple-950/20 to-cyan-950/30" />

        <motion.div
          className="relative z-10 flex flex-col justify-center px-6 pb-20 md:px-12 lg:px-20"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeInUp} className="mb-6 flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-indigo-500" />
            </span>
            <span className="text-sm font-medium tracking-wide text-indigo-300">{t("available")}</span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl lg:text-8xl"
          >
            <span className="block text-white">{t("heading1")}</span>
            <span className="gradient-text block">{t("heading2")}</span>
            <span className="block text-white">{t("heading3")}</span>
          </motion.h1>

          <motion.p variants={fadeInUp} className="mt-6 max-w-md text-base leading-relaxed text-white/60 md:text-lg">
            {t("subtitle")}
          </motion.p>

          <motion.div variants={fadeInUp} className="mt-8 grid grid-cols-3 gap-4 md:gap-8">
            {stats.map((stat) => (
              <div key={stat.key}>
                <div className="gradient-text text-2xl font-black md:text-3xl">{stat.number}</div>
                <div className="mt-1 text-xs tracking-wide text-white/40">{home(stat.key)}</div>
              </div>
            ))}
          </motion.div>

          <motion.div variants={fadeInUp} className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/projects"
              className="inline-flex rounded-full bg-indigo-600 px-6 py-3 text-sm font-semibold tracking-wide text-white transition-colors hover:bg-indigo-500"
            >
              {t("viewProjects")}
            </Link>
            <Link
              href="/contact"
              className="inline-flex rounded-full border border-white/20 px-6 py-3 text-sm font-semibold tracking-wide text-white transition-colors hover:border-white/40"
            >
              {t("contactUs")}
            </Link>
          </motion.div>

          <motion.div variants={fadeInUp} className="absolute bottom-8 left-1/2 -translate-x-1/2 lg:left-20 lg:translate-x-0">
            <div className="flex flex-col items-center gap-2 animate-bounce">
              <span className="text-[10px] uppercase tracking-widest text-white/30">{t("scroll")}</span>
              <svg className="h-4 w-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </motion.div>
        </motion.div>

        <div className="relative h-[50vh] lg:h-screen">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="aspect-square w-[120%] rounded-full bg-gradient-to-br from-indigo-600/10 via-purple-600/5 to-cyan-600/10 blur-3xl" />
          </div>
          <div className="absolute inset-0">
            <HeroScene />
          </div>
        </div>
      </section>

      <section className="overflow-hidden border-y border-white/10 bg-black/50 py-4">
        <div className="flex gap-8 whitespace-nowrap px-4 animate-marquee">
          {[...servicesTicker, ...servicesTicker].map((item, index) => (
            <span key={`${item}-${index}`} className="flex items-center gap-3 text-sm font-bold tracking-widest text-white/20">
              {item}
              <span className="text-xs text-indigo-500">*</span>
            </span>
          ))}
        </div>
      </section>
    </>
  );
}
