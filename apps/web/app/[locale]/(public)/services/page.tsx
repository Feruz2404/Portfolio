import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/lib/i18n/config";
import { buildMetadata } from "@/lib/seo";
import { Section, Container, Eyebrow } from "@/components/ui/layout";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { getActiveServices } from "@/lib/content";

export const revalidate = 600;

export async function generateMetadata({ params }: { params: Promise<{ locale: Locale }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "services" });
  return buildMetadata({ locale, path: "/services", title: t("title"), description: t("intro") });
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("services");
  const services = await getActiveServices(locale);

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
        {services.length === 0 ? (
          <p className="rounded-lg border border-line bg-ink-850/40 p-10 text-center text-bone-muted">{t("empty")}</p>
        ) : (
          <div className="flex flex-col gap-4">
            {services.map((service, i) => {
              const price = service.priceFrom
                ? new Intl.NumberFormat(locale, { style: "currency", currency: service.currency || "USD", maximumFractionDigits: 0 }).format(service.priceFrom)
                : null;
              return (
                <Reveal key={service.id} delay={i * 0.04}>
                  <article className="grid gap-6 rounded-lg border border-line bg-ink-850/50 p-7 md:grid-cols-[1fr_1.3fr] md:p-9">
                    <div>
                      <div className="flex items-center gap-3">
                        <span aria-hidden className="flex h-10 w-10 items-center justify-center rounded-md border border-line bg-ink-800 text-lg">
                          {service.icon ?? "◆"}
                        </span>
                        <h2 className="text-2xl font-semibold tracking-tight text-bone">{service.title}</h2>
                      </div>
                      <p className="mt-4 leading-relaxed text-bone-muted">{service.description}</p>
                      <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
                        {price ? (
                          <span className="text-bone">
                            <span className="text-bone-faint">{t("startingFrom")} </span>
                            {price}
                          </span>
                        ) : null}
                        {service.duration ? <span className="text-bone-muted">· {service.duration}</span> : null}
                      </div>
                    </div>
                    {service.features?.length ? (
                      <div>
                        <h3 className="eyebrow">{t("deliverables")}</h3>
                        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                          {service.features.map((feature) => (
                            <li key={feature} className="flex items-start gap-2 text-sm text-bone-muted">
                              <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </article>
                </Reveal>
              );
            })}
          </div>
        )}
      </Section>

      <Section width="content" className="border-t border-line">
        <Container className="rounded-xl border border-line bg-ink-850/60 px-6 py-16 text-center md:px-16">
          <h2 className="mx-auto max-w-2xl text-3xl font-semibold tracking-tight text-bone md:text-4xl">{t("ctaTitle")}</h2>
          <p className="mx-auto mt-4 max-w-xl text-bone-muted">{t("ctaBody")}</p>
          <div className="mt-8 flex justify-center">
            <ButtonLink href="/contact" size="lg">{t("cta")}</ButtonLink>
          </div>
        </Container>
      </Section>
    </>
  );
}
