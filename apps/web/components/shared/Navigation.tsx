"use client";

import { Menu, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { Link, usePathname } from "@/lib/i18n/navigation";
import { locales, type Locale } from "@/lib/i18n/config";

export default function Navigation() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const locale = useLocale() as Locale;
  const [open, setOpen] = useState(false);

  const links: Array<{ href: string; label: string }> = [
    { href: "/about", label: t("about") },
    { href: "/projects", label: t("projects") },
    { href: "/team", label: t("team") },
    { href: "/services", label: t("services") },
    { href: "/blog", label: t("blog") },
    { href: "/contact", label: t("contact") },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-white/10 bg-[#020208]/78 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-10 lg:px-12">
        <Link href="/" className="text-sm font-black uppercase tracking-[0.2em] text-white">
          dev<span className="text-teal-200">.</span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex" aria-label="Primary navigation">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={[
                "text-[0.68rem] font-semibold uppercase tracking-[0.18em] transition-colors",
                pathname?.startsWith(link.href) ? "text-white" : "text-white/52 hover:text-white",
              ].join(" ")}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-1 md:flex" aria-label="Language selector">
          {locales.map((item) => (
            <Link
              key={item}
              href={pathname || "/"}
              locale={item}
              className={[
                "border px-2 py-1 font-mono text-[0.68rem] uppercase transition-colors",
                item === locale ? "border-teal-200/40 text-teal-100" : "border-transparent text-white/40 hover:text-white",
              ].join(" ")}
            >
              {item}
            </Link>
          ))}
        </div>

        <button
          type="button"
          className="grid h-10 w-10 place-items-center border border-white/10 text-white md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-4 w-4" aria-hidden /> : <Menu className="h-4 w-4" aria-hidden />}
        </button>
      </div>

      {open ? (
        <nav className="border-t border-white/10 bg-[#020208] px-6 py-5 md:hidden" onClick={() => setOpen(false)} aria-label="Mobile navigation">
          <div className="flex flex-col gap-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={pathname?.startsWith(link.href) ? "text-white" : "text-white/62"}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="mt-6 flex gap-2 border-t border-white/10 pt-5">
            {locales.map((item) => (
              <Link
                key={item}
                href={pathname || "/"}
                locale={item}
                className={[
                  "border px-3 py-1.5 font-mono text-xs uppercase",
                  item === locale ? "border-teal-200/40 text-teal-100" : "border-white/10 text-white/46",
                ].join(" ")}
              >
                {item}
              </Link>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
