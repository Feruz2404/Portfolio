"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { fadeInUp, staggerContainer } from "@/components/animations/variants";
import Link from "next/link";
import { useTranslations } from "next-intl";
import ServerContent from "./_sections/ServerContent";
import ClientCtaContent from "./_sections/ClientCtaContent";

const HeroScene = dynamic(() => import("@/components/3d/HeroScene"), { ssr: false });

const stats = [
  { key: "s_projects", number: "50+" },
  { key: "s_experience", number: "5+" },
  { key: "s_languages", number: "3" },
];

const servicesTicker = [
  "WEB DEVELOPMENT",
  "MOBILE APPS",
  "UI/UX DESIGN",
  "DATABASE ARCHITECTURE",
  "API DEVELOPMENT",
  "CLOUD INFRASTRUCTURE",
];

export default function HomePage() {
  const t = useTranslations("hero");
  const home = useTranslations("home");

  return (
    <main>
      {/* ── Hero Section ── */}
      <section className="relative min-h-screen grid grid-cols-1 lg:grid-cols-2 items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/30 via-purple-950/20 to-cyan-950/30" />
        <motion.div
          className="relative z-10 flex flex-col justify-center px-6 md:px-12 lg:px-20 pb-20"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={fadeInUp} className="flex items-center gap-2 mb-6">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-indigo-500" />
            </span>
            <span className="text-sm text-indigo-300 font-medium tracking-wide">{t("available")}</span>
          </motion.div>

          <motion.h1 variants={fadeInUp} className="text-5xl sm:text-6xl lg:text-8xl font-black leading-[0.95] tracking-tight">
            <span className="block text-white">{t("heading1")}</span>
            <span className="gradient-text block">{t("heading2")}</span>
            <span className="block text-white">{t("heading3")}</span>
          </motion.h1>

          <motion.p variants={fadeInUp} className="mt-6 text-base md:text-lg text-white/60 max-w-md leading-relaxed">
            {t("subtitle")}
          </motion.p>

          <motion.div variants={fadeInUp} className="mt-8 grid grid-cols-3 gap-4 md:gap-8">
            {stats.map((s) => (
              <div key={s.key}>
                <div className="text-2xl md:text-3xl font-black gradient-text">{s.number}</div>
                <div className="text-xs text-white/40 mt-1 tracking-wide">
                  {home(s.key)}
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div variants={fadeInUp} className="mt-10 flex flex-wrap gap-4">
            <Link href="/projects" className="inline-flex items-center px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-full transition-colors text-sm tracking-wide">
              {t("viewProjects")}
            </Link>
            <Link href="/contact" className="inline-flex items-center px-6 py-3 border border-white/20 hover:border-white/40 text-white font-semibold rounded-full transition-colors text-sm tracking-wide">
              {t("contactUs")}
            </Link>
          </motion.div>

          <motion.div variants={fadeInUp} className="absolute bottom-8 left-1/2 -translate-x-1/2 lg:left-auto lg:translate-x-0 lg:left-20">
            <div className="flex flex-col items-center gap-2 animate-bounce">
              <span className="text-[10px] text-white/30 tracking-widest uppercase">{t("scroll")}</span>
              <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
            </div>
          </motion.div>
        </motion.div>

        <div className="relative h-[50vh] lg:h-screen">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[120%] aspect-square rounded-full bg-gradient-to-br from-indigo-600/10 via-purple-600/5 to-cyan-600/10 blur-3xl" />
          </div>
          <div className="absolute inset-0">
            <HeroScene />
          </div>
        </div>
      </section>

      {/* ── Marquee Ticker ── */}
      <section className="border-y border-white/10 bg-black/50 overflow-hidden py-4">
        <div className="flex whitespace-nowrap animate-marquee gap-8 px-4">
          {[...servicesTicker, ...servicesTicker].map((item, i) => (
            <span key={i} className="text-sm font-bold tracking-widest text-white/20 flex items-center gap-3">
              {item}
              <span className="text-indigo-500 text-xs">✦</span>
            </span>
          ))}
        </div>
      </section>

      <ServerContent />
      <ClientCtaContent />

      {/* Custom CSS for marquee */}
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 25s linear infinite;
        }
      `}</style>
    </main>
  );
}


