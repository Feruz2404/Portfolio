import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";

export default async function TeamMemberPage({ params }: { params: { slug: string } }) {
  const member = await prisma.teamMember.findUnique({
    where: { slug: params.slug },
    include: { projects: { include: { project: true } }, achievements: true }
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
