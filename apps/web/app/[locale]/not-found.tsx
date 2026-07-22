"use client";

import { useTranslations } from "next-intl";
import { Container } from "@/components/ui/layout";
import { ButtonLink } from "@/components/ui/Button";

export default function LocaleNotFound() {
  const t = useTranslations("notFound");

  return (
    <Container className="flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 text-5xl font-semibold tracking-tight md:text-7xl">{t("title")}</h1>
      <p className="mt-4 max-w-md text-bone-muted">{t("description")}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <ButtonLink href="/">{t("home")}</ButtonLink>
        <ButtonLink href="/projects" variant="secondary">
          {t("projects")}
        </ButtonLink>
      </div>
    </Container>
  );
}
