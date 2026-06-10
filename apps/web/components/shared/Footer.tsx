export function Footer() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <div>© {new Date().getFullYear()} Your Name. All rights reserved.</div>
        <div>Designed & built with care.</div>
      </div>
    </footer>
  );
}
