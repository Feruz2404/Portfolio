import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";
import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { isLoginLocked, recordLoginFailure, clearLoginFailures } from "@/lib/rate-limit";

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

function isRole(value: unknown): value is Role {
  return typeof value === "string" && Object.values(Role).includes(value as Role);
}

export const authOptions: NextAuthConfig = {
  // The global `omit` (lib/db.ts) narrows the client type; the adapter never
  // needs the hash, so cast at this boundary to the adapter's expected client.
  adapter: PrismaAdapter(prisma as unknown as Parameters<typeof PrismaAdapter>[0]),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        email:    { label: "Email",    type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, request) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        // Throttle brute force by email + IP (failures only; success clears it).
        const ip =
          request?.headers?.get("x-forwarded-for")?.split(",")[0]?.trim() ??
          request?.headers?.get("x-real-ip") ??
          "unknown";
        const throttleKey = `login:${parsed.data.email.toLowerCase()}:${ip}`;
        if (isLoginLocked(throttleKey)) return null;

        // Opt back into the globally-omitted hash for credential verification.
        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
          omit: { hashedPassword: false }
        });
        if (!user?.hashedPassword) {
          recordLoginFailure(throttleKey);
          return null;
        }

        const ok = await bcrypt.compare(parsed.data.password, user.hashedPassword);
        if (!ok) {
          recordLoginFailure(throttleKey);
          return null;
        }

        clearLoginFailures(throttleKey);
        return {
          id:    user.id,
          email: user.email,
          name:  user.name,
          image: user.image,
          role:  user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        if (isRole(user.role)) token.role = user.role;
        token.uid = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (typeof token.uid === "string") session.user.id = token.uid;
      if (isRole(token.role)) session.user.role = token.role;
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
    error:  "/admin/unauthorized",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
