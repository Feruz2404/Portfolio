import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/lib/i18n/config";
import { buildMetadata } from "@/lib/seo";
import { Section, Eyebrow } from "@/components/ui/layout";

export const revalidate = 86400;

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal" });
  return buildMetadata({ locale, path: "/privacy", title: t("privacyTitle"), description: t("privacyTitle") });
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal");
  return (
    <Section width="content" className="pt-16 md:pt-24">
      <div className="max-w-prose">
        <Eyebrow>{t("privacyTitle")}</Eyebrow>
        <h1 className="mt-5 text-4xl font-semibold tracking-tight text-bone md:text-5xl">{t("privacyTitle")}</h1>
        <p className="mt-8 rounded-lg border border-warning/30 bg-warning/5 p-5 text-sm leading-relaxed text-bone-muted">
          {t("draftNotice")}
        </p>
      </div>
    </Section>
  );
}
