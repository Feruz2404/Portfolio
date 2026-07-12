# Feruz — Digital Product Atelier

A premium, cinematic, trilingual (uz / en / ru) 3D portfolio for **Feruz**, built
as a content-driven platform with a full admin CMS.

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS ·
Prisma / PostgreSQL · NextAuth v5 · next-intl v4 · React Three Fiber / Three.js ·
Framer Motion · Lenis · UploadThing · Resend.

Monorepo layout: the app lives in **`apps/web`**.

---

## Quick start

```bash
# 1. Install (from the repo root)
npm install

# 2. Configure environment
cp apps/web/.env.example apps/web/.env      # then edit values
#    At minimum set DATABASE_URL and NEXTAUTH_SECRET (>= 32 chars).

# 3. Database
npm run prisma:generate
npm run prisma:migrate            # applies prisma/migrations
npm run seed                      # admin user only (production-safe)
# For local sample content:  SEED_DEMO=true npm run seed

# 4. Develop
npm run dev                       # http://localhost:3000  (redirects to /uz)
```

### Useful scripts (run from repo root)
| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | `prisma generate` + production build |
| `npm run start` | Production server (after build) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm run prisma:migrate` | Apply migrations (dev) |
| `npm run prisma:studio` | Prisma Studio |
| `npm run seed` | Seed admin (+ demo with `SEED_DEMO=true`) |

---

## Architecture notes

### Routing & layouts
- `app/[locale]/…` is the **public site** (its `layout.tsx` is a root layout that
  renders `<html lang={locale}>` for correct per-locale language + SEO).
- `app/admin/…` is a **separate, non-localized root** (`layout.tsx` renders its own
  `<html>`). The authenticated panel lives in `app/admin/(panel)/…`; the login page
  sits directly under `app/admin/` so it is never caught by the auth gate.
- Middleware (`middleware.ts`) handles locale routing (`localePrefix: "always"`,
  default `uz`), so `/` → `/uz`.
- Pages use route-level ISR (`export const revalidate = …`) — there is **no global
  `force-dynamic`**. Admin is dynamic (reads the session).

### Localization
- UI strings: `lib/i18n/{uz,en,ru}.json` (keys are identical across locales).
- CMS content: base columns hold the **default-locale (uz)** value; a `translations`
  JSON column holds `{ en, ru }` overrides. `lib/content.ts` merges the requested
  locale over the base with fallback. See `CONTENT_REQUIRED.md`.

### 3D hero
- Public interface: `components/3d/Hero3D.tsx`. It renders a premium **static poster
  first** (SSR, so the hero text/LCP is never blocked), then upgrades to the live
  scene only when capability checks pass (`webgl.ts`: WebGL support, not
  reduced-motion, not save-data, enough memory/cores). Coarse pointers get a
  simplified scene.
- The scene (`AtelierScene.tsx`) is lazy-loaded (client-only), pauses when offscreen
  or the tab is hidden, uses adaptive DPR, and is wrapped in a real error boundary
  (`SceneErrorBoundary.tsx`) that falls back to the poster.
- **Swapping in a Spline export:** `Hero3D` is the seam. Replace the dynamic import
  of `AtelierScene` with a Spline runtime component (`@splinetool/react-spline` or
  the community runtime) rendering an **authorized production `.splinecode` export**,
  keeping the `{ quality, active }` contract. Self-host the exported asset and keep
  its URL configurable. Never iframe an `app.spline.design` editor/community URL.

### Content resilience
- With no `DATABASE_URL` or an unreachable DB, read helpers return empty results
  (polished empty states) instead of throwing. Writes (e.g. contact leads) never
  fake success — they report real failures.

### Admin / security
- Every admin API route is gated by `getAdminApiContext(permission)` and every
  admin page by `requireAdminPage(permission)` (role-based, `lib/rbac.ts`).
- Admin is **not** linked from the public site. `robots.ts` disallows `/admin` and
  `/api`. Rich blog HTML is sanitized (`lib/sanitize.ts`). The contact endpoint is
  rate-limited and has a honeypot. Secrets stay server-only.

### SEO
- Per-page, per-locale `generateMetadata` via `lib/seo.ts` (canonical + hreflang for
  uz/en/ru + x-default), locale-aware `sitemap.ts`, `robots.ts`, and JSON-LD
  (Organization, WebSite, CreativeWork/Project, Person, Article).

---

## Deployment (Vercel)
1. Set env vars from `.env.example` in the Vercel project (production `DATABASE_URL`,
   `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `NEXT_PUBLIC_SITE_URL`, optionally Resend /
   UploadThing).
2. Run migrations against the production database (`prisma migrate deploy`).
3. Seed the admin user (`npm run seed` — **not** `SEED_DEMO`).
4. Add real content via `/admin` (see `CONTENT_REQUIRED.md`) — nothing is published
   until you do.

---

## Before launch
See **`CONTENT_REQUIRED.md`** for the exact real content (team, projects, services,
testimonials, contact details, legal text, share image, CV) that must be supplied.
No fictional people, metrics, or clients are shipped.
