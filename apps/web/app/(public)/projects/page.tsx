import { prisma } from "@/lib/db";
import Link from "next/link";
import { Navigation } from "@/components/shared/Navigation";
import { Footer } from "@/components/shared/Footer";

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    where: { status: { in: ["IN_PROGRESS", "COMPLETED"] } },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="px-6">
        <section className="mx-auto max-w-6xl py-16">
          <h1 className="text-4xl font-bold">Projects</h1>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((p) => (
              <Link key={p.id} href={`/projects/${p.slug}`} className="rounded-xl border border-border bg-card p-5 hover:bg-card/80">
                <div className="text-lg font-semibold">{p.title}</div>
                <div className="mt-2 line-clamp-3 text-sm text-muted-foreground">{p.description}</div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
