"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Link } from "@/lib/i18n/navigation";

const CATEGORIES = ["All", "Web Application", "API / Backend", "Healthcare", "AI / Machine Learning"];

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

export default function ProjectsClient({ projects }: { projects: Project[] }) {
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered =
    activeFilter === "All" ? projects : projects.filter((p) => p.category === activeFilter);

  return (
    <main className="min-h-screen px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="max-w-7xl mx-auto text-center mb-16"
      >
        <h1 className="text-5xl md:text-6xl font-black tracking-tight">
          All <span className="gradient-text">Projects</span>
        </h1>
        <p className="mt-4 text-white/50 max-w-lg mx-auto">
          Explore our complete portfolio of digital products, platforms, and technical solutions.
        </p>
      </motion.div>

      {/* Category filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-12">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeFilter === cat
                ? "bg-indigo-600 text-white"
                : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto">
        <motion.div
          key={activeFilter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((p) => (
              <motion.div
                key={p.id}
                whileHover={{ y: -4 }}
                className="group glass rounded-2xl overflow-hidden hover:scale-[1.02] transition-all duration-300"
              >
                <div className="relative aspect-video overflow-hidden">
                  {p.screenshots?.[0] ? (
                    <Image
                      src={p.screenshots[0]}
                      alt={p.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-600/20 to-purple-600/20" />
                  )}
                </div>
                <div className="p-5">
                  {p.featured && (
                    <span className="text-[10px] uppercase tracking-widest text-indigo-400 font-semibold bg-indigo-500/10 px-2 py-0.5 rounded-full">
                      Featured
                    </span>
                  )}
                  <h3 className="mt-3 text-lg font-bold truncate">{p.title}</h3>
                  <p className="mt-1 text-xs text-white/50 line-clamp-2 leading-relaxed">{p.description}</p>
                  {p.technologies?.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {p.technologies.slice(0, 4).map((t) => (
                        <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/60">{t}</span>
                      ))}
                    </div>
                  )}
                  <Link
                    href={`/projects/${p.slug}`}
                    className="mt-4 inline-flex items-center text-sm font-medium text-indigo-400 group-hover:text-indigo-300 transition-colors"
                  >
                    View Project{" "}
                    <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  );
}
