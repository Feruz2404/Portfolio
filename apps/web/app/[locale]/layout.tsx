import type { ReactNode } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { locales, type Locale } from "@/lib/i18n/config";
import { fontVariables } from "@/lib/fonts";
import Navigation from "@/components/shared/Navigation";
import Footer from "@/components/shared/Footer";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import CustomCursor from "@/components/ui/CustomCursor";
import { getSiteUrl } from "@/lib/env";
import "../globals.css";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  // Per-page string titles inherit this template (e.g. "Projects — Feruz").
  return {
    metadataBase: new URL(getSiteUrl()),
    title: { default: t("defaultTitle"), template: t("titleTemplate") },
    description: t("defaultDescription"),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();

  // Enable static rendering for this locale segment.
  setRequestLocale(locale);
  const messages = await getMessages();
  const t = await getTranslations("a11y");

  return (
    <html lang={locale} className={fontVariables} suppressHydrationWarning>
      <body className="font-body text-bone antialiased">
        <NextIntlClientProvider messages={messages}>
          <a
            href="#main"
            className="sr-only z-toast rounded-full bg-accent px-4 py-2 font-medium text-ink-950 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
          >
            {t("skipToContent")}
          </a>
          <SmoothScrollProvider>
            <CustomCursor />
            <Navigation />
            <main id="main">{children}</main>
            <Footer />
          </SmoothScrollProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
