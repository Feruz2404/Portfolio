"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType } from "react";
import {
  BarChart3,
  BriefcaseBusiness,
  FileText,
  FolderKanban,
  ImageIcon,
  LayoutDashboard,
  Mail,
  MessageSquareQuote,
  Settings,
  Shield,
  UserRoundCog,
  UsersRound,
} from "lucide-react";

export type AdminRole = "ADMIN" | "EDITOR" | "MANAGER" | "VIEWER";

type AdminLink = {
  href: Route;
  label: string;
  roles: AdminRole[];
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
};

const links: AdminLink[] = [
  { href: "/admin/dashboard" as Route, label: "Dashboard", roles: ["ADMIN", "MANAGER", "VIEWER"], icon: LayoutDashboard },
  { href: "/admin/projects" as Route, label: "Projects", roles: ["ADMIN", "EDITOR"], icon: FolderKanban },
  { href: "/admin/team" as Route, label: "Team", roles: ["ADMIN", "EDITOR"], icon: UsersRound },
  { href: "/admin/blog" as Route, label: "Blog", roles: ["ADMIN", "EDITOR"], icon: FileText },
  { href: "/admin/testimonials" as Route, label: "Testimonials", roles: ["ADMIN", "EDITOR"], icon: MessageSquareQuote },
  { href: "/admin/case-studies" as Route, label: "Case studies", roles: ["ADMIN", "EDITOR"], icon: BriefcaseBusiness },
  { href: "/admin/services" as Route, label: "Services", roles: ["ADMIN", "EDITOR"], icon: Settings },
  { href: "/admin/contacts" as Route, label: "Contacts", roles: ["ADMIN", "MANAGER"], icon: Mail },
  { href: "/admin/media" as Route, label: "Media", roles: ["ADMIN", "EDITOR"], icon: ImageIcon },
  { href: "/admin/analytics" as Route, label: "Analytics", roles: ["ADMIN", "MANAGER", "VIEWER"], icon: BarChart3 },
  { href: "/admin/users" as Route, label: "Users", roles: ["ADMIN"], icon: UserRoundCog },
];

export default function AdminSidebar({
  role,
  open,
  onClose,
}: {
  role?: AdminRole;
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const visibleLinks = role ? links.filter((link) => link.roles.includes(role)) : links;

  return (
    <aside
      className={[
        "fixed inset-y-0 left-0 z-40 w-[280px] border-r border-white/10 bg-[#05050d] p-4 transition-transform lg:sticky lg:top-0 lg:z-0 lg:h-dvh lg:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full",
      ].join(" ")}
    >
      <div className="flex h-full flex-col">
        <div className="border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center border border-teal-200/30 bg-teal-200/10">
              <Shield className="h-4 w-4 text-teal-200" aria-hidden />
            </span>
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.18em]">Control</div>
              <div className="mt-1 text-xs text-white/46">{role ? `Role: ${role}` : "Checking access"}</div>
            </div>
          </div>
        </div>

        <nav className="mt-5 space-y-1">
          {visibleLinks.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href || pathname?.startsWith(`${link.href}/`);

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={[
                  "flex items-center gap-3 border border-transparent px-3 py-2.5 text-sm transition-colors",
                  active ? "border-white/10 bg-white/[0.08] text-white" : "text-white/62 hover:bg-white/[0.04] hover:text-white",
                ].join(" ")}
              >
                <Icon className="h-4 w-4" aria-hidden />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-white/10 pt-4 text-xs leading-5 text-white/38">
          Server-side guards remain active on every admin route and API endpoint.
        </div>
      </div>
    </aside>
  );
}
