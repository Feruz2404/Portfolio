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

        const fd = new FormData(e.currentTarget);
        const payload = Object.fromEntries(fd.entries());

        const res = await fetch("/api/contacts", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          setError("Failed to send");
          setLoading(false);
          return;
        }

        setOk(true);
        setLoading(false);
        (e.currentTarget as HTMLFormElement).reset();
      }}
    >
      <Field label="Name">
        <input name="name" required className="w-full rounded-md border border-white/10 bg-surface-00 px-3 py-2 text-sm" />
      </Field>
      <Field label="Email">
        <input name="email" type="email" required className="w-full rounded-md border border-white/10 bg-surface-00 px-3 py-2 text-sm" />
      </Field>
      <Field label="Company">
        <input name="company" className="w-full rounded-md border border-white/10 bg-surface-00 px-3 py-2 text-sm" />
      </Field>
      <Field label="Phone">
        <input name="phone" className="w-full rounded-md border border-white/10 bg-surface-00 px-3 py-2 text-sm" />
      </Field>
      <Field label="Message">
        <textarea name="message" required rows={5} className="w-full rounded-md border border-white/10 bg-surface-00 px-3 py-2 text-sm" />
      </Field>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      {ok ? <p className="text-sm text-green-400">Sent</p> : null}

      <button disabled={loading} className="rounded-md bg-brand-violet px-4 py-2 text-sm font-semibold disabled:opacity-60">
        {loading ? "Sending..." : "Send"}
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <div className="text-sm text-white/70">{label}</div>
      {children}
    </div>
  );
}
