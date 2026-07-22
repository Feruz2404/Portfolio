import Link from "next/link";
import type { Route } from "next";
import { prisma } from "@/lib/db";
import { requireAdminPage } from "@/lib/adminAuth";

export default async function AdminProjectsPage() {
  await requireAdminPage("projects:write");

  const projects = await prisma.project.findMany({ orderBy: { updatedAt: "desc" } });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-normal">Projects</h1>
          <p className="mt-1 text-sm text-white/60">Create and manage projects.</p>
        </div>
        <Link href="/admin/projects/new" className="rounded-md bg-brand-violet px-3 py-2 text-sm font-semibold">
          New project
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-surface-01 text-left text-white/60">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Featured</th>
              <th className="px-4 py-3">Updated</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p.id} className="border-t border-white/10">
                <td className="px-4 py-3">
                  <Link className="hover:underline" href={`/admin/projects/${p.id}/edit` as Route}>
                    {p.title}
                  </Link>
                </td>
                <td className="px-4 py-3 text-white/70">{p.status}</td>
                <td className="px-4 py-3 text-white/70">{p.featured ? "Yes" : "No"}</td>
                <td className="px-4 py-3 text-white/60">{p.updatedAt.toISOString().slice(0, 10)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
