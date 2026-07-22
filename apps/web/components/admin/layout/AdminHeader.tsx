"use client";

import type { Route } from "next";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { ExternalLink, LogOut, Menu } from "lucide-react";

export default function AdminHeader({
  email,
  onMenu,
}: {
  email?: string | null;
  onMenu: () => void;
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#020208]/88 backdrop-blur">
      <div className="flex min-h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenu}
            className="grid h-9 w-9 place-items-center border border-white/10 text-white/72 transition-colors hover:text-white lg:hidden"
            aria-label="Open admin menu"
          >
            <Menu className="h-4 w-4" aria-hidden />
          </button>
          <div className="min-w-0">
            <div className="text-xs uppercase tracking-[0.2em] text-white/42">Portfolio admin</div>
            <div className="truncate text-sm text-white/72">{email ?? "Authenticated session"}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={"/" as Route}
            className="grid h-9 w-9 place-items-center border border-white/10 text-white/62 transition-colors hover:border-white/24 hover:text-white"
            aria-label="View public site"
          >
            <ExternalLink className="h-4 w-4" aria-hidden />
          </Link>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="grid h-9 w-9 place-items-center border border-white/10 text-white/62 transition-colors hover:border-red-300/40 hover:text-red-200"
            aria-label="Sign out"
          >
            <LogOut className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </div>
    </header>
  );
}
