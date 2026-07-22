"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";

export default function ClientCtaContent() {
  const home = useTranslations("home");

  return (
    <section className="relative overflow-hidden border-t border-white/10 bg-[#020208] px-6 py-28">
      <div className="absolute inset-0 opacity-[0.16] [background-image:linear-gradient(90deg,rgba(255,255,255,0.07)_1px,transparent_1px)] [background-size:96px_96px]" />
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end"
      >
        <div>
          <p className="section-eyebrow">Contact</p>
          <h2 className="max-w-4xl text-[clamp(3rem,7vw,7rem)] font-black leading-[0.88] tracking-normal text-white">
            {home("ctaTitle")}
          </h2>
        </div>
        <div className="space-y-7">
          <p className="max-w-xl text-base leading-8 text-white/58">{home("ctaSubtitle")}</p>
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 bg-white px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-teal-100"
          >
            {home("getInTouch")}
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
          <p className="text-xs text-white/35">{home("ctaNote")}</p>
        </div>
      </motion.div>
    </section>
  );
}
