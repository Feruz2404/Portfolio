import Link from "next/link";
import type { Route } from "next";
import { prisma } from "@/lib/db";
import { requireAdminPage } from "@/lib/adminAuth";

export default async function AdminProjectsPage() {
  await requireAdminPage("projects:read");
  const projects = await prisma.project.findMany({ orderBy: { updatedAt: "desc" } });

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="eyebrow">Content / portfolio</p><h1 className="mt-2 text-3xl font-semibold tracking-[-0.06em]">Projects</h1><p className="mt-2 text-sm text-white/50">Control the story, screenshots, GitHub repository, and Vercel link for every project.</p></div><Link href="/admin/projects/new" className="inline-flex w-fit rounded-full bg-cyan-100 px-4 py-2.5 text-sm font-bold text-surface-00 transition hover:bg-white">New project +</Link></div>
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-surface-01">
        <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-sm"><thead className="border-b border-white/10 text-left text-[10px] uppercase tracking-[0.16em] text-white/35"><tr><th className="px-5 py-4">Project</th><th className="px-5 py-4">Status</th><th className="px-5 py-4">Links</th><th className="px-5 py-4">Featured</th><th className="px-5 py-4">Updated</th></tr></thead><tbody>{projects.map((project) => <tr key={project.id} className="border-b border-white/5 last:border-0"><td className="px-5 py-4"><Link className="font-semibold text-white transition hover:text-cyan-100" href={`/admin/projects/${project.id}/edit` as Route}>{project.title}</Link><div className="mt-1 text-xs text-white/35">{project.category}</div></td><td className="px-5 py-4"><span className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${project.status === "COMPLETED" ? "bg-cyan-100/10 text-cyan-100" : "bg-white/5 text-white/45"}`}>{project.status.replace("_", " ")}</span></td><td className="px-5 py-4"><div className="flex gap-3 text-xs text-white/45">{(project.vercelUrl ?? project.liveUrl) ? <a href={project.vercelUrl ?? project.liveUrl ?? undefined} target="_blank" rel="noreferrer" className="hover:text-white">Vercel ↗</a> : <span className="text-white/20">No Vercel</span>}{project.githubUrl ? <a href={project.githubUrl} target="_blank" rel="noreferrer" className="hover:text-white">GitHub ↗</a> : <span className="text-white/20">No GitHub</span>}</div></td><td className="px-5 py-4 text-white/55">{project.featured ? "Yes" : "—"}</td><td className="px-5 py-4 font-mono text-xs text-white/35">{project.updatedAt.toISOString().slice(0, 10)}</td></tr>)}</tbody></table></div>
        {!projects.length ? <div className="px-5 py-14 text-center text-sm text-white/40">No projects yet. Create the first one.</div> : null}
      </div>
    </div>
  );
}
