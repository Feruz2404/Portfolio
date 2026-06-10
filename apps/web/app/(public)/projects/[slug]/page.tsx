import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { Navigation } from "@/components/shared/Navigation";
import { Footer } from "@/components/shared/Footer";

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = await prisma.project.findUnique({
    where: { slug: params.slug },
    include: { teamMembers: { include: { member: true } }, testimonials: true, caseStudy: true },
  });

  if (!project) notFound();

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="px-6">
        <article className="mx-auto max-w-4xl py-16">
          <h1 className="text-4xl font-bold">{project.title}</h1>
          <p className="mt-4 text-muted-foreground">{project.description}</p>

          <section className="mt-10">
            <h2 className="text-xl font-semibold">Team</h2>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              {project.teamMembers.map((tm) => (
                <div key={tm.id} className="rounded-lg border border-border bg-card p-4">
                  <div className="font-semibold">{tm.member.fullName}</div>
                  <div className="text-sm text-muted-foreground">{tm.role}</div>
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
