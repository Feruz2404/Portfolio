import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ServicesPage() {
  const services = await prisma.service.findMany({ where: { isActive: true }, orderBy: [{ featured: "desc" }, { order: "asc" }] });

  return (
    <main className="min-h-dvh px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-semibold tracking-tight">Services</h1>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {services.map((s) => (
            <div key={s.id} className="rounded-xl border border-white/10 bg-surface-01 p-5">
              <div className="text-lg font-semibold">{s.title}</div>
              <p className="mt-2 text-sm text-white/60">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
