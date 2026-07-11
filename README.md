# Feruz Portfolio

An expressive portfolio platform with a Next.js web experience, an interactive Three.js hero, and a standalone NestJS + TypeORM API for portfolio projects.

## Architecture

- `apps/web` — Next.js 15, Tailwind, next-intl, NextAuth, public portfolio and admin UI.
- `apps/api` — NestJS API with TypeORM, PostgreSQL, public project reads, and token-protected project mutations.
- PostgreSQL — use a hosted/external PostgreSQL connection; Docker is not required.

The API maps the existing `Project` table and keeps `githubUrl`, `vercelUrl`, `liveUrl`, `videoUrl`, screenshots, case-study copy, and featured state editable from the admin panel. The web app falls back to its existing Prisma access when `PORTFOLIO_API_URL` is not configured, which keeps local development resilient while the API is deployed separately.

## Local setup

```powershell
npm ci
Copy-Item apps/web/.env.example apps/web/.env
Copy-Item apps/api/.env.example apps/api/.env
```

Set the same PostgreSQL connection in both env files, then use two terminals:

```powershell
npm run dev:api
npm run dev
```

The web app runs at `http://localhost:3000`; the API health endpoint is `http://localhost:4000/health` and project API endpoints are under `http://localhost:4000/api/v1/projects`.

For an existing database, keep `synchronize: false` and run the reviewed TypeORM migration before starting the API:

```powershell
npm run migration:api
```

Do not enable TypeORM synchronization in production.

## Quality checks

```powershell
npm run typecheck
npm run typecheck:api
npm run lint
npm run build:api
npm run build
```
