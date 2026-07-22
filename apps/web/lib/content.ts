import "server-only";
import { getEnv } from "@/lib/env";
import { defaultLocale, type Locale } from "@/lib/i18n/config";

/**
 * Locale-aware content access layer.
 *
 * Two guarantees the rest of the app relies on:
 *  1. Graceful degradation — if there is no DATABASE_URL, or the database is
 *     unreachable, read helpers return empty results instead of throwing. Pages
 *     render polished empty states; the 3D hero and shell are never blocked.
 *     (This is degradation, never a fake-success — writes handle errors loudly.)
 *  2. Localization — base columns hold default-locale (uz) content; the
 *     `translations` JSON column holds `{ en?: {...}, ru?: {...} }` overrides.
 *     `localize*` merges the requested locale over the base with fallback.
 */

export function hasDatabase() {
  return Boolean(getEnv().DATABASE_URL);
}

async function db() {
  const { prisma } = await import("@/lib/db");
  return prisma;
}

let dbFailureLogged = false;

/** Run a read query, returning `fallback` if the DB is absent or unreachable. */
async function safeRead<T>(run: () => Promise<T>, fallback: T): Promise<T> {
  if (!hasDatabase()) return fallback;
  try {
    const result = await run();
    dbFailureLogged = false; // recovered — allow the next outage to log again
    return result;
  } catch (error) {
    // Log once per outage instead of on every request.
    if (!dbFailureLogged) {
      dbFailureLogged = true;
      console.error("[content] database read failed (further errors suppressed until it recovers):", error);
    }
    return fallback;
  }
}

/** Merge a per-locale translation override over base columns. */
function applyTranslation<T extends Record<string, unknown>>(
  base: T,
  translations: unknown,
  locale: Locale,
  fields: (keyof T)[],
): T {
  if (locale === defaultLocale || !translations || typeof translations !== "object") return base;
  const bag = (translations as Record<string, unknown>)[locale];
  if (!bag || typeof bag !== "object") return base;
  const override = bag as Record<string, unknown>;
  const merged = { ...base };
  for (const field of fields) {
    const value = override[field as string];
    if (value !== undefined && value !== null && value !== "") {
      (merged[field] as unknown) = value;
    }
  }
  return merged;
}

const PROJECT_TEXT_FIELDS = [
  "title",
  "description",
  "challenge",
  "solution",
  "architecture",
  "results",
  "category",
  "industry",
] as const;

const SERVICE_TEXT_FIELDS = ["title", "description", "features"] as const;
const TEAM_TEXT_FIELDS = ["position", "department", "shortBio", "bio"] as const;
const BLOG_TEXT_FIELDS = ["title", "excerpt", "content"] as const;

// ── Projects ──────────────────────────────────────────────────────────────
export async function getFeaturedProjects(locale: Locale, limit = 3) {
  const rows = await safeRead(
    async () =>
      (await db()).project.findMany({
        where: { featured: true, status: { not: "DRAFT" } },
        orderBy: { updatedAt: "desc" },
        take: limit,
      }),
    [],
  );
  return rows.map((p) => applyTranslation(p, p.translations, locale, [...PROJECT_TEXT_FIELDS]));
}

export async function getAllProjects(locale: Locale) {
  const rows = await safeRead(
    async () =>
      (await db()).project.findMany({
        where: { status: { not: "DRAFT" } },
        orderBy: [{ featured: "desc" }, { updatedAt: "desc" }],
      }),
    [],
  );
  return rows.map((p) => applyTranslation(p, p.translations, locale, [...PROJECT_TEXT_FIELDS]));
}

export async function getProjectSlugs() {
  return safeRead(
    async () =>
      (await db()).project.findMany({
        where: { status: { not: "DRAFT" } },
        select: { slug: true },
      }),
    [] as { slug: string }[],
  );
}

export async function getProjectBySlug(locale: Locale, slug: string) {
  const project = await safeRead(
    async () =>
      (await db()).project.findFirst({
        where: { slug, status: { not: "DRAFT" } },
        include: {
          teamMembers: { include: { member: true } },
          caseStudy: true,
          testimonials: { where: { approved: true } },
          seoMeta: true,
        },
      }),
    null,
  );
  if (!project) return null;
  const localized = applyTranslation(project, project.translations, locale, [...PROJECT_TEXT_FIELDS]);
  return {
    ...localized,
    teamMembers: project.teamMembers.map((tm) => ({
      ...tm,
      member: applyTranslation(tm.member, tm.member.translations, locale, [...TEAM_TEXT_FIELDS]),
    })),
  };
}

