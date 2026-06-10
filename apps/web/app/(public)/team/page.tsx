import { prisma } from "@/lib/db";
import Link from "next/link";
import { Navigation } from "@/components/shared/Navigation";
import { Footer } from "@/components/shared/Footer";

export default async function TeamPage() {
  const members = await prisma.teamMember.findMany({ where: { isActive: true }, orderBy: { order: "asc" } });

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="px-6">
        <section className="mx-auto max-w-6xl py-16">
          <h1 className="text-4xl font-bold">Team</h1>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {members.map((m) => (
              <Link key={m.id} href={`/team/${m.slug}`} className="rounded-xl border border-border bg-card p-5 hover:bg-card/80">
                <div className="text-lg font-semibold">{m.fullName}</div>
                <div className="mt-1 text-sm text-muted-foreground">{m.position}</div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
