"use client";

import NextLink from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/lib/i18n/navigation";
import { useState } from "react";

export default function Navigation() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const links: Array<{ href: string; label: string }> = [
    { href: "/about", label: t("about") },
    { href: "/projects", label: t("projects") },
    { href: "/services", label: t("services") },
    { href: "/blog", label: t("blog") },
    { href: "/contact", label: t("contact") }
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-surface-00/75 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-10 lg:px-12">
        <Link href="/" className="group flex items-center gap-3 text-sm font-semibold tracking-tight">
          <span className="grid h-8 w-8 place-items-center rounded-full border border-cyan-200/40 bg-cyan-100/10 font-mono text-[10px] text-cyan-100 transition group-hover:rotate-12">FZ</span>
          <span className="hidden text-white/80 sm:inline">Feruz<span className="text-cyan-100">.</span></span>
        </Link>
        <nav className="hidden items-center gap-7 md:flex">
          {links.map((link) => <Link key={link.href} href={link.href} className={`text-[11px] font-semibold uppercase tracking-[0.18em] transition ${pathname?.startsWith(link.href) ? "text-cyan-100" : "text-white/45 hover:text-white"}`}>{link.label}</Link>)}
        </nav>
        <div className="flex items-center gap-3">
          <Link href={pathname ?? "/"} locale={locale === "uz" ? "en" : "uz"} className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-white/40 transition hover:text-white sm:inline">{locale === "uz" ? "EN" : "UZ"}</Link>
          <NextLink href="/admin/dashboard" className="hidden rounded-full border border-white/10 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/50 transition hover:border-white/30 hover:text-white md:inline-flex">Admin</NextLink>
          <button type="button" className="rounded-full border border-white/15 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/70 md:hidden" aria-expanded={open} aria-controls="mobile-navigation" aria-label="Toggle navigation" onClick={() => setOpen((value) => !value)}>{open ? "Close" : "Menu"}</button>
        </div>
      </div>
      {open ? <nav id="mobile-navigation" className="border-t border-white/10 bg-surface-00 px-6 py-4 md:hidden"><div className="mx-auto flex max-w-7xl flex-col gap-1 sm:px-4">{links.map((link) => <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="rounded-xl px-3 py-3 text-sm text-white/65 transition hover:bg-white/5 hover:text-white">{link.label}</Link>)}<NextLink href="/admin/dashboard" className="mt-2 rounded-xl border-t border-white/10 px-3 py-4 text-xs uppercase tracking-[0.16em] text-white/40">Admin panel ↗</NextLink></div></nav> : null}
    </header>
  );
}
