import Link from "next/link";
import type { Route } from "next";
import { Role } from "@prisma/client";
import { hasPermission } from "@/lib/rbac";

export default function AdminSidebar({ role }: { role: Role }) {
  const links: Array<{ href: Route; label: string; perm?: string }> = [
    { href: "/admin/dashboard" as Route, label: "Dashboard", perm: "analytics:read" },
    { href: "/admin/projects" as Route, label: "Projects", perm: "projects:read" },
    { href: "/admin/team" as Route, label: "Team", perm: "team:read" },
    { href: "/admin/blog" as Route, label: "Blog", perm: "blog:read" },
    { href: "/admin/testimonials" as Route, label: "Testimonials", perm: "testimonials:read" },
    { href: "/admin/case-studies" as Route, label: "Case Studies", perm: "case-studies:read" },
    { href: "/admin/services" as Route, label: "Services", perm: "services:read" },
    { href: "/admin/contacts" as Route, label: "Contacts", perm: "contacts:read" },
    { href: "/admin/media" as Route, label: "Media", perm: "media:read" },
    { href: "/admin/analytics" as Route, label: "Analytics", perm: "analytics:read" },
    { href: "/admin/users" as Route, label: "Users", perm: "users:read" }
  ];

  return (
    <aside className="border-b border-white/10 bg-surface-01 p-4 lg:sticky lg:top-0 lg:h-dvh lg:border-b-0 lg:border-r">
      <div className="mb-4 lg:mb-6">
        <div className="text-sm font-semibold">Admin</div>
        <div className="text-xs text-white/50">Role: {role}</div>
      </div>
      <nav className="flex gap-1 overflow-x-auto pb-1 lg:block lg:space-y-1 lg:overflow-visible lg:pb-0">
        {links
          .filter((l) => !l.perm || hasPermission(role, l.perm))
          .map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block shrink-0 rounded-md px-3 py-2 text-sm text-white/80 hover:bg-white/5"
            >
              {l.label}
            </Link>
          ))}
      </nav>
    </aside>
  );
}