/** The next project (by update order) for the "next" link on a detail page. */
export async function getAdjacentProject(locale: Locale, currentSlug: string) {
  const rows = await safeRead(
    async () =>
      (await db()).project.findMany({
        where: { status: { not: "DRAFT" } },
        orderBy: [{ featured: "desc" }, { updatedAt: "desc" }],
        select: { slug: true, title: true, translations: true, category: true, screenshots: true },
      }),
    [] as { slug: string; title: string; translations: unknown; category: string; screenshots: string[] }[],
  );
  if (rows.length < 2) return null;
  const idx = rows.findIndex((r) => r.slug === currentSlug);
  if (idx === -1) return null;
  const next = rows[(idx + 1) % rows.length];
  return applyTranslation(next, next.translations, locale, ["title", "category"]);
}

// ── Services ──────────────────────────────────────────────────────────────
export async function getActiveServices(locale: Locale) {
  const rows = await safeRead(
    async () =>
      (await db()).service.findMany({
        where: { isActive: true },
        orderBy: [{ featured: "desc" }, { order: "asc" }],
      }),
    [],
  );
  return rows.map((s) => applyTranslation(s, s.translations, locale, [...SERVICE_TEXT_FIELDS]));
}

// ── Team ──────────────────────────────────────────────────────────────────
export async function getTeamMembers(locale: Locale, limit?: number) {
  const rows = await safeRead(
    async () =>
      (await db()).teamMember.findMany({
        where: { isActive: true },
        orderBy: { order: "asc" },
        ...(limit ? { take: limit } : {}),
      }),
    [],
  );
  return rows.map((m) => applyTranslation(m, m.translations, locale, [...TEAM_TEXT_FIELDS]));
}

export async function getTeamSlugs() {
  return safeRead(
    async () => (await db()).teamMember.findMany({ where: { isActive: true }, select: { slug: true } }),
    [] as { slug: string }[],
  );
}

export async function getTeamMemberBySlug(locale: Locale, slug: string) {
  const member = await safeRead(
    async () =>
      (await db()).teamMember.findFirst({
        where: { slug, isActive: true },
        include: {
          achievements: { orderBy: { date: "desc" } },
          projects: { include: { project: true } },
        },
      }),
    null,
  );
  if (!member) return null;
  const localized = applyTranslation(member, member.translations, locale, [...TEAM_TEXT_FIELDS]);
  return {
    ...localized,
    projects: member.projects.map((pm) => ({
      ...pm,
      project: applyTranslation(pm.project, pm.project.translations, locale, [...PROJECT_TEXT_FIELDS]),
    })),
  };
}

// ── Blog ──────────────────────────────────────────────────────────────────
export async function getPublishedPosts(locale: Locale, limit?: number) {
  const rows = await safeRead(
    async () =>
      (await db()).blogPost.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { publishedAt: "desc" },
        include: { author: { select: { name: true } }, category: true },
        ...(limit ? { take: limit } : {}),
      }),
    [],
  );
  return rows.map((p) => applyTranslation(p, p.translations, locale, [...BLOG_TEXT_FIELDS]));
}

export async function getPostSlugs() {
  return safeRead(
    async () => (await db()).blogPost.findMany({ where: { status: "PUBLISHED" }, select: { slug: true } }),
    [] as { slug: string }[],
  );
}

export async function getPostBySlug(locale: Locale, slug: string) {
  const post = await safeRead(
    async () =>
      (await db()).blogPost.findFirst({
        where: { slug, status: "PUBLISHED" },
        include: { author: { select: { name: true } }, category: true, tags: { include: { tag: true } } },
      }),
    null,
  );
  if (!post) return null;
  return applyTranslation(post, post.translations, locale, [...BLOG_TEXT_FIELDS]);
}

// ── Testimonials ──────────────────────────────────────────────────────────
export async function getApprovedTestimonials(limit = 6) {
  return safeRead(
    async () =>
      (await db()).testimonial.findMany({
        where: { approved: true },
        orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
        take: limit,
      }),
    [],
  );
}

// ── Aggregate counts (real numbers only — used instead of invented metrics) ──
export async function getContentCounts() {
  return safeRead(
    async () => {
      const prisma = await db();
      const [projects, team, services, posts] = await Promise.all([
        prisma.project.count({ where: { status: { not: "DRAFT" } } }),
        prisma.teamMember.count({ where: { isActive: true } }),
        prisma.service.count({ where: { isActive: true } }),
        prisma.blogPost.count({ where: { status: "PUBLISHED" } }),
      ]);
      return { projects, team, services, posts };
    },
    { projects: 0, team: 0, services: 0, posts: 0 },
  );
}
