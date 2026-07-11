import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { publicProjectSelect, publicTeamSelect, PUBLIC_PROJECT_STATUSES } from "@/lib/publicData";

export default async function TeamMemberPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const member = await prisma.teamMember.findFirst({
    where: { slug, isActive: true },
    select: {
      ...publicTeamSelect,
      projects: { where: { project: { status: { in: PUBLIC_PROJECT_STATUSES } } }, select: { id: true, role: true, project: { select: publicProjectSelect } } },
      achievements: { select: { id: true, title: true, description: true, date: true } }
    }
  });
  if (!member) return notFound();

  return (
    <main className="min-h-dvh px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-semibold tracking-tight">{member.fullName}</h1>
        <p className="mt-2 text-white/60">{member.position}</p>
        {member.bio ? <p className="mt-6 text-white/70">{member.bio}</p> : null}

        {member.projects.length ? (
          <section className="mt-10">
            <h2 className="text-lg font-semibold">Projects</h2>
            <div className="mt-3 space-y-3">
              {member.projects.map((pm) => (
                <div key={pm.id} className="rounded-lg border border-white/10 bg-surface-01 p-4">
                  <div className="font-semibold">{pm.project.title}</div>
                  <div className="text-sm text-white/60">{pm.role}</div>
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
