import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/lib/i18n/config";
import { buildMetadata } from "@/lib/seo";
import { Section, SectionHeading, Container } from "@/components/ui/layout";
import { Reveal, RevealGroup, revealItem } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { ProjectCard } from "@/components/public/ProjectCard";
import { TeamCard } from "@/components/public/TeamCard";
import { ServiceCard } from "@/components/public/ServiceCard";
import { ArticleCard } from "@/components/public/ArticleCard";
import { TestimonialCard } from "@/components/public/TestimonialCard";
import {
  getFeaturedProjects,
  getTeamMembers,
  getActiveServices,
  getApprovedTestimonials,
  getPublishedPosts,
} from "@/lib/content";
import { CAPABILITY_KEYS, PROCESS_STEPS, TECH_GROUPS } from "@/lib/site";
import { JsonLd } from "@/components/seo/JsonLd";
import { absoluteUrl, localizedPath } from "@/lib/seo";
import HomeHero from "./_sections/HomeHero";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return buildMetadata({
    locale,
    path: "/",
    title: t("defaultTitle"),
    description: t("defaultDescription"),
    absoluteTitle: true,
  });
}

const CAP_ICONS: Record<string, React.JSX.Element> = {
  cap1: <path d="M4 5h16M4 12h10M4 19h7" />,
  cap2: <path d="m8 6-5 6 5 6M16 6l5 6-5 6" />,
  cap3: <path d="M3 6h18M3 12h18M3 18h18" />,
  cap4: <path d="M12 3v18M3 12h18" />,
};

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("home");
  const common = await getTranslations("common");
  const a11y = await getTranslations("a11y");
  const process = await getTranslations("process");

  const [featured, team, services, testimonials, posts] = await Promise.all([
    getFeaturedProjects(locale, 3),
    getTeamMembers(locale, 3),
    getActiveServices(locale),
    getApprovedTestimonials(3),
    getPublishedPosts(locale, 3),
  ]);

  const orgUrl = absoluteUrl(localizedPath(locale, "/"));
  const jsonLd = [
    { "@context": "https://schema.org", "@type": "Organization", name: "Feruz", url: orgUrl, description: t("capabilitiesIntro") },
    { "@context": "https://schema.org", "@type": "WebSite", name: "Feruz", url: orgUrl, inLanguage: locale },
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <HomeHero />

      {/* Capabilities — honest capability statements, no invented metrics */}
      <Section width="wide">
        <SectionHeading eyebrow={t("capabilitiesEyebrow")} title={t("capabilitiesTitle")} intro={t("capabilitiesIntro")} />
        <RevealGroup className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CAPABILITY_KEYS.map((key) => (
            <Reveal key={key} variants={revealItem} className="rounded-lg border border-line bg-ink-850/40 p-6">
              <svg className="h-6 w-6 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
                {CAP_ICONS[key]}
              </svg>
              <h3 className="mt-5 text-lg font-semibold tracking-tight text-bone">{t(`${key}Title`)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-bone-muted">{t(`${key}Desc`)}</p>
            </Reveal>
          ))}
        </RevealGroup>
      </Section>

      {/* Featured work — only when real projects exist */}
      {featured.length > 0 ? (
        <Section width="wide" className="border-t border-line">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow={t("workEyebrow")} title={t("workTitle")} intro={t("workIntro")} className="max-w-2xl" />
            <ButtonLink href="/projects" variant="secondary">
              {common("viewAll")}
            </ButtonLink>
          </div>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((project, i) => (
              <Reveal key={project.id} delay={i * 0.06}>
                <ProjectCard project={project} viewLabel={common("viewProject")} priority={i === 0} />
              </Reveal>
            ))}
          </div>
        </Section>
      ) : null}

      {/* Process */}
      <Section width="wide" className="border-t border-line">
        <SectionHeading eyebrow={t("processEyebrow")} title={t("processTitle")} intro={t("processIntro")} />
        <ol className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS_STEPS.map((step, i) => (
            <Reveal as="li" key={step} delay={i * 0.06} className="relative rounded-lg border border-line bg-ink-850/40 p-6">
              <span className="font-mono text-2xs tracking-widest text-accent">0{i + 1}</span>
              <h3 className="mt-4 text-base font-semibold tracking-tight text-bone">{process(`${step}Title`)}</h3>
              <p className="mt-2 text-sm leading-relaxed text-bone-muted">{process(`${step}Desc`)}</p>
            </Reveal>
          ))}
        </ol>
      </Section>

      {/* Team preview — only when real members exist */}
      {team.length > 0 ? (
        <Section width="wide" className="border-t border-line">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow={t("teamEyebrow")} title={t("teamTitle")} intro={t("teamIntro")} className="max-w-2xl" />
            <ButtonLink href="/team" variant="secondary">
              {common("viewAll")}
            </ButtonLink>
          </div>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member, i) => (
              <Reveal key={member.id} delay={i * 0.06} className="min-w-0">
                <TeamCard member={member} socialLabel={(name) => a11y("socialLabel", { name })} />
              </Reveal>
            ))}
          </div>
        </Section>
      ) : null}

      {/* Services preview — only when real services exist */}
      {services.length > 0 ? (
        <Section width="wide" className="border-t border-line">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow={t("servicesEyebrow")} title={t("servicesTitle")} className="max-w-2xl" />
            <ButtonLink href="/services" variant="secondary">
              {common("viewAll")}
            </ButtonLink>
          </div>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.slice(0, 6).map((service, i) => (
              <Reveal key={service.id} delay={i * 0.05}>
                <ServiceCard service={service} learnMoreLabel={common("learnMore")} />
              </Reveal>
            ))}
          </div>
        </Section>
      ) : null}

      {/* Technology system — the real stack */}
      <Section width="wide" className="border-t border-line">
        <SectionHeading eyebrow={t("techEyebrow")} title={t("techTitle")} intro={t("techIntro")} />
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {TECH_GROUPS.map((group) => (
            <div key={group.labelKey}>
              <h3 className="eyebrow">{t(group.labelKey)}</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.items.map((tech) => (
                  <li key={tech}>
                    <Tag>{tech}</Tag>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* Testimonials — verified/approved only */}
      {testimonials.length > 0 ? (
        <Section width="wide" className="border-t border-line">
          <SectionHeading eyebrow={t("testimonialsEyebrow")} title={t("testimonialsTitle")} />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((item, i) => (
              <Reveal key={item.id} delay={i * 0.06}>
                <TestimonialCard testimonial={item} />
              </Reveal>
            ))}
          </div>
        </Section>
      ) : null}

      {/* Recent articles — only when published posts exist */}
      {posts.length > 0 ? (
        <Section width="wide" className="border-t border-line">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading eyebrow={t("articlesEyebrow")} title={t("articlesTitle")} intro={t("articlesIntro")} className="max-w-2xl" />
            <ButtonLink href="/blog" variant="secondary">
              {common("viewAll")}
            </ButtonLink>
          </div>
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <Reveal key={post.id} delay={i * 0.06}>
                <ArticleCard post={post} locale={locale} readingTimeLabel={post.readingTime ? `${post.readingTime} min` : undefined} />
              </Reveal>
            ))}
          </div>
        </Section>
      ) : null}

      {/* High-conversion contact CTA */}
      <Section width="content" className="border-t border-line">
        <Container width="content" className="relative overflow-hidden rounded-xl border border-line bg-ink-850/60 px-6 py-16 text-center md:px-16 md:py-20">
          <div className="atelier-grid pointer-events-none absolute inset-0 opacity-50" aria-hidden />
          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-bone md:text-5xl">
              {t("ctaTitle")}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-bone-muted">{t("ctaSubtitle")}</p>
            <div className="mt-8 flex justify-center">
              <ButtonLink href="/contact" size="lg">
                {t("ctaButton")}
              </ButtonLink>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
