import LogoutButton from "./LogoutButton";

export default function AdminHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-line bg-ink-950/80 backdrop-blur">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="text-sm font-medium text-bone">Feruz — Admin</div>
        <div className="flex items-center gap-3">
          {/* Cross-boundary link to the public site (redirects to default locale). */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/" className="text-sm text-bone-muted transition-colors hover:text-bone">
            View site ↗
          </a>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
