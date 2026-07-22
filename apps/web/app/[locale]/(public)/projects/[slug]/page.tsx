import Image from "next/image";
import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import { prisma } from "@/lib/db";
import { getEnv } from "@/lib/env";

const copy = {
  en: { team: "Team", challenge: "Challenge", solution: "Solution", architecture: "Architecture", results: "Results" },
  ru: { team: "Команда", challenge: "Задача", solution: "Решение", architecture: "Архитектура", results: "Результаты" },
  uz: { team: "Jamoa", challenge: "Muammo", solution: "Yechim", architecture: "Arxitektura", results: "Natijalar" },
} as const;

function getCopy(locale: string) {
  if (locale === "ru" || locale === "uz") return copy[locale];
  return copy.en;
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  if (!getEnv().DATABASE_URL) return notFound();

  const [{ slug }, locale] = await Promise.all([params, getLocale()]);
  const text = getCopy(locale);
  const project = await prisma.project.findUnique({
    where: { slug },
    include: { teamMembers: { include: { member: true } }, testimonials: true, caseStudy: true },
  });
  if (!project) return notFound();

  const sections = [
    { title: text.challenge, body: project.challenge },
    { title: text.solution, body: project.solution },
    { title: text.architecture, body: project.architecture },
    { title: text.results, body: project.results },
  ]
    .filter((section) => Boolean(section.body))
    .map((section) => ({ title: section.title, body: section.body ?? "" }));

  return (
    <main className="min-h-dvh px-6 pb-24 pt-32">
      <article className="section-shell">
        <p className="section-eyebrow">{project.category}</p>
        <div className="mt-5 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <h1 className="section-title">{project.title}</h1>
          <p className="max-w-xl text-base leading-8 text-white/58 lg:justify-self-end">{project.description}</p>
        </div>

        {project.screenshots[0] ? (
          <div className="relative mt-14 aspect-[16/9] overflow-hidden border border-white/10 bg-white/[0.03]">
            <Image src={project.screenshots[0]} alt={project.title} fill priority sizes="100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#020208]/70 via-transparent to-transparent" />
          </div>
        ) : null}

        <div className="mt-12 flex flex-wrap gap-2">
          {project.technologies.map((technology) => (
            <span key={technology} className="border border-white/10 px-3 py-2 text-xs uppercase tracking-[0.16em] text-white/48">
              {technology}
            </span>
          ))}
        </div>

        {sections.length ? (
          <section className="mt-16 divide-y divide-white/10 border-y border-white/10">
            {sections.map((section) => (
              <div key={section.title} className="grid gap-6 py-8 lg:grid-cols-[280px_1fr]">
                <h2 className="text-2xl font-semibold text-white">{section.title}</h2>
                <p className="max-w-3xl text-sm leading-7 text-white/58">{section.body}</p>
              </div>
            ))}
          </section>
        ) : null}

        {project.teamMembers.length ? (
          <section className="mt-16">
            <h2 className="text-2xl font-semibold text-white">{text.team}</h2>
            <div className="mt-5 grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2">
              {project.teamMembers.map((teamMember) => (
                <div key={teamMember.id} className="bg-[#05050d] p-5">
                  <div className="font-semibold">{teamMember.member.fullName}</div>
                  <div className="mt-1 text-sm text-white/54">{teamMember.role}</div>
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </article>
    </main>
  );
}
