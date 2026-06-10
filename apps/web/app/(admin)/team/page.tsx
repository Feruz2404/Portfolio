import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function AdminTeamPage() {
  const members = await prisma.teamMember.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Team</h1>
        <Link className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground" href="/admin/team/new">
          New
        </Link>
      </div>

      <div className="mt-6 grid gap-3">
        {members.map((m) => (
          <Link key={m.id} href={`/admin/team/${m.id}/edit`} className="rounded-lg border border-border bg-card p-4 hover:bg-card/80">
            <div className="font-semibold">{m.fullName}</div>
            <div className="text-sm text-muted-foreground">{m.slug}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
