import { databaseIsConfigured, prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function TestimonialsPage() {
  const testimonials = databaseIsConfigured ? await prisma.testimonial.findMany({ where: { approved: true }, orderBy: [{ featured: "desc" }, { createdAt: "desc" }] }).catch(() => []) : [];
  return <main className="min-h-dvh bg-surface-00 px-6 py-16 sm:px-10 lg:px-12"><div className="mx-auto max-w-7xl"><div className="max-w-3xl"><p className="eyebrow">Testimonials / kind words</p><h1 className="mt-5 text-5xl font-semibold tracking-[-0.08em] sm:text-7xl">The work is better when the relationship is good.</h1></div>{testimonials.length ? <div className="mt-14 grid gap-5 lg:grid-cols-2">{testimonials.map((testimonial) => <figure key={testimonial.id} className="rounded-3xl border border-white/10 bg-white/[0.035] p-7 sm:p-9"><div className="font-serif text-5xl leading-none text-cyan-100/50">“</div><blockquote className="mt-5 text-xl leading-8 text-white/75">{testimonial.content}</blockquote><figcaption className="mt-8 border-t border-white/10 pt-5"><div className="font-semibold text-white">{testimonial.name}</div><div className="mt-1 text-sm text-white/40">{[testimonial.position, testimonial.company].filter(Boolean).join(" · ")}</div></figcaption></figure>)}</div> : <div className="mt-14 rounded-3xl border border-white/10 bg-white/[0.035] p-8 text-sm leading-7 text-white/50">Client words will appear here as projects are published.</div>}</div></main>;
}
