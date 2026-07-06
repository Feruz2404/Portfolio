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
  ALLOWED_DEV_ORIGINS: z.string().optional(),
  NODE_ENV: z.enum(["development", "test", "production"]).optional()
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
  if (!value) throw new Error(`${key} is required`);
  return value;
}

export function getSiteUrl() {
  return getEnv().NEXT_PUBLIC_SITE_URL ?? getEnv().NEXTAUTH_URL ?? "http://localhost:3000";
}
