import Link from "next/link";
import type { Route } from "next";
import { prisma } from "@/lib/db";
import { requireAdminPage } from "@/lib/adminAuth";

export default async function AdminContactsPage() {
  await requireAdminPage("contacts:write");

  const contacts = await prisma.contact.findMany({ orderBy: { updatedAt: "desc" } });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-normal">Contacts</h1>
      <div className="overflow-hidden rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-surface-01 text-left text-white/60">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((c) => (
              <tr key={c.id} className="border-t border-white/10">
                <td className="px-4 py-3">
                  <Link href={`/admin/contacts/${c.id}` as Route} className="hover:underline">
                    {c.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-white/70">{c.email}</td>
                <td className="px-4 py-3 text-white/70">{c.status}</td>
                <td className="px-4 py-3 text-white/60">{c.createdAt.toISOString().slice(0, 10)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
