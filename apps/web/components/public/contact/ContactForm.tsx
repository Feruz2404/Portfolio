"use client";

import { useState } from "react";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="rounded-xl border border-white/10 bg-surface-01 p-6 space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        setError(null);
        setOk(false);
        setLoading(true);

        try {
          const fd = new FormData(e.currentTarget);
          const payload = Object.fromEntries(fd.entries());
          const res = await fetch("/api/contacts", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(payload)
          });

          if (!res.ok) {
            setError(res.status === 429 ? "Too many requests. Please try again later." : "Failed to send");
            return;
          }

          setOk(true);
          (e.currentTarget as HTMLFormElement).reset();
        } catch {
          setError("Network error. Please try again.");
        } finally {
          setLoading(false);
        }
      }}
    >
      <Field label="Name" name="name">
        <input id="name" name="name" required className="w-full rounded-md border border-white/10 bg-surface-00 px-3 py-2 text-sm" />
      </Field>
      <Field label="Email" name="email">
        <input id="email" name="email" type="email" required className="w-full rounded-md border border-white/10 bg-surface-00 px-3 py-2 text-sm" />
      </Field>
      <Field label="Company" name="company">
        <input id="company" name="company" className="w-full rounded-md border border-white/10 bg-surface-00 px-3 py-2 text-sm" />
      </Field>
      <Field label="Phone" name="phone">
        <input id="phone" name="phone" className="w-full rounded-md border border-white/10 bg-surface-00 px-3 py-2 text-sm" />
      </Field>
      <Field label="Message" name="message">
        <textarea id="message" name="message" required rows={5} className="w-full rounded-md border border-white/10 bg-surface-00 px-3 py-2 text-sm" />
      </Field>

      {error ? <p aria-live="polite" className="text-sm text-red-400">{error}</p> : null}
      {ok ? <p aria-live="polite" className="text-sm text-green-400">Sent</p> : null}

      <button disabled={loading} className="rounded-md bg-brand-violet px-4 py-2 text-sm font-semibold disabled:opacity-60">
        {loading ? "Sending..." : "Send"}
      </button>
    </form>
  );
}

function Field({ label, name, children }: { label: string; name: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="text-sm text-white/70">{label}</label>
      {children}
    </div>
  );
}
