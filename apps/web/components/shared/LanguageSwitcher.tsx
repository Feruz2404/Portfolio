"use client";

import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useTransition } from "react";
import { usePathname, useRouter } from "@/lib/i18n/navigation";
import { locales, type Locale } from "@/lib/i18n/config";
import { cn } from "@/components/ui/utils";

const LABELS: Record<Locale, string> = { uz: "UZ", en: "EN", ru: "RU" };
const NAMES: Record<Locale, string> = { uz: "O'zbekcha", en: "English", ru: "Русский" };

/**
 * Clear three-option locale selector. Keeps the current path (including dynamic
 * segments) and just swaps the locale prefix. Rendered as an accessible radio-
 * style group so screen readers announce the current language.
 */
export default function LanguageSwitcher({ className }: { className?: string }) {
  const active = useLocale() as Locale;
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const t = useTranslations("a11y");
  const [isPending, startTransition] = useTransition();

  const switchTo = (next: Locale) => {
    if (next === active) return;
    startTransition(() => {
      // Preserve dynamic route params (e.g. /projects/[slug]) across the switch.
      router.replace(
        // @ts-expect-error -- next-intl accepts the current pathname + params
        { pathname, params },
        { locale: next },
      );
    });
  };

  return (
    <div
      role="group"
      aria-label={t("languageLabel")}
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full border border-line p-0.5",
        isPending && "opacity-60",
        className,
      )}
    >
      {locales.map((loc) => {
        const isActive = loc === active;
        return (
          <button
            key={loc}
            type="button"
            onClick={() => switchTo(loc)}
            aria-current={isActive ? "true" : undefined}
            aria-label={NAMES[loc]}
            title={NAMES[loc]}
            className={cn(
              "rounded-full px-2.5 py-1 text-2xs font-medium tracking-wider transition-colors duration-fast",
              isActive
                ? "bg-accent/15 text-accent"
                : "text-bone-faint hover:text-bone",
            )}
          >
            {LABELS[loc]}
          </button>
        );
      })}
    </div>
  );
}
