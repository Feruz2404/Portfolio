"use client";

import { useMemo, useState } from "react";
import { ProjectCard, type ProjectCardData } from "@/components/public/ProjectCard";
import { cn } from "@/components/ui/utils";

export function ProjectsGrid({
  projects,
  allLabel,
  viewLabel,
}: {
  projects: (ProjectCardData & { id: string })[];
  allLabel: string;
  viewLabel: string;
}) {
  const categories = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => p.category && set.add(p.category));
    return Array.from(set);
  }, [projects]);

  const [active, setActive] = useState<string>("__all");
  const filtered = active === "__all" ? projects : projects.filter((p) => p.category === active);

  return (
    <div>
      {categories.length > 1 ? (
        <div role="group" aria-label={allLabel} className="mb-10 flex flex-wrap gap-2">
          {[{ key: "__all", label: allLabel }, ...categories.map((c) => ({ key: c, label: c }))].map((cat) => {
            const isActive = active === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActive(cat.key)}
                aria-pressed={isActive}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm transition-colors duration-fast",
                  isActive
                    ? "border-accent/40 bg-accent/10 text-accent"
                    : "border-line text-bone-muted hover:border-line-strong hover:text-bone",
                )}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((project, i) => (
          <ProjectCard key={project.id} project={project} viewLabel={viewLabel} priority={i < 3} />
        ))}
      </div>
    </div>
  );
}
