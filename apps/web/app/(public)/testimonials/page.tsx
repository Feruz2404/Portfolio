import { prisma } from "@/lib/db";
import { getEnv } from "@/lib/env";

export const dynamic = "force-dynamic";

export default async function TestimonialsPage() {
  if (!getEnv().DATABASE_URL) {
    return (
      <main className="min-h-dvh px-6 py-16">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-3xl font-semibold tracking-tight">Testimonials</h1>
          <p className="mt-4 text-sm text-white/60">Testimonials are coming soon.</p>
        </div>
      </main>
    );
  }

  const testimonials = await prisma.testimonial.findMany({ where: { approved: true }, orderBy: [{ featured: "desc" }, { createdAt: "desc" }] });

  return (
    <main className="min-h-dvh px-6 py-16">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-semibold tracking-tight">Testimonials</h1>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {testimonials.map((t) => (
            <div key={t.id} className="rounded-xl border border-white/10 bg-surface-01 p-5">
              <div className="font-semibold">{t.name}</div>
              <div className="mt-2 text-sm text-white/60 whitespace-pre-wrap">{t.content}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
