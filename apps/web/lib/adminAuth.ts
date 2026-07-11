import { NextResponse } from "next/server";
import { redirect } from "next/navigation";
import type { Session } from "next-auth";
import type { Role } from "@prisma/client";
import { auth } from "@/lib/server-auth";
import { hasPermission } from "@/lib/rbac";
import { prisma } from "@/lib/db";

type Authorized = {
  authorized: true;
  session: Session;
  role: Role;
};

type Unauthorized = {
  authorized: false;
  response: NextResponse;
};

export type AuthorizationResult = Authorized | Unauthorized;

export async function authorize(permission?: string): Promise<AuthorizationResult> {
  const session = await auth();
  if (!session?.user) {
    return {
      authorized: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    };
  }

  let role = (session.user as { role?: Role }).role;
  if (permission && session.user.id) {
    const currentUser = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } });
    if (!currentUser) {
      return {
        authorized: false,
        response: NextResponse.json({ error: "Forbidden" }, { status: 403 })
      };
    }
    role = currentUser.role;
  }

  if (!role || (permission && !hasPermission(role, permission))) {
    return {
      authorized: false,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 })
    };
  }

  return { authorized: true, session, role };
}

export async function requireAdmin(permission?: string) {
  const result = await authorize(permission);
  if (!result.authorized) throw new Response(result.response.status === 401 ? "Unauthorized" : "Forbidden", { status: result.response.status });
  return result;
}

export async function requireAdminPage(permission?: string) {
  const result = await authorize(permission);
  if (!result.authorized) redirect(result.response.status === 401 ? "/admin/login" : "/admin/unauthorized");
  return result;
}
