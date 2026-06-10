import Link from "next/link";

export function Navigation() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-[var(--font-syne)] text-lg font-extrabold">
          dev<span className="text-brand-violet">.</span>
        </Link>
        <nav className="hidden gap-6 md:flex">
          <Link className="text-sm text-muted-foreground hover:text-foreground" href="/about">About</Link>
          <Link className="text-sm text-muted-foreground hover:text-foreground" href="/projects">Projects</Link>
          <Link className="text-sm text-muted-foreground hover:text-foreground" href="/team">Team</Link>
          <Link className="text-sm text-muted-foreground hover:text-foreground" href="/blog">Blog</Link>
          <Link className="text-sm text-muted-foreground hover:text-foreground" href="/contact">Contact</Link>
        </nav>
        <Link
          href="/contact"
          className="rounded-md border border-border bg-secondary px-3 py-2 text-sm font-semibold hover:bg-secondary/80"
        >
          Aloqa →
        </Link>
      </div>
    </header>
  );
}
