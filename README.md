# Enterprise Portfolio Platform

Next.js + React + TypeScript + Tailwind + Prisma + PostgreSQL + NextAuth + UploadThing + Resend.

## Local setup

```powershell
npm ci
Copy-Item apps/web/.env.example apps/web/.env
docker compose up -d db
npm --workspace apps/web run prisma:migrate
npm run seed
npm run dev
```

Open `http://localhost:3000`. The seeded admin credentials come from `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` in `apps/web/.env`. The bundled database uses port `5433` to avoid colliding with another PostgreSQL service on `5432`.

If PostgreSQL is hosted externally, replace `DATABASE_URL` with the provider connection string instead of starting Docker.

## Quality checks

```powershell
npm run typecheck
npm run lint
npm run build
npm audit
```
