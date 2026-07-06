export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-surface-00 px-6 py-10">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 text-sm text-white/60">
        <div>&copy; {new Date().getFullYear()} Portfolio</div>
      </div>
    </footer>
  );
}
