import { Link } from "@/lib/i18n/navigation";
import { prisma } from "@/lib/db";
import { publicProjectSelect, PUBLIC_PROJECT_STATUSES } from "@/lib/publicData";

export default async function CaseStudiesPage() {
  const studies = await prisma.caseStudy.findMany({
    where: { published: true, project: { status: { in: PUBLIC_PROJECT_STATUSES } } },
    select: { id: true, overview: true, project: { select: publicProjectSelect }, updatedAt: true },
    orderBy: { updatedAt: "desc" }
  });

  return (
    <main className="min-h-dvh px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-semibold tracking-tight">Case Studies</h1>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {studies.map((s) => (
            <Link key={s.id} href={`/case-studies/${s.project.slug}`} className="rounded-xl border border-white/10 bg-surface-01 p-5 hover:border-white/20">
              <div className="text-lg font-semibold">{s.project.title}</div>
              <p className="mt-2 text-sm text-white/60 line-clamp-2">{s.overview}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
