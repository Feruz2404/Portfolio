import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/lib/i18n/config";
import { buildMetadata } from "@/lib/seo";
import { Section, SectionHeading, Container, Eyebrow } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { TECH_GROUPS } from "@/lib/site";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return buildMetadata({ locale, path: "/about", title: t("title"), description: t("lead") });
}

const PRINCIPLES = ["principle1", "principle2", "principle3", "principle4"] as const;

export default async function AboutPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const common = await getTranslations("common");
  const hero = await getTranslations("hero");

  return (
    <>
      <Section width="wide" className="pt-16 md:pt-24">
        <Reveal className="max-w-3xl">
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <h1 className="mt-5 text-5xl font-semibold leading-[1.02] tracking-tight text-bone md:text-7xl">
            {t("title")}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-bone-muted">{t("lead")}</p>
        </Reveal>
      </Section>

      {/* Mission */}
      <Section width="wide" className="border-t border-line">
        <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
          <Eyebrow>{t("missionTitle")}</Eyebrow>
          <Reveal>
            <p className="text-2xl font-medium leading-snug tracking-tight text-bone md:text-3xl">{t("missionBody")}</p>
          </Reveal>
        </div>
      </Section>

      {/* Principles */}
      <Section width="wide" className="border-t border-line">
        <SectionHeading eyebrow={t("eyebrow")} title={t("principlesTitle")} as="h2" />
        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {PRINCIPLES.map((p, i) => (
            <Reveal key={p} delay={i * 0.05} className="rounded-lg border border-line bg-ink-850/40 p-7">
              <span className="font-mono text-2xs tracking-widest text-accent">0{i + 1}</span>
              <h3 className="mt-4 text-xl font-semibold tracking-tight text-bone">{t(`${p}Title`)}</h3>
              <p className="mt-2 leading-relaxed text-bone-muted">{t(`${p}Body`)}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Focus + approach */}
      <Section width="wide" className="border-t border-line">
        <div className="grid gap-6 md:grid-cols-2">
          <Reveal className="rounded-lg border border-line bg-ink-850/40 p-8">
            <h2 className="text-2xl font-semibold tracking-tight text-bone">{t("focusTitle")}</h2>
            <p className="mt-4 leading-relaxed text-bone-muted">{t("focusBody")}</p>
          </Reveal>
          <Reveal delay={0.06} className="rounded-lg border border-line bg-ink-850/40 p-8">
            <h2 className="text-2xl font-semibold tracking-tight text-bone">{t("approachTitle")}</h2>
            <p className="mt-4 leading-relaxed text-bone-muted">{t("approachBody")}</p>
          </Reveal>
        </div>
      </Section>

      {/* Technology ecosystem */}
      <Section width="wide" className="border-t border-line">
        <SectionHeading eyebrow={t("eyebrow")} title={t("ecosystemTitle")} as="h2" />
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {TECH_GROUPS.map((group) => (
            <div key={group.labelKey}>
              <h3 className="eyebrow">{group.labelKey.replace("tech", "")}</h3>
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

      {/* CTA */}
      <Section width="content" className="border-t border-line">
        <Container className="rounded-xl border border-line bg-ink-850/60 px-6 py-16 text-center md:px-16">
          <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-bone md:text-4xl">{t("ctaTitle")}</h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/projects" size="lg">{hero("viewProjects")}</ButtonLink>
            <ButtonLink href="/contact" size="lg" variant="secondary">{common("getInTouch")}</ButtonLink>
          </div>
        </Container>
      </Section>
    </>
  );
}
