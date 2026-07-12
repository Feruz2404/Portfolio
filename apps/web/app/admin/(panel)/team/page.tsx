import Link from "next/link";
import type { Route } from "next";
import { prisma } from "@/lib/db";
import { requireAdminPage } from "@/lib/adminAuth";

export default async function AdminTeamPage() {
  await requireAdminPage("team:write");

  const team = await prisma.teamMember.findMany({ orderBy: [{ order: "asc" }, { updatedAt: "desc" }] });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Team</h1>
          <p className="mt-1 text-sm text-white/60">Manage team member profiles.</p>
        </div>
        <Link href="/admin/team/new" className="rounded-md bg-brand-violet px-3 py-2 text-sm font-semibold">
          New member
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-surface-01 text-left text-white/60">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Position</th>
              <th className="px-4 py-3">Active</th>
            </tr>
          </thead>
          <tbody>
            {team.map((m) => (
              <tr key={m.id} className="border-t border-white/10">
                <td className="px-4 py-3">
                  <Link href={`/admin/team/${m.id}/edit` as Route} className="hover:underline">
                    {m.fullName}
                  </Link>
                </td>
                <td className="px-4 py-3 text-white/70">{m.position}</td>
                <td className="px-4 py-3 text-white/70">{m.isActive ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
