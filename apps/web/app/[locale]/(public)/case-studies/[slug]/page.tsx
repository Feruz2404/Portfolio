import { notFound } from "next/navigation";
import { databaseIsConfigured, prisma } from "@/lib/db";
import { PUBLIC_PROJECT_STATUSES } from "@/lib/publicData";

export default async function CaseStudyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!databaseIsConfigured) return notFound();
  const project = await prisma.project.findFirst({ where: { slug, status: { in: PUBLIC_PROJECT_STATUSES } } });
  if (!project) return notFound();
  const study = await prisma.caseStudy.findUnique({ where: { projectId: project.id } });
  if (!study || !study.published) return notFound();

  return <main className="min-h-dvh bg-surface-00 px-6 py-16 sm:px-10 lg:px-12"><div className="mx-auto max-w-7xl"><div className="max-w-4xl border-b border-white/10 pb-16"><p className="eyebrow">{project.category} / case study</p><h1 className="mt-5 text-5xl font-semibold tracking-[-0.08em] sm:text-7xl">{project.title}</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-white/55">{project.description}</p></div><div className="mx-auto mt-16 max-w-3xl space-y-5"><Block title="Overview" body={study.overview} /><Block title="Challenge" body={study.challenge} /><Block title="Process" body={study.process} /><Block title="Solution" body={study.solution} /><Block title="Outcome" body={study.outcome} /></div></div></main>;
}

function Block({ title, body }: { title: string; body: string }) { return <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-6 sm:p-8"><p className="eyebrow">{title}</p><p className="mt-5 whitespace-pre-line text-lg leading-8 text-white/65">{body}</p></section>; }
