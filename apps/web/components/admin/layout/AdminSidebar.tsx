import Link from "next/link";
import { Role } from "@prisma/client";
import { hasPermission } from "@/lib/rbac";

export default function AdminSidebar({ role }: { role: Role }) {
  const links: Array<{ href: string; label: string; perm?: string }> = [
    { href: "/admin/dashboard", label: "Dashboard" },
    { href: "/admin/projects", label: "Projects", perm: "projects:write" },
    { href: "/admin/team", label: "Team", perm: "team:write" },
    { href: "/admin/blog", label: "Blog", perm: "blog:write" },
    { href: "/admin/testimonials", label: "Testimonials" },
    { href: "/admin/case-studies", label: "Case Studies" },
    { href: "/admin/services", label: "Services" },
    { href: "/admin/contacts", label: "Contacts", perm: "contacts:write" },
    { href: "/admin/media", label: "Media", perm: "media:write" },
    { href: "/admin/analytics", label: "Analytics", perm: "analytics:read" },
    { href: "/admin/users", label: "Users" }
  ];

  return (
    <aside className="sticky top-0 h-dvh border-r border-white/10 bg-surface-01 p-4">
      <div className="mb-6">
        <div className="text-sm font-semibold">Admin</div>
        <div className="text-xs text-white/50">Role: {role}</div>
      </div>
      <nav className="space-y-1">
        {links
          .filter((l) => !l.perm || hasPermission(role, l.perm))
          .map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block rounded-md px-3 py-2 text-sm text-white/80 hover:bg-white/5"
            >
              {l.label}
            </Link>
          ))}
      </nav>
    </aside>
  );
}
