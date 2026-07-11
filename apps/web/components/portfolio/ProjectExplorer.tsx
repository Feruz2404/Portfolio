"use client";

import { useMemo, useState } from "react";
import type { PublicProject } from "@/lib/portfolioData";
import ProjectCard from "@/components/portfolio/ProjectCard";

export default function ProjectExplorer({ projects }: { projects: PublicProject[] }) {
  const categories = ["All", ...Array.from(new Set(projects.map((project) => project.category))).filter(Boolean)];
  const [active, setActive] = useState("All");
  const visible = useMemo(() => (active === "All" ? projects : projects.filter((project) => project.category === active)), [active, projects]);

  return (
    <>
      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map((category) => (
          <button key={category} type="button" onClick={() => setActive(category)} className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition ${active === category ? "border-cyan-200/70 bg-cyan-100/10 text-cyan-100" : "border-white/10 text-white/45 hover:border-white/25 hover:text-white"}`}>
            {category}
          </button>
        ))}
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        {visible.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}
      </div>
    </>
  );
}
