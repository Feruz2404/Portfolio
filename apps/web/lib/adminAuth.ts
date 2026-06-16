import { auth } from "@/lib/server-auth";
import { hasPermission } from "@/lib/rbac";
import type { Role } from "@prisma/client";

export async function requireAdmin(permission: string) {
  const session = await auth();
  if (!session?.user) throw new Response("Unauthorized", { status: 401 });
  const role = (session.user as any).role as Role;
  if (!hasPermission(role, permission)) throw new Response("Forbidden", { status: 403 });
  return { session, role };
}
