import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { PUBLIC_PROJECT_STATUSES } from "@/lib/publicData";

export default async function CaseStudyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await prisma.project.findFirst({ where: { slug, status: { in: PUBLIC_PROJECT_STATUSES } } });
  if (!project) return notFound();

  const study = await prisma.caseStudy.findUnique({ where: { projectId: project.id } });
  if (!study || !study.published) return notFound();

  return (
    <main className="min-h-dvh px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight">{project.title}</h1>
        <section className="mt-10 space-y-8">
          <Block title="Overview" body={study.overview} />
          <Block title="Challenge" body={study.challenge} />
          <Block title="Process" body={study.process} />
          <Block title="Solution" body={study.solution} />
          <Block title="Outcome" body={study.outcome} />
        </section>
      </div>
    </main>
  );
}

function Block({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-surface-01 p-6">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="mt-3 text-white/70 whitespace-pre-wrap">{body}</p>
    </div>
  );
}
