import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/lib/i18n/config";
import { buildMetadata } from "@/lib/seo";
import { Section, Eyebrow } from "@/components/ui/layout";
import { SocialLinks, type SocialLink } from "@/components/public/SocialLinks";
import { getContactSettings } from "@/lib/settings";
import ContactForm from "@/components/public/contact/ContactForm";

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return buildMetadata({ locale, path: "/contact", title: t("title"), description: t("intro") });
}

export default async function ContactPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");
  const a11y = await getTranslations("a11y");
  const contact = await getContactSettings();

  const socials = [
    contact.github && { type: "github" as const, href: contact.github },
    contact.linkedin && { type: "linkedin" as const, href: contact.linkedin },
    contact.telegram && { type: "telegram" as const, href: contact.telegram },
  ].filter(Boolean) as SocialLink[];

  const hasDirect = Boolean(contact.email || contact.phone || socials.length || contact.location);

  return (
    <Section width="wide" className="pt-16 md:pt-24">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <div>
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <h1 className="mt-5 text-5xl font-semibold leading-[1.02] tracking-tight text-bone md:text-6xl">{t("title")}</h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-bone-muted">{t("intro")}</p>
          <p className="mt-4 text-sm text-bone-faint">{t("responseTime")}</p>

          {hasDirect ? (
            <div className="mt-10 border-t border-line pt-8">
              <h2 className="eyebrow">{t("directTitle")}</h2>
              <div className="mt-5 flex flex-col gap-3 text-sm">
                {contact.email ? (
                  <a href={`mailto:${contact.email}`} className="text-bone transition-colors hover:text-accent">
                    {contact.email}
                  </a>
                ) : null}
                {contact.phone ? (
                  <a href={`tel:${contact.phone}`} className="text-bone transition-colors hover:text-accent">
                    {contact.phone}
                  </a>
                ) : null}
                {contact.location ? <p className="text-bone-muted">{contact.location}</p> : null}
              </div>
              {socials.length ? (
                <SocialLinks links={socials} labelFor={(name) => a11y("socialLabel", { name })} className="mt-5 flex gap-2" />
              ) : null}
            </div>
          ) : null}
        </div>

        <ContactForm />
      </div>
    </Section>
  );
}
