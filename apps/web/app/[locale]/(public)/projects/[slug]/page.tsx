import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { publicProjectSelect, publicTeamSelect, PUBLIC_PROJECT_STATUSES } from "@/lib/publicData";

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await prisma.project.findFirst({
    where: { slug, status: { in: PUBLIC_PROJECT_STATUSES } },
    select: {
      ...publicProjectSelect,
      teamMembers: { where: { member: { isActive: true } }, select: { id: true, role: true, member: { select: publicTeamSelect } } },
      testimonials: { where: { approved: true }, select: { id: true, name: true, position: true, company: true, avatar: true, content: true, rating: true, featured: true } },
      caseStudy: { where: { published: true }, select: { id: true, heroImage: true, overview: true, challenge: true, process: true, solution: true, outcome: true, metrics: true, timeline: true, published: true } }
    }
  });
  if (!project) return notFound();

  return (
    <main className="min-h-dvh px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight">{project.title}</h1>
        <p className="mt-4 text-white/70">{project.description}</p>

        {project.teamMembers.length ? (
          <section className="mt-10">
            <h2 className="text-lg font-semibold">Team</h2>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {project.teamMembers.map((tm) => (
                <div key={tm.id} className="rounded-lg border border-white/10 bg-surface-01 p-4">
                  <div className="font-semibold">{tm.member.fullName}</div>
                  <div className="text-sm text-white/60">{tm.role}</div>
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
