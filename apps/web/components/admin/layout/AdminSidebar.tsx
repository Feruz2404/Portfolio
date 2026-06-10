import Link from "next/link";

const links = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/team", label: "Team" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/case-studies", label: "Case Studies" },
  { href: "/admin/contacts", label: "Contacts" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/media", label: "Media" },
  { href: "/admin/users", label: "Users" },
];

export function AdminSidebar() {
  return (
    <aside className="border-r border-border/60 bg-background/50 px-4 py-6">
      <div className="mb-6 font-[var(--font-syne)] text-lg font-extrabold">Admin</div>
      <nav className="grid gap-1">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground">
            {l.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
