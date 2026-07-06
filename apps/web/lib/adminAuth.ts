import { auth } from "@/lib/server-auth";
import { hasPermission, type Permission } from "@/lib/rbac";
import type { Role } from "@prisma/client";
import type { Session } from "next-auth";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export type AdminContext = {
  session: Session;
  userId: string;
  role: Role;
};

function toAdminContext(session: Session): AdminContext {
  return {
    session,
    userId: session.user.id,
    role: session.user.role
  };
}

export async function getAdminApiContext(permission: Permission) {
  const session = await auth();
  if (!session?.user) {
    return { ok: false as const, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }

  const context = toAdminContext(session);
  if (!hasPermission(context.role, permission)) {
    return { ok: false as const, response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }

  return { ok: true as const, context };
}

export async function requireAdmin(permission: Permission) {
  const result = await getAdminApiContext(permission);
  if (!result.ok) throw result.response;
  return result.context;
}

export async function requireAdminPage(permission: Permission) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const context = toAdminContext(session);
  if (!hasPermission(context.role, permission)) redirect("/admin/unauthorized");

  return context;
}
