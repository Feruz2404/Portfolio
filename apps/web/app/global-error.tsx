"use client";

import { fontVariables } from "@/lib/fonts";
import "./globals.css";

/** Self-contained root error boundary (renders its own html/body). */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en" className={fontVariables}>
      <body className="flex min-h-dvh flex-col items-center justify-center bg-ink-950 font-body text-bone">
        <p className="eyebrow text-danger">Error</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">Something went wrong</h1>
        <p className="mt-3 max-w-sm text-center text-bone-muted">
          An unexpected error occurred. Please try again.
        </p>
        <button
          onClick={reset}
          className="mt-8 rounded-full bg-accent px-6 py-3 text-sm font-medium text-ink-950 hover:bg-accent-soft"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
