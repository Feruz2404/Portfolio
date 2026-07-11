import { databaseIsConfigured, prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const fallbackServices = [
  { id: "strategy", title: "Product direction", description: "Turn a loose brief into a clear product story, a strong structure, and a roadmap the team can believe in.", features: ["Positioning", "User journeys", "Experience direction"] },
  { id: "interface", title: "Interface systems", description: "Design and build expressive interfaces that stay coherent as the product grows.", features: ["Design systems", "Prototypes", "Responsive UI"] },
  { id: "engineering", title: "Creative engineering", description: "Bring the hard parts to life: motion, 3D, data, integrations, and the edges that make software feel finished.", features: ["Next.js", "WebGL / Three.js", "API architecture"] },
  { id: "launch", title: "Launch & refine", description: "Ship a fast, measurable first version, then keep improving the details that users actually feel.", features: ["Performance", "Analytics", "Iteration"] }
];

export default async function ServicesPage() {
  const services = databaseIsConfigured ? await prisma.service.findMany({ where: { isActive: true }, orderBy: [{ featured: "desc" }, { order: "asc" }] }).catch(() => []) : [];
  const items = services.length ? services.map((service) => ({ ...service, features: service.features ?? [] })) : fallbackServices;

  return <main className="min-h-dvh bg-surface-00 px-6 py-16 sm:px-10 lg:px-12"><div className="mx-auto max-w-7xl"><div className="max-w-3xl"><p className="eyebrow">Services / from first thought to shipped</p><h1 className="mt-5 text-5xl font-semibold tracking-[-0.08em] sm:text-7xl">A small team’s range, with one point of view.</h1><p className="mt-6 max-w-xl text-base leading-7 text-white/55">Bring a product, an idea, or a problem. We’ll find the smallest useful shape, then give it enough character to stand out.</p></div><div className="mt-16 grid gap-4 lg:grid-cols-2">{items.map((service, index) => <article key={service.id} className="group rounded-3xl border border-white/10 bg-white/[0.035] p-6 transition hover:border-cyan-200/30 hover:bg-white/[0.055] sm:p-8"><div className="flex items-start justify-between gap-4"><span className="font-mono text-xs text-brand-pink">0{index + 1}</span><span className="text-2xl text-white/25 transition group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-cyan-100">↗</span></div><h2 className="mt-12 text-2xl font-semibold tracking-[-0.04em]">{service.title}</h2><p className="mt-4 max-w-lg text-sm leading-6 text-white/50">{service.description}</p><div className="mt-8 flex flex-wrap gap-2">{service.features.slice(0, 5).map((feature) => <span key={feature} className="rounded-full border border-white/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-white/45">{feature}</span>)}</div></article>)}</div></div></main>;
}
