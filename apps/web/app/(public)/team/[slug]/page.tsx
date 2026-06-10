import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { Navigation } from "@/components/shared/Navigation";
import { Footer } from "@/components/shared/Footer";

export default async function TeamMemberPage({ params }: { params: { slug: string } }) {
  const member = await prisma.teamMember.findUnique({
    where: { slug: params.slug },
    include: { projects: { include: { project: true } }, achievements: true },
  });

  if (!member) notFound();

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="px-6">
        <article className="mx-auto max-w-4xl py-16">
          <h1 className="text-4xl font-bold">{member.fullName}</h1>
          <p className="mt-2 text-muted-foreground">{member.position}</p>

          <section className="mt-10">
            <h2 className="text-xl font-semibold">Projects</h2>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {member.projects.map((p) => (
                <div key={p.id} className="rounded-lg border border-border bg-card p-4">
                  <div className="font-semibold">{p.project.title}</div>
                  <div className="text-sm text-muted-foreground">{p.role}</div>
                </div>
              ))}
            </div>
          </section>
        </article>
      </main>
      <Footer />
    </div>
  );
}
