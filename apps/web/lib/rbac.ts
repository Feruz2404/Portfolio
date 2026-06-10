import type { Role } from "@prisma/client";

export const PERMISSIONS: Record<Role, string[]> = {
  ADMIN: ["*"],
  EDITOR: ["projects:write", "blog:write", "team:write", "media:write", "services:write", "testimonials:write", "caseStudies:write"],
  MANAGER: ["contacts:write", "analytics:read", "projects:read"],
  VIEWER: ["projects:read", "analytics:read"],
};

export function hasPermission(role: Role, permission: string) {
  const p = PERMISSIONS[role] ?? [];
  return p.includes("*") || p.includes(permission);
}
