import { Role } from "@prisma/client";

export const PERMISSIONS: Record<Role, string[]> = {
  ADMIN: ["*"],
  EDITOR: [
    "projects:read",
    "projects:write",
    "blog:read",
    "blog:write",
    "team:read",
    "team:write",
    "media:read",
    "media:write"
  ],
  MANAGER: [
    "contacts:read",
    "contacts:write",
    "analytics:read",
    "projects:read",
    "services:read",
    "testimonials:read",
    "case-studies:read",
    "email:send"
  ],
  VIEWER: [
    "projects:read",
    "blog:read",
    "team:read",
    "analytics:read",
    "services:read",
    "testimonials:read",
    "case-studies:read"
  ]
};

export function hasPermission(role: Role | undefined, permission: string) {
  const perms = role ? PERMISSIONS[role] ?? [] : [];
  return perms.includes("*") || perms.includes(permission);
}
