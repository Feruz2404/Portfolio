import Link from "next/link";

export default function AdminHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-white/10 bg-surface-00/80 backdrop-blur">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="text-sm text-white/70">Portfolio</div>
        <div className="flex items-center gap-3">
          <Link href="/" className="text-sm text-white/70 hover:text-white">
            View site
          </Link>
        </div>
      </div>
    </header>
  );
}
