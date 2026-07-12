import type { MetadataRoute } from "next";
import { locales, defaultLocale } from "@/lib/i18n/config";
import { absoluteUrl, localizedPath } from "@/lib/seo";
import { getProjectSlugs, getPostSlugs, getTeamSlugs } from "@/lib/content";

const STATIC_PATHS = ["/", "/about", "/projects", "/team", "/services", "/blog", "/contact", "/privacy", "/terms"];

/** One entry per path with hreflang alternates for uz / en / ru. */
function entry(path: string, lastModified = new Date()): MetadataRoute.Sitemap[number] {
  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = absoluteUrl(localizedPath(l, path));
  return {
    url: absoluteUrl(localizedPath(defaultLocale, path)),
    lastModified,
    alternates: { languages },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, posts, members] = await Promise.all([getProjectSlugs(), getPostSlugs(), getTeamSlugs()]);

  return [
    ...STATIC_PATHS.map((p) => entry(p)),
    ...projects.map((p) => entry(`/projects/${p.slug}`)),
    ...posts.map((p) => entry(`/blog/${p.slug}`)),
    ...members.map((m) => entry(`/team/${m.slug}`)),
  ];
}
