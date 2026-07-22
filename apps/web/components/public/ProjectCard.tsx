import Image from "next/image";
import { Link } from "@/lib/i18n/navigation";
import { TiltCard } from "@/components/ui/TiltCard";
import { Tag } from "@/components/ui/Tag";

export type ProjectCardData = {
  slug: string;
  title: string;
  description: string;
  category: string;
  technologies: string[];
  screenshots: string[];
  featured?: boolean;
};

export function ProjectCard({
  project,
  viewLabel,
  priority = false,
}: {
  project: ProjectCardData;
  viewLabel: string;
  priority?: boolean;
}) {
  const cover = project.screenshots?.[0];
  return (
    <TiltCard className="h-full">
      <Link
        href={`/projects/${project.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-lg border border-line bg-ink-850/60 transition-colors duration-300 hover:border-accent/30 focus-visible:border-accent"
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-ink-800">
          {cover ? (
            <Image
              src={cover}
              alt={project.title}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              priority={priority}
            />
          ) : (
            <div className="atelier-grid absolute inset-0 opacity-60" aria-hidden />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent" />
        </div>
        <div className="flex flex-1 flex-col p-5">
          <div className="flex items-center gap-2">
            <span className="eyebrow">{project.category}</span>
          </div>
          <h3 className="mt-3 text-lg font-semibold tracking-tight text-bone">{project.title}</h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-bone-muted">{project.description}</p>
          {project.technologies?.length ? (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {project.technologies.slice(0, 4).map((tech) => (
                <Tag key={tech}>{tech}</Tag>
              ))}
            </div>
          ) : null}
          <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-accent">
            {viewLabel}
            <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </span>
        </div>
      </Link>
    </TiltCard>
  );
}
