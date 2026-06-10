import { Role } from "@prisma/client";

export const PERMISSIONS: Record<Role, string[]> = {
  ADMIN: ["*"],
  EDITOR: ["projects:write", "blog:write", "team:write", "media:write"],
  MANAGER: ["contacts:write", "analytics:read", "projects:read"],
  VIEWER: ["projects:read", "analytics:read"]
};

export function hasPermission(role: Role, permission: string) {
  const perms = PERMISSIONS[role] ?? [];
  return perms.includes("*") || perms.includes(permission);
}
