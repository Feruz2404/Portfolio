import { Link } from "@/lib/i18n/navigation";
import type { PublicProject } from "@/lib/portfolioData";

export default function ProjectCard({ project, index = 0 }: { project: PublicProject; index?: number }) {
  const preview = project.screenshots[0];
  const vercelUrl = project.vercelUrl ?? project.liveUrl;

  return (
    <article className="group overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.035] transition duration-500 hover:-translate-y-1 hover:border-cyan-200/35 hover:bg-white/[0.06]">
      <Link href={`/projects/${project.slug}`} className="block">
        <div
          className="relative aspect-[16/10] overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_70%_20%,rgba(92,225,230,.28),transparent_28%),linear-gradient(135deg,#15172f,#05060d_60%,#1c1023)]"
          style={preview ? { backgroundImage: `linear-gradient(135deg, rgba(4, 6, 16, .25), rgba(4, 6, 16, .88)), url(${preview})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
        >
          <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(rgba(255,255,255,.07)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.07)_1px,transparent_1px)] [background-size:42px_42px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
          <div className="absolute left-5 top-5 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-cyan-100/75">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-200 shadow-[0_0_18px_#5ce1e6]" />
            {project.category}
          </div>
          <span className="absolute right-5 top-5 font-mono text-xs text-white/35">0{index + 1}</span>
          <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4">
            <span className="text-2xl font-semibold tracking-[-0.05em] text-white/95">{project.title}</span>
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/20 bg-black/20 text-lg text-white transition group-hover:rotate-45 group-hover:border-cyan-200/60">↗</span>
          </div>
        </div>
      </Link>
      <div className="space-y-5 p-5">
        <p className="max-w-xl text-sm leading-6 text-white/58">{project.description}</p>
        <div className="flex flex-wrap gap-2">
          {project.technologies.slice(0, 4).map((technology) => (
            <span key={technology} className="rounded-full border border-white/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-white/52">
              {technology}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-4 border-t border-white/10 pt-4 text-xs font-semibold uppercase tracking-[0.18em]">
          <Link href={`/projects/${project.slug}`} className="text-cyan-100 transition hover:text-white">
            Case study <span aria-hidden="true">↗</span>
          </Link>
          {vercelUrl ? <a href={vercelUrl} target="_blank" rel="noreferrer" className="text-white/45 transition hover:text-white">Vercel <span aria-hidden="true">↗</span></a> : null}
          {project.githubUrl ? <a href={project.githubUrl} target="_blank" rel="noreferrer" className="text-white/45 transition hover:text-white">GitHub <span aria-hidden="true">↗</span></a> : null}
        </div>
      </div>
    </article>
  );
}
