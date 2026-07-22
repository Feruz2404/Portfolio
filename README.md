# Enterprise Portfolio Platform

Premium portfolio and admin platform built with Next.js 15, React 19, TypeScript, Tailwind, Prisma/PostgreSQL, NextAuth v5, UploadThing, and Resend.

## Local Setup

```bash
npm install
cp apps/web/.env.example apps/web/.env
npm --workspace apps/web run prisma:generate
npm run seed
npm run dev
```

The local seed creates the first admin from `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD`. If those are not set in development, the seed falls back to:

- Email: `admin@example.com`
- Password: `ChangeMe123!`

Do not rely on development fallback credentials in production.

## Required Environment Variables

Set these in Vercel for production:

- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`
- `NEXT_PUBLIC_SITE_URL`
- `SEED_ADMIN_EMAIL`
- `SEED_ADMIN_PASSWORD`
- `UPLOADTHING_SECRET`
- `UPLOADTHING_APP_ID`

Optional, only required when email sending is enabled:

- `RESEND_API_KEY`
- `FROM_EMAIL`

`NEXTAUTH_SECRET` must be at least 32 random characters. Production seed credentials are required explicitly and are never silently defaulted.

## Verification

```bash
npm install
npm run typecheck
npm run lint
npm run build
npm run seed
```

`npm run seed` requires a reachable PostgreSQL database through `DATABASE_URL`.
