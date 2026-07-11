import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-surface-00 px-6 py-10 sm:px-10 lg:px-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 text-sm text-white/45 sm:flex-row sm:items-center sm:justify-between">
        <div><span className="font-semibold text-white/80">Feruz<span className="text-cyan-100">.</span></span> <span className="ml-2">© {new Date().getFullYear()}</span></div>
        <div className="flex items-center gap-5"><Link href="/projects" className="transition hover:text-white">Work</Link><Link href="/contact" className="transition hover:text-white">Contact</Link><span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/25">Built with curiosity</span></div>
      </div>
    </footer>
  );
}
