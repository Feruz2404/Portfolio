import { Link } from "@/lib/i18n/navigation";
import { prisma } from "@/lib/db";
import { publicProjectSelect, publicProjectWhere } from "@/lib/publicData";

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    where: publicProjectWhere,
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    select: publicProjectSelect
  });

  return (
    <main className="min-h-dvh px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-semibold tracking-tight">Projects</h1>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {projects.map((p) => (
            <Link
              key={p.id}
              href={`/projects/${p.slug}`}
              className="rounded-xl border border-white/10 bg-surface-01 p-5 hover:border-white/20"
            >
              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold">{p.title}</div>
                {p.featured ? <span className="text-xs text-brand-cyan">Featured</span> : null}
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-white/60">{p.description}</p>
              <div className="mt-4 text-xs text-white/50">{p.category}</div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
