import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/env";
import { locales, defaultLocale, type Locale } from "@/lib/i18n/config";

export function localizedPath(locale: Locale, path: string) {
  const clean = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${clean}`;
}

export function absoluteUrl(pathWithLocale: string) {
  return new URL(pathWithLocale, getSiteUrl()).toString();
}

/**
 * Build per-page, per-locale metadata with a canonical URL and hreflang
 * alternates for uz / en / ru (+ x-default).
 */
export function buildMetadata(opts: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  images?: string[];
  noindex?: boolean;
  /** Bypass the layout title template (use for the home page brand title). */
  absoluteTitle?: boolean;
}): Metadata {
  const base = getSiteUrl();
  const canonical = absoluteUrl(localizedPath(opts.locale, opts.path));
  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = absoluteUrl(localizedPath(l, opts.path));
  languages["x-default"] = absoluteUrl(localizedPath(defaultLocale, opts.path));

  // Page cover if supplied, otherwise the branded default rendered by
  // app/opengraph-image.tsx (referenced explicitly because the [locale] tree is
  // a separate root, so the file convention doesn't auto-inject here).
  const defaultOg = new URL("/opengraph-image", base).toString();
  const images = opts.images?.length ? opts.images : [defaultOg];

  return {
    metadataBase: new URL(base),
    title: opts.absoluteTitle ? { absolute: opts.title } : opts.title,
    description: opts.description,
    alternates: { canonical, languages },
    robots: opts.noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      type: "website",
      url: canonical,
      siteName: "Feruz",
      title: opts.title,
      description: opts.description,
      locale: opts.locale,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description: opts.description,
      images,
    },
  };
}
