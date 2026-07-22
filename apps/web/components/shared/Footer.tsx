export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#020208] px-6 py-10">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-white/46 md:flex-row md:items-center md:justify-between">
        <div className="font-black uppercase tracking-[0.2em] text-white">
          dev<span className="text-teal-200">.</span>
        </div>
        <div>&copy; {new Date().getFullYear()} Portfolio. Built for serious digital products.</div>
      </div>
    </footer>
  );
}
