"use client";

import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { ArrowUpRight, CircleDot } from "lucide-react";
import { Link } from "@/lib/i18n/navigation";

const HeroScene = dynamic(() => import("@/components/3d/HeroScene"), { ssr: false });

const stats = [
  { key: "s_projects", number: "50+" },
  { key: "s_experience", number: "5+" },
  { key: "s_languages", number: "3" },
];

const servicesTicker = [
  "Product architecture",
  "Next.js systems",
  "Admin platforms",
  "3D interfaces",
  "Database design",
  "Growth engineering",
];

export default function HomeHero() {
  const t = useTranslations("hero");
  const home = useTranslations("home");

  return (
    <>
      <section className="relative min-h-[92svh] overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_62%_35%,rgba(42,197,180,0.12),transparent_30%),linear-gradient(180deg,#020208_0%,#05030a_58%,#020208_100%)]">
        <div className="absolute inset-0 opacity-[0.22] [background-image:linear-gradient(rgba(255,255,255,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:120px_120px]" />
        <div className="absolute inset-y-0 right-0 w-full md:w-[72%]">
          <HeroScene />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#020208_0%,rgba(2,2,8,0.88)_31%,rgba(2,2,8,0.46)_63%,rgba(2,2,8,0.18)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#020208] to-transparent" />

        <div className="relative z-10 mx-auto flex min-h-[92svh] max-w-7xl flex-col justify-center px-6 pb-16 pt-28 md:px-10 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl"
          >
            <div className="mb-8 inline-flex items-center gap-3 border border-white/12 bg-white/[0.03] px-4 py-2 text-xs uppercase tracking-[0.22em] text-white/68 backdrop-blur">
              <CircleDot className="h-3.5 w-3.5 text-teal-300" aria-hidden="true" />
              {t("available")}
            </div>

            <h1 className="max-w-5xl text-[clamp(3.8rem,10vw,9.4rem)] font-black leading-[0.82] tracking-normal text-white">
              <span className="block">{t("heading1")}</span>
              <span className="block text-white/92">{t("heading2")}</span>
              <span className="block text-teal-100">{t("heading3")}</span>
            </h1>

            <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,560px)_1fr] lg:items-end">
              <p className="max-w-xl text-base leading-8 text-white/62 md:text-lg">{t("subtitle")}</p>

              <div className="grid max-w-lg grid-cols-3 gap-px overflow-hidden border border-white/10 bg-white/10">
                {stats.map((stat) => (
                  <div key={stat.key} className="bg-[#05050d]/90 px-4 py-4">
                    <div className="font-mono text-2xl font-semibold text-white md:text-3xl">{stat.number}</div>
                    <div className="mt-2 text-[0.65rem] uppercase tracking-[0.18em] text-white/42">{home(stat.key)}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Link
                href="/projects"
                className="group inline-flex items-center gap-2 bg-white px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-teal-100"
              >
                {t("viewProjects")}
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center border border-white/16 px-5 py-3 text-sm font-semibold text-white/84 transition-colors hover:border-white/36 hover:text-white"
              >
                {t("contactUs")}
              </Link>
            </div>
          </motion.div>

          <div className="absolute bottom-7 left-6 hidden items-center gap-3 text-[0.65rem] uppercase tracking-[0.28em] text-white/32 md:flex lg:left-12">
            <span className="h-px w-12 bg-white/22" />
            {t("scroll")}
          </div>
        </div>
      </section>

      <section className="overflow-hidden border-y border-white/10 bg-[#030309] py-4">
        <div className="animate-marquee flex gap-8 whitespace-nowrap px-4">
          {[...servicesTicker, ...servicesTicker].map((item, index) => (
            <span key={`${item}-${index}`} className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-white/28">
              {item}
              <span className="h-1 w-1 rounded-full bg-teal-300/70" />
            </span>
          ))}
        </div>
      </section>
    </>
  );
}
