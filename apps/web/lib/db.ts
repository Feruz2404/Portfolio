import { PrismaClient } from "@prisma/client";

function createPrismaClient() {
  return new PrismaClient({
    // Never return the bcrypt hash by default. The one place that needs it
    // (credential auth) opts back in with `omit: { hashedPassword: false }`.
    omit: { user: { hashedPassword: true } },
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"]
  });
}

type AppPrismaClient = ReturnType<typeof createPrismaClient>;

const globalForPrisma = globalThis as unknown as { prisma?: AppPrismaClient };

export function getPrisma(): AppPrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }

  return globalForPrisma.prisma;
}

export const prisma = new Proxy({} as AppPrismaClient, {
  get(_target, prop, receiver) {
    const value = Reflect.get(getPrisma(), prop, receiver);
    return typeof value === "function" ? value.bind(getPrisma()) : value;
  }
});
