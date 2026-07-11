import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient; dbWarningLogged?: boolean };
const rawDatabaseUrl = process.env.DATABASE_URL ?? "";
const isPlaceholderDatabaseUrl = /@HOST(?::\d+)?[/?]/i.test(rawDatabaseUrl);
const placeholderPort = rawDatabaseUrl.match(/@HOST:(\d+)/i)?.[1] ?? "5432";
const developmentDatabasePort = process.env.DEV_DATABASE_PORT ?? placeholderPort;
export const databaseUrl = process.env.NODE_ENV === "development" && isPlaceholderDatabaseUrl
  ? rawDatabaseUrl.replace(/@HOST(?::\d+)?/i, `@localhost:${developmentDatabasePort}`)
  : rawDatabaseUrl;
export const databaseIsConfigured = Boolean(databaseUrl && !/@HOST(?::\d+)?[/?]/i.test(databaseUrl));

if (process.env.NODE_ENV === "development" && (!rawDatabaseUrl || isPlaceholderDatabaseUrl) && !globalForPrisma.dbWarningLogged) {
  console.warn("[db] DATABASE_URL is missing or points to HOST; development will try localhost, production requires a real host.");
  globalForPrisma.dbWarningLogged = true;
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: databaseUrl ? { db: { url: databaseUrl } } : undefined,
    log: ["error", "warn"]
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
