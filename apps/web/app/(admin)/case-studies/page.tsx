import { prisma } from "@/lib/db";

export default async function AdminCaseStudiesPage() {
  const studies = await prisma.caseStudy.findMany({ include: { project: true }, orderBy: { updatedAt: "desc" } });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Case Studies</h1>
      <div className="overflow-hidden rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-surface-01 text-left text-white/60">
            <tr>
              <th className="px-4 py-3">Project</th>
              <th className="px-4 py-3">Published</th>
            </tr>
          </thead>
          <tbody>
            {studies.map((s) => (
              <tr key={s.id} className="border-t border-white/10">
                <td className="px-4 py-3">{s.project.title}</td>
                <td className="px-4 py-3 text-white/70">{s.published ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
