"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useLocale } from "next-intl";
import { useState } from "react";
import { Link } from "@/lib/i18n/navigation";

const categories = ["All", "Web Application", "API / Backend", "Healthcare", "AI / Machine Learning"];

const copy = {
  en: {
    eyebrow: "Portfolio",
    title: "Selected systems, platforms, and digital products.",
    body: "A complete view of the work: from public product experiences to the operational layers behind them.",
    all: "All",
    featured: "Featured",
    view: "View project",
    emptyTitle: "No projects available yet",
    emptyBody: "Seed the database or create a project from the admin dashboard to populate this page.",
  },
  ru: {
    eyebrow: "Портфолио",
    title: "Избранные системы, платформы и цифровые продукты.",
    body: "Полный взгляд на работу: от публичных продуктовых интерфейсов до операционных слоёв под ними.",
    all: "Все",
    featured: "Избранное",
    view: "Открыть проект",
    emptyTitle: "Проектов пока нет",
    emptyBody: "Запустите seed или создайте проект в admin dashboard, чтобы наполнить страницу.",
  },
  uz: {
    eyebrow: "Portfolio",
    title: "Tanlangan tizimlar, platformalar va raqamli mahsulotlar.",
    body: "Ishlarning to'liq ko'rinishi: ommaviy product experience va uning ortidagi operatsion qatlamlar.",
    all: "Barchasi",
    featured: "Tanlangan",
    view: "Loyihani ko'rish",
    emptyTitle: "Hozircha loyiha yo'q",
    emptyBody: "Bu sahifani to'ldirish uchun seed ishga tushiring yoki admin dashboard orqali loyiha yarating.",
  },
} as const;

type Project = {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  technologies: string[];
  screenshots: string[];
  featured: boolean;
};

function getCopy(locale: string) {
  if (locale === "ru" || locale === "uz") return copy[locale];
  return copy.en;
}

export default function ProjectsClient({ projects }: { projects: Project[] }) {
  const locale = useLocale();
  const text = getCopy(locale);
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = activeFilter === "All" ? projects : projects.filter((project) => project.category === activeFilter);

  return (
    <main className="min-h-screen px-6 pb-24 pt-32">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65 }}
        className="section-shell"
      >
        <p className="section-eyebrow">{text.eyebrow}</p>
        <div className="mt-5 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <h1 className="section-title">{text.title}</h1>
          <p className="max-w-xl text-base leading-8 text-white/58 lg:justify-self-end">{text.body}</p>
        </div>

        <div className="mt-12 flex flex-wrap gap-2 border-y border-white/10 py-4">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveFilter(category)}
              className={[
                "border px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition-colors",
                activeFilter === category
                  ? "border-teal-200/40 bg-teal-200/10 text-teal-100"
                  : "border-white/10 text-white/48 hover:text-white",
              ].join(" ")}
            >
              {category === "All" ? text.all : category}
            </button>
          ))}
        </div>

        {filtered.length ? (
          <motion.div
            key={activeFilter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="mt-8 grid gap-4 lg:grid-cols-3"
          >
            {filtered.map((project, index) => (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                className="group overflow-hidden border border-white/10 bg-white/[0.025] transition-colors hover:border-teal-200/35"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-white/[0.03]">
                  {project.screenshots?.[0] ? (
                    <Image
                      src={project.screenshots[0]}
                      alt={project.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, 100vw"
                      className="object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0"
                    />
                  ) : (
                    <div className="h-full w-full bg-[linear-gradient(135deg,rgba(125,243,226,0.16),rgba(255,255,255,0.03))]" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020208] via-transparent to-transparent" />
                  <span className="absolute left-4 top-4 font-mono text-xs text-white/50">0{index + 1}</span>
                  {project.featured ? (
                    <span className="absolute right-4 top-4 border border-teal-200/30 bg-black/40 px-2 py-1 text-[0.65rem] uppercase tracking-[0.16em] text-teal-100 backdrop-blur">
                      {text.featured}
                    </span>
                  ) : null}
                </div>
                <div className="p-5">
                  <p className="text-[0.65rem] uppercase tracking-[0.22em] text-teal-200/68">{project.category}</p>
                  <h2 className="mt-3 text-2xl font-semibold leading-tight text-white">{project.title}</h2>
                  <p className="mt-4 line-clamp-3 text-sm leading-6 text-white/52">{project.description}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.technologies.slice(0, 4).map((technology) => (
                      <span key={technology} className="border border-white/10 px-2.5 py-1 text-[0.66rem] uppercase tracking-[0.14em] text-white/48">
                        {technology}
                      </span>
                    ))}
                  </div>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-teal-100">
                    {text.view}
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                  </span>
                </div>
              </Link>
            ))}
          </motion.div>
        ) : (
          <div className="mt-10 border border-white/10 bg-white/[0.025] p-8">
            <h2 className="text-2xl font-semibold">{text.emptyTitle}</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/52">{text.emptyBody}</p>
          </div>
        )}
      </motion.div>
    </main>
  );
}
