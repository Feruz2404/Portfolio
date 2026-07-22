import { getLocale } from "next-intl/server";
import { prisma } from "@/lib/db";
import { getEnv } from "@/lib/env";

export const dynamic = "force-dynamic";

const copy = {
  en: {
    eyebrow: "Services",
    title: "Capabilities for teams that need both beauty and operational depth.",
    body: "From architecture and public experience to admin workflows, we shape the whole system.",
    empty: "Services are coming soon.",
  },
  ru: {
    eyebrow: "Услуги",
    title: "Возможности для команд, которым нужны красота и операционная глубина.",
    body: "От архитектуры и публичного интерфейса до admin workflows - мы проектируем всю систему.",
    empty: "Услуги скоро появятся.",
  },
  uz: {
    eyebrow: "Xizmatlar",
    title: "Go'zallik va operatsion chuqurlik kerak bo'lgan jamoalar uchun imkoniyatlar.",
    body: "Arxitektura, public experience va admin workflows - biz butun tizimni shakllantiramiz.",
    empty: "Xizmatlar tez orada qo'shiladi.",
  },
} as const;

const fallbackServices = [
  {
    id: "architecture",
    title: "Product architecture",
    description: "Technical discovery, routing, data models, auth, permissions, and delivery planning.",
    features: ["System mapping", "Database design", "Delivery roadmap"],
  },
  {
    id: "interfaces",
    title: "Premium interfaces",
    description: "Cinematic public pages, admin surfaces, interaction polish, and accessibility.",
    features: ["Design systems", "Motion", "Responsive UX"],
  },
  {
    id: "operations",
    title: "Admin operations",
    description: "RBAC dashboards, CRUD workflows, audit logging, validation, and safe defaults.",
    features: ["NextAuth", "RBAC", "Audit trails"],
  },
];

function getCopy(locale: string) {
  if (locale === "ru" || locale === "uz") return copy[locale];
  return copy.en;
}

export default async function ServicesPage() {
  const text = getCopy(await getLocale());
  const services = await getServices();

  return (
    <main className="min-h-dvh px-6 pb-24 pt-32">
      <section className="section-shell">
        <p className="section-eyebrow">{text.eyebrow}</p>
        <div className="mt-5 grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-end">
          <h1 className="section-title">{text.title}</h1>
          <p className="max-w-xl text-base leading-8 text-white/58 lg:justify-self-end">{text.body}</p>
        </div>
      </section>

      <section className="section-shell mt-14 grid gap-px border border-white/10 bg-white/10 lg:grid-cols-3">
        {services.length ? (
          services.map((service, index) => (
            <article key={service.id} className="min-h-[360px] bg-[#05050d] p-7">
              <div className="font-mono text-sm text-teal-200/60">0{index + 1}</div>
              <h2 className="mt-16 text-2xl font-semibold text-white">{service.title}</h2>
              <p className="mt-4 text-sm leading-7 text-white/52">{service.description}</p>
              <div className="mt-7 flex flex-wrap gap-2">
                {service.features.slice(0, 4).map((feature) => (
                  <span key={feature} className="border border-white/10 px-2.5 py-1 text-[0.66rem] uppercase tracking-[0.14em] text-white/48">
                    {feature}
                  </span>
                ))}
              </div>
            </article>
          ))
        ) : (
          <div className="bg-[#05050d] p-8 text-white/58">{text.empty}</div>
        )}
      </section>
    </main>
  );
}

async function getServices() {
  if (!getEnv().DATABASE_URL) return fallbackServices;

  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      take: 6,
      orderBy: [{ featured: "desc" }, { order: "asc" }],
      select: { id: true, title: true, description: true, features: true },
    });

    return services.length ? services : fallbackServices;
  } catch {
    return fallbackServices;
  }
}
