import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function TeamPage() {
  const team = await prisma.teamMember.findMany({ where: { isActive: true }, orderBy: [{ order: "asc" }, { createdAt: "desc" }] });

  return (
    <main className="min-h-dvh px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-semibold tracking-tight">Team</h1>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((m) => (
            <Link
              key={m.id}
              href={`/team/${m.slug}`}
              className="rounded-xl border border-white/10 bg-surface-01 p-5 hover:border-white/20"
            >
              <div className="text-lg font-semibold">{m.fullName}</div>
              <div className="mt-1 text-sm text-white/60">{m.position}</div>
              <div className="mt-4 flex flex-wrap gap-2">
                {m.skills.slice(0, 6).map((s) => (
                  <span key={s} className="rounded-md border border-white/10 px-2 py-1 text-xs text-white/70">
                    {s}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
