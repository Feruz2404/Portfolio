import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import type { Locale } from "@/lib/i18n/config";
import { buildMetadata, absoluteUrl, localizedPath } from "@/lib/seo";
import { Section } from "@/components/ui/layout";
import { Tag } from "@/components/ui/Tag";
import { RichText } from "@/components/public/RichText";
import { SocialLinks, type SocialLink } from "@/components/public/SocialLinks";
import { JsonLd } from "@/components/seo/JsonLd";
import { getTeamMemberBySlug, getTeamSlugs } from "@/lib/content";

export const revalidate = 600;

export async function generateStaticParams() {
  const slugs = await getTeamSlugs();
  return slugs.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const member = await getTeamMemberBySlug(locale, slug);
  if (!member) return {};
  const desc = member.shortBio || member.bio || member.position;
  return buildMetadata({
    locale,
    path: `/team/${slug}`,
    title: `${member.fullName} — ${member.position}`,
    description: (desc ?? "").slice(0, 200),
    images: member.avatar ? [member.avatar] : undefined,
  });
}

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
}

export default async function TeamMemberPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const member = await getTeamMemberBySlug(locale, slug);
  if (!member) notFound();

  const t = await getTranslations("team");
  const a11y = await getTranslations("a11y");

  const socials = [
    member.githubUrl && { type: "github" as const, href: member.githubUrl },
    member.linkedinUrl && { type: "linkedin" as const, href: member.linkedinUrl },
    member.telegramUrl && { type: "telegram" as const, href: member.telegramUrl },
    member.portfolioUrl && { type: "portfolio" as const, href: member.portfolioUrl },
  ].filter(Boolean) as SocialLink[];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: member.fullName,
    jobTitle: member.position,
    ...(member.avatar ? { image: member.avatar } : {}),
    ...(member.shortBio || member.bio ? { description: member.shortBio || member.bio } : {}),
    url: absoluteUrl(localizedPath(locale, `/team/${slug}`)),
    sameAs: socials.map((s) => s.href),
    knowsAbout: member.skills,
  };

  return (
    <>
      <JsonLd data={jsonLd} />

      <Section width="content" className="pt-12 md:pt-16">
        <Link href="/team" className="inline-flex items-center gap-1 text-sm text-bone-muted transition-colors hover:text-accent">
          <span aria-hidden>←</span> {t("backToTeam")}
        </Link>

        <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-start md:gap-12">
          <div className="relative h-40 w-40 shrink-0 overflow-hidden rounded-xl border border-line bg-ink-800">
            {member.avatar ? (
              <Image src={member.avatar} alt={member.fullName} fill sizes="160px" className="object-cover" priority />
            ) : (
              <span className="flex h-full w-full items-center justify-center font-display text-4xl text-accent">
                {initials(member.fullName)}
              </span>
            )}
          </div>
          <div className="min-w-0">
            <h1 className="text-4xl font-semibold tracking-tight text-bone md:text-5xl">{member.fullName}</h1>
            <p className="mt-3 text-lg text-accent">{member.position}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-bone-muted">
              {member.department ? <span>{member.department}</span> : null}
              {member.department && member.yearsOfExp ? <span aria-hidden>·</span> : null}
              {member.yearsOfExp ? <span>{t("yearsExperience", { years: member.yearsOfExp })}</span> : null}
            </div>
            {member.shortBio ? <p className="mt-5 max-w-2xl leading-relaxed text-bone-muted">{member.shortBio}</p> : null}
            {socials.length ? <SocialLinks links={socials} labelFor={(name) => a11y("socialLabel", { name })} className="mt-6 flex gap-2" /> : null}
          </div>
        </div>
      </Section>

      <Section width="content" className="pt-4">
        <div className="grid gap-12 md:grid-cols-[1.4fr_0.6fr]">
          <div className="flex flex-col gap-10">
            {member.bio ? (
              <div>
                <h2 className="eyebrow">{t("eyebrow")}</h2>
                <div className="mt-4">
                  <RichText text={member.bio} />
                </div>
              </div>
            ) : null}

            {member.projects?.length ? (
              <div>
                <h2 className="eyebrow">{t("selectedProjects")}</h2>
                <ul className="mt-5 flex flex-col gap-3">
                  {member.projects.map((pm) => (
                    <li key={pm.id}>
                      <Link
                        href={`/projects/${pm.project.slug}`}
                        className="flex items-center justify-between gap-4 rounded-lg border border-line bg-ink-850/50 p-4 transition-colors hover:border-accent/30"
                      >
                        <span className="font-medium text-bone">{pm.project.title}</span>
                        <span className="text-sm text-accent">{pm.role}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {member.achievements?.length ? (
              <div>
                <h2 className="eyebrow">{t("achievements")}</h2>
                <ul className="mt-5 flex flex-col gap-3">
                  {member.achievements.map((a) => (
                    <li key={a.id} className="rounded-lg border border-line bg-ink-850/50 p-4">
                      <div className="font-medium text-bone">{a.title}</div>
                      {a.description ? <p className="mt-1 text-sm text-bone-muted">{a.description}</p> : null}
                      <div className="mt-1 text-xs text-bone-faint">
                        {new Intl.DateTimeFormat(locale, { year: "numeric", month: "short" }).format(new Date(a.date))}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <aside className="flex flex-col gap-8">
            {member.skills?.length ? (
              <div>
                <h2 className="eyebrow">{t("skills")}</h2>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {member.skills.map((s) => (
                    <li key={s}>
                      <Tag>{s}</Tag>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {member.certifications?.length ? (
              <div>
                <h2 className="eyebrow">{t("certifications")}</h2>
                <ul className="mt-4 flex flex-col gap-2">
                  {member.certifications.map((c) => (
                    <li key={c} className="flex items-start gap-2 text-sm text-bone-muted">
                      <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </aside>
        </div>
      </Section>
    </>
  );
}
