"use client";

import type { Route } from "next";
import NextLink from "next/link";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/lib/i18n/navigation";
import { useState } from "react";

export default function Navigation() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

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
        <div className="flex items-center gap-3">
          <NextLink href={"/admin/dashboard" as Route} className="text-xs text-white/60 hover:text-white">
            Admin
          </NextLink>
          <button
            type="button"
            className="rounded-md border border-white/10 px-2 py-1 text-xs text-white/70 md:hidden"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label="Toggle navigation"
            onClick={() => setOpen((value) => !value)}
          >
            Menu
          </button>
        </div>
      </div>
      {open ? (
        <nav id="mobile-navigation" className="border-t border-white/10 px-6 py-3 md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-2">
            {links.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-md px-2 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white">
                {l.label}
              </Link>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
