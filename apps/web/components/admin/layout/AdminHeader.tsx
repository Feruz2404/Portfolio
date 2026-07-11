import Link from "next/link";
import type { Route } from "next";

export default function AdminHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-white/10 bg-surface-00/80 backdrop-blur">
      <div className="flex items-center justify-between px-6 py-4">
        <div><div className="text-sm font-semibold text-white/85">Feruz<span className="text-cyan-100">.</span> Studio</div><div className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-white/30">Content control room</div></div>
        <div className="flex items-center gap-3">
          <Link href={"/" as Route} className="text-sm text-white/70 hover:text-white">
            View site
          </Link>
        </div>
      </div>
    </header>
  );
}
