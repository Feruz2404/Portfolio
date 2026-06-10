import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function AdminProjectsPage() {
  const projects = await prisma.project.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Link className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground" href="/admin/projects/new">
          New
        </Link>
      </div>

      <div className="mt-6 grid gap-3">
        {projects.map((p) => (
          <Link key={p.id} href={`/admin/projects/${p.id}/edit`} className="rounded-lg border border-border bg-card p-4 hover:bg-card/80">
            <div className="font-semibold">{p.title}</div>
            <div className="text-sm text-muted-foreground">{p.slug}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
