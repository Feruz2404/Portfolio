"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { Link, usePathname } from "@/lib/i18n/navigation";
import { cn } from "@/components/ui/utils";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";

const NAV = [
  { href: "/", key: "home" },
  { href: "/about", key: "about" },
  { href: "/projects", key: "projects" },
  { href: "/team", key: "team" },
  { href: "/services", key: "services" },
  { href: "/blog", key: "blog" },
  { href: "/contact", key: "contact" },
] as const;

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Navigation() {
  const t = useTranslations("nav");
  const a11y = useTranslations("a11y");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Close the mobile menu on route change.
  useEffect(() => setOpen(false), [pathname]);

  // Subtle header treatment once scrolled past the hero fold.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Mobile menu: lock scroll, focus first item, trap Tab, close on Escape.
  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const toggleEl = toggleRef.current;
    document.body.style.overflow = "hidden";
    const panel = panelRef.current;
    const focusables = panel?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
    focusables?.[0]?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key === "Tab" && focusables && focusables.length > 0) {
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
      (previouslyFocused ?? toggleEl)?.focus?.();
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-header transition-colors duration-300",
        scrolled || open
          ? "border-b border-line bg-ink-950/85 backdrop-blur-md"
          : "border-b border-transparent",
      )}
    >
      <nav aria-label={a11y("primaryNav")} className="container-wide flex h-16 items-center justify-between md:h-18">
        {/* Brand */}
        <Link
          href="/"
          className="font-display text-lg font-semibold tracking-tight text-bone"
          aria-label="Feruz — home"
        >
          Feruz<span className="text-accent">.</span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) => {
            const activeLink = isActivePath(pathname, item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={activeLink ? "page" : undefined}
                  className={cn(
                    "relative text-sm tracking-tight transition-colors duration-fast",
                    activeLink ? "text-bone" : "text-bone-muted hover:text-bone",
                  )}
                >
                  {t(item.key)}
                  {activeLink ? (
                    <span aria-hidden className="absolute -bottom-1.5 left-0 h-px w-full bg-accent" />
                  ) : null}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-3">
          <LanguageSwitcher className="hidden sm:inline-flex" />

          {/* Mobile toggle */}
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? a11y("closeMenu") : a11y("openMenu")}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-full border border-line lg:hidden"
          >
            <span className={cn("block h-px w-5 bg-bone transition-all duration-200", open && "translate-y-[6px] rotate-45")} />
            <span className={cn("block h-px w-5 bg-bone transition-all duration-200", open && "opacity-0")} />
            <span className={cn("block h-px w-5 bg-bone transition-all duration-200", open && "-translate-y-[6px] -rotate-45")} />
          </button>
        </div>
      </nav>

      {/* Full-screen mobile menu */}
      {open ? (
        <div
          ref={panelRef}
          id="mobile-menu"
          className="fixed inset-x-0 top-16 z-header h-[calc(100dvh-4rem)] overflow-y-auto border-t border-line bg-ink-950 lg:hidden"
        >
          <ul className="container-wide flex flex-col gap-1 py-6">
            {NAV.map((item) => {
              const activeLink = isActivePath(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={activeLink ? "page" : undefined}
                    className={cn(
                      "flex items-center justify-between border-b border-line/60 py-4 font-display text-2xl tracking-tight",
                      activeLink ? "text-accent" : "text-bone",
                    )}
                  >
                    {t(item.key)}
                    <span aria-hidden className="text-bone-faint">→</span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="container-wide pb-10">
            <LanguageSwitcher />
          </div>
        </div>
      ) : null}
    </header>
  );
}
