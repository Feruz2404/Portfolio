# Content required before launch

The site's systems (team, projects, services, blog, testimonials, contact,
localization, SEO) are fully built and data-driven. **No real people, projects,
metrics, clients or testimonials have been invented or published.** Everything
below must be supplied as *verified* content — entered through `/admin` — before
this portfolio goes live.

Until real content is added, the affected sections **hide themselves gracefully**
(the homepage simply omits empty sections; list pages show a polished empty
state). For local development you can load clearly-labelled sample data with
`SEED_DEMO=true npm run seed`.

> Locale model: base fields hold the **default locale (uz)** content; the
> `translations` JSON column holds `{ "en": {…}, "ru": {…} }` overrides. Provide
> all three languages for anything public. Machine translations must be reviewed
> before they are treated as verified.

---

## 1. Team members (REQUIRED — no fictional people)
For **each real person** on the team:
- Full name
- Position / title — **uz, en, ru**
- Department / specialty — uz, en, ru
- Professional photo (square, ≥ 400×400) + descriptive alt text
- Short bio (1–2 sentences) — uz, en, ru
- Full bio — uz, en, ru
- Skills / primary technologies
- **Verified** years of experience (leave blank if not applicable)
- Certifications (real, if any)
- Links: GitHub / LinkedIn / Telegram / portfolio (only the ones that exist)
- Which projects they worked on **and their exact role** on each
- Achievements (title, description, date) — if any
- Display order + active/draft state

## 2. Projects / case studies (REQUIRED — replace all samples)
For **each real project**:
- Title + short outcome — uz, en, ru
- Category, industry (industry/client only if you may disclose it)
- Overview / description, challenge, architecture, solution, results — uz, en, ru
- Real technology stack
- Hero image + gallery images (with alt text) or a video poster
- Live URL / source URL — only if you're allowed to link them
- **Real** metrics/outcomes only (no invented numbers)
- Team members + their role on the project
- Featured flag for the ones to show on the homepage
- Optional richer case study (process, metrics, timeline) via the CaseStudy record

## 3. Services (REQUIRED)
Per service — uz, en, ru: title, outcome-oriented description, deliverables,
optional real price range / typical timeline, display order, active flag.

## 4. Testimonials (only verified quotes)
Real name, position, company, quote, and (optionally) linked project. Set
`approved = true` only for quotes you have permission to publish. Unapproved
testimonials never render.

## 5. Blog posts (optional)
Title, excerpt, cover image, body (HTML — sanitized on render), author, publish
date — uz, en, ru. The homepage "recent articles" block appears **only** when at
least one post is published.

## 6. Contact settings (REQUIRED for the contact section)
Set via admin `Setting` key `contact` (JSON): real `email`, `phone`, `telegram`,
`linkedin`, `github`, `location`. Only the values you provide are shown — no
placeholder `hello@example.com` anywhere. The contact form saves leads to the
database regardless; email notifications additionally require `RESEND_API_KEY`
and a verified `FROM_EMAIL`.

## 7. Brand / identity
The visible identity is **"Feruz."**. Replace it only if there is a verified
brand name/logo. Update the brand mark in `components/shared/Navigation.tsx` and
`Footer.tsx`, and `SITE`/metadata in `lib/site.ts` + `lib/i18n/*.json → meta`.

## 8. Legal pages
`/privacy` and `/terms` currently render a review notice, not a policy. Provide
real, reviewed policy text (uz, en, ru) before launch.

## 9. Assets
- Open Graph / Twitter share image (1200×630) referenced via page metadata.
- Favicon / app icons.
- CV file — the About "Download CV" affordance is only wired up once a real file
  exists; add it and enable the link.

---

### How to load sample data locally (never in production)
```bash
SEED_DEMO=true npm run seed   # inserts obviously-labelled "Demo —" records
npm run seed                  # admin user only (production-safe default)
```
