import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/lib/i18n/config";
import { buildMetadata } from "@/lib/seo";
import { Section, Eyebrow } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/Reveal";
import { TeamCard } from "@/components/public/TeamCard";
import { getTeamMembers } from "@/lib/content";

export const revalidate = 600;

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "team" });
  return buildMetadata({ locale, path: "/team", title: t("title"), description: t("intro") });
}

export default async function TeamPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("team");
  const a11y = await getTranslations("a11y");
  const team = await getTeamMembers(locale);

  return (
    <>
      <Section width="wide" className="pt-16 md:pt-24">
        <Reveal className="max-w-3xl">
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <h1 className="mt-5 text-5xl font-semibold leading-[1.02] tracking-tight text-bone md:text-7xl">{t("title")}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-bone-muted">{t("intro")}</p>
        </Reveal>
      </Section>

      <Section width="wide" className="border-t border-line pt-12">
        {team.length === 0 ? (
          <p className="rounded-lg border border-line bg-ink-850/40 p-10 text-center text-bone-muted">{t("empty")}</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member, i) => (
              <Reveal key={member.id} delay={i * 0.05} className="min-w-0">
                <TeamCard member={member} socialLabel={(name) => a11y("socialLabel", { name })} />
              </Reveal>
            ))}
          </div>
        )}
      </Section>
    </>
  );
}
