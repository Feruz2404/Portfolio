"use client";

import type { Route } from "next";
import NextLink from "next/link";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Link, usePathname } from "@/lib/i18n/navigation";

export default function Navigation() {
  const t        = useTranslations("nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links: Array<{ href: string; label: string }> = [
    { href: "/about",    label: t("about")    },
    { href: "/projects", label: t("projects") },
    { href: "/team",     label: t("team")     },
    { href: "/services", label: t("services") },
    { href: "/blog",     label: t("blog")     },
    { href: "/contact",  label: t("contact")  },
  ];

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-surface-00/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="text-sm font-semibold tracking-tight">
          dev<span className="text-brand-pink">.</span>
        </Link>

        {/* Desktop nav */}
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
          {/* Admin link – desktop only */}
          <NextLink
            href={"/admin/dashboard" as Route}
            className="hidden text-xs text-white/60 hover:text-white md:block"
          >
            Admin
          </NextLink>

          {/* FIX: mobile hamburger button */}
          <button
            className="flex flex-col items-center justify-center gap-[5px] p-1 md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <span
              className={`block h-0.5 w-5 bg-white/70 transition-all duration-200 ${
                open ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-white/70 transition-all duration-200 ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-5 bg-white/70 transition-all duration-200 ${
                open ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {open && (
        <nav
          className="border-t border-white/10 bg-surface-00 px-6 pb-6 md:hidden"
          onClick={() => setOpen(false)}
        >
          <div className="flex flex-col gap-4 pt-5">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={
                  "text-sm font-medium " +
                  (pathname?.startsWith(l.href) ? "text-white" : "text-white/60")
                }
              >
                {l.label}
              </Link>
            ))}
            <NextLink
              href={"/admin/dashboard" as Route}
              className="border-t border-white/10 pt-4 text-sm text-white/40"
            >
              Admin
            </NextLink>
          </div>
        </nav>
      )}
    </header>
  );
}
