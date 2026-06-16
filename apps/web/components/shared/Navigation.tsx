"use client";

import type { Route } from "next";
import NextLink from "next/link";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/lib/i18n/navigation";

export default function Navigation() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  const links: Array<{ href: string; label: string }> = [
    { href: "/about", label: t("about") },
    { href: "/projects", label: t("projects") },
    { href: "/team", label: t("team") },
    { href: "/services", label: t("services") },
    { href: "/blog", label: t("blog") },
    { href: "/contact", label: t("contact") }
  ];

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-surface-00/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          dev<span className="text-brand-pink">.</span>
        </Link>
        <nav className="hidden items-center gap-6 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={
                "text-xs font-medium uppercase tracking-wider " +
                (pathname?.startsWith(l.href) ? "text-white" : "text-white/60 hover:text-white")
              }
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <NextLink href={"/admin/dashboard" as Route} className="text-xs text-white/60 hover:text-white">
          Admin
        </NextLink>
      </div>
    </header>
  );
}
