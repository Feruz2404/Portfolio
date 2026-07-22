import { prisma } from "@/lib/db";
import { requireAdminPage } from "@/lib/adminAuth";

export default async function AdminServicesPage() {
  await requireAdminPage("services:write");

  const services = await prisma.service.findMany({ orderBy: [{ featured: "desc" }, { order: "asc" }] });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Services</h1>
      <div className="overflow-hidden rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-surface-01 text-left text-white/60">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3">Featured</th>
            </tr>
          </thead>
          <tbody>
            {services.map((s) => (
              <tr key={s.id} className="border-t border-white/10">
                <td className="px-4 py-3">{s.title}</td>
                <td className="px-4 py-3 text-white/70">{s.isActive ? "Yes" : "No"}</td>
                <td className="px-4 py-3 text-white/70">{s.featured ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
