import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url().optional(),
  NEXTAUTH_SECRET: z.string().min(32).optional(),
  NEXTAUTH_URL: z.string().url().optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  RESEND_API_KEY: z.string().min(1).optional(),
  FROM_EMAIL: z.string().email().optional(),
  UPLOADTHING_SECRET: z.string().min(1).optional(),
  UPLOADTHING_APP_ID: z.string().min(1).optional(),
  SEED_ADMIN_EMAIL: z.string().email().optional(),
  SEED_ADMIN_PASSWORD: z.string().min(12).optional(),
  ALLOWED_DEV_ORIGINS: z.string().optional(),
  NODE_ENV: z.enum(["development", "test", "production"]).optional(),
  VERCEL_ENV: z.enum(["development", "preview", "production"]).optional(),
  ENFORCE_PRODUCTION_ENV: z.string().optional()
});

export type ServerEnv = z.infer<typeof envSchema>;
export type EnvKey = keyof ServerEnv;

let parsedEnv: ServerEnv | null = null;

export function getEnv() {
  if (!parsedEnv) {
    const parsed = envSchema.safeParse(process.env);
    if (!parsed.success) {
      const issues = parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`);
      throw new Error(`Invalid environment configuration: ${issues.join("; ")}`);
    }
    parsedEnv = parsed.data;
  }

  return parsedEnv;
}

export function requireEnv(key: EnvKey) {
  const value = getEnv()[key];
  if (!value) throw new Error(`${key} is required. Add it to your local .env or Vercel environment variables.`);
  return value;
}

export function isProduction() {
  const env = getEnv();
  return env.VERCEL_ENV === "production" || env.ENFORCE_PRODUCTION_ENV === "true";
}

export function requireProductionEnv(keys: EnvKey[]) {
  if (!isProduction()) return;

  const missing = keys.filter((key) => !getEnv()[key]);
  if (missing.length) {
    throw new Error(`Missing required production environment variables: ${missing.join(", ")}`);
  }
}

export function getAuthSecret() {
  if (isProduction()) return requireEnv("NEXTAUTH_SECRET");
  return getEnv().NEXTAUTH_SECRET ?? "development-only-nextauth-secret-change-me";
}

export function getSeedAdminCredentials() {
  const env = getEnv();

  if (isProduction()) {
    return {
      email: requireEnv("SEED_ADMIN_EMAIL"),
      password: requireEnv("SEED_ADMIN_PASSWORD"),
    };
  }

  return {
    email: env.SEED_ADMIN_EMAIL ?? "admin@feruz.dev",
    password: env.SEED_ADMIN_PASSWORD ?? "ChangeMe123!",
  };
}

export function getSiteUrl() {
  return getEnv().NEXT_PUBLIC_SITE_URL ?? getEnv().NEXTAUTH_URL ?? "http://localhost:3000";
}
