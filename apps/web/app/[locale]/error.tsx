"use client";

export default function LocaleError({ reset }: { reset: () => void }) {
  return (
    <main className="min-h-dvh px-6 py-16">
      <div className="mx-auto max-w-2xl rounded-xl border border-red-400/20 bg-red-400/5 p-6">
        <h1 className="text-xl font-semibold">Temporarily unavailable</h1>
        <p className="mt-2 text-sm text-white/70">The content service is currently unavailable. Please try again shortly.</p>
        <button type="button" onClick={reset} className="mt-5 rounded-md bg-brand-violet px-4 py-2 text-sm font-semibold">
          Try again
        </button>
      </div>
    </main>
  );
}
