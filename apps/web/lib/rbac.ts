import { Role } from "@prisma/client";

export type Permission =
  | "*"
  | "analytics:read"
  | "blog:write"
  | "contacts:write"
  | "media:write"
  | "projects:read"
  | "projects:write"
  | "services:write"
  | "team:write"
  | "testimonials:write"
  | "users:write";

export const PERMISSIONS = {
  ADMIN: ["*"],
  EDITOR: ["projects:write", "blog:write", "team:write", "media:write", "services:write", "testimonials:write"],
  MANAGER: ["contacts:write", "analytics:read", "projects:read"],
  VIEWER: ["projects:read", "analytics:read"]
} satisfies Record<Role, readonly Permission[]>;

export function hasPermission(role: Role, permission: Permission) {
  const perms: readonly Permission[] = PERMISSIONS[role] ?? [];
  return perms.includes("*") || perms.includes(permission);
}
