import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import type { Locale } from "@/lib/i18n/config";
import { buildMetadata, absoluteUrl, localizedPath } from "@/lib/seo";
import { Section, Container } from "@/components/ui/layout";
import { Tag } from "@/components/ui/Tag";
import { ButtonAnchor } from "@/components/ui/Button";
import { RichText } from "@/components/public/RichText";
import { JsonLd } from "@/components/seo/JsonLd";
import { getProjectBySlug, getProjectSlugs, getAdjacentProject } from "@/lib/content";

export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = await getProjectBySlug(locale, slug);
  if (!project) return {};
  return buildMetadata({
    locale,
    path: `/projects/${slug}`,
    title: project.title,
    description: project.description.slice(0, 200),
    images: project.screenshots?.slice(0, 1),
  });
}

function DetailBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-4 border-t border-line py-10 md:grid-cols-[0.4fr_1fr] md:gap-10">
      <h2 className="eyebrow h-fit">{label}</h2>
      <div className="max-w-prose">{children}</div>
    </div>
  );
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  // Resilient read: returns null on missing record OR db error → clean 404,
  // never a swallowed "temporarily unavailable".
  const project = await getProjectBySlug(locale, slug);
  if (!project) notFound();

  const d = await getTranslations("projects.detail");
  const cover = project.screenshots?.[0];
  const gallery = project.screenshots?.slice(1) ?? [];
  const year = project.endDate ? new Date(project.endDate).getFullYear() : null;
  const next = await getAdjacentProject(locale, slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    ...(cover ? { image: cover } : {}),
    url: absoluteUrl(localizedPath(locale, `/projects/${slug}`)),
    ...(project.liveUrl ? { sameAs: project.liveUrl } : {}),
    keywords: project.technologies?.join(", "),
  };

  return (
    <>
      <JsonLd data={jsonLd} />

      {/* Header */}
      <Section width="content" className="pt-12 md:pt-16">
        <Link href="/projects" className="inline-flex items-center gap-1 text-sm text-bone-muted transition-colors hover:text-accent">
          <span aria-hidden>←</span> {d("backToProjects")}
        </Link>
        <div className="mt-8 flex flex-wrap items-center gap-2">
          <Tag tone="accent">{project.category}</Tag>
          {project.industry ? <Tag>{project.industry}</Tag> : null}
          {year ? <Tag tone="muted">{year}</Tag> : null}
        </div>
        <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-tight text-bone md:text-6xl">
          {project.title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-bone-muted">{project.description}</p>

        {(project.liveUrl || project.githubUrl) && (
          <div className="mt-8 flex flex-wrap gap-3">
            {project.liveUrl ? (
              <ButtonAnchor href={project.liveUrl} size="md">
                {d("liveSite")} <span aria-hidden>↗</span>
              </ButtonAnchor>
            ) : null}
            {project.githubUrl ? (
              <ButtonAnchor href={project.githubUrl} size="md" variant="secondary">
                {d("sourceCode")} <span aria-hidden>↗</span>
              </ButtonAnchor>
            ) : null}
          </div>
        )}
      </Section>

      {/* Hero media */}
      {cover ? (
        <Container width="wide" className="mt-4">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-line bg-ink-800">
            <Image src={cover} alt={project.title} fill sizes="(min-width: 1024px) 80vw, 100vw" className="object-cover" priority />
          </div>
        </Container>
      ) : null}

      {/* Body */}
      <Section width="content" className="pt-14">
        {project.challenge ? (
          <DetailBlock label={d("challenge")}>
            <RichText text={project.challenge} />
          </DetailBlock>
        ) : null}
        {project.caseStudy?.process ? (
          <DetailBlock label={d("process")}>
            <RichText text={project.caseStudy.process} />
          </DetailBlock>
        ) : null}
        {project.architecture ? (
          <DetailBlock label={d("architecture")}>
            <RichText text={project.architecture} />
          </DetailBlock>
        ) : null}
        {project.solution ? (
          <DetailBlock label={d("solution")}>
            <RichText text={project.solution} />
          </DetailBlock>
        ) : null}
        {project.results ? (
          <DetailBlock label={d("results")}>
            <RichText text={project.results} />
          </DetailBlock>
        ) : null}

        {/* Tech stack */}
        {project.technologies?.length ? (
          <DetailBlock label={d("stack")}>
            <ul className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <li key={tech}>
                  <Tag>{tech}</Tag>
                </li>
              ))}
            </ul>
          </DetailBlock>
        ) : null}

        {/* Team & contributions */}
        {project.teamMembers?.length ? (
          <DetailBlock label={d("team")}>
            <ul className="flex flex-col gap-3">
              {project.teamMembers.map((tm) => (
                <li key={tm.id}>
                  <Link
                    href={`/team/${tm.member.slug}`}
                    className="flex items-center justify-between gap-4 rounded-lg border border-line bg-ink-850/50 p-4 transition-colors hover:border-accent/30"
                  >
                    <span>
                      <span className="block font-medium text-bone">{tm.member.fullName}</span>
                      <span className="block text-sm text-bone-faint">{tm.member.position}</span>
                    </span>
                    <span className="text-sm text-accent">{tm.role}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </DetailBlock>
        ) : null}
      </Section>

      {/* Gallery */}
      {gallery.length ? (
        <Section width="wide" className="pt-0">
          <h2 className="eyebrow">{d("gallery")}</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {gallery.map((src, i) => (
              <div key={src} className="relative aspect-[16/10] overflow-hidden rounded-lg border border-line bg-ink-800">
                <Image src={src} alt={`${project.title} — ${i + 2}`} fill sizes="(min-width: 640px) 50vw, 100vw" className="object-cover" />
              </div>
            ))}
          </div>
        </Section>
      ) : null}

      {/* Next project */}
      {next ? (
        <Section width="content" className="border-t border-line">
          <Link href={`/projects/${next.slug}`} className="group flex items-center justify-between gap-4">
            <span>
              <span className="eyebrow">{d("nextProject")}</span>
              <span className="mt-2 block text-2xl font-semibold tracking-tight text-bone group-hover:text-accent md:text-3xl">
                {next.title}
              </span>
            </span>
            <span aria-hidden className="text-2xl text-bone-faint transition-transform group-hover:translate-x-1 group-hover:text-accent">→</span>
          </Link>
        </Section>
      ) : null}
    </>
  );
}
