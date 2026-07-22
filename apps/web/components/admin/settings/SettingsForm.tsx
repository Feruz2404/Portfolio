"use client";

import { useEffect, useState } from "react";

type ContactFields = {
  email: string;
  phone: string;
  telegram: string;
  linkedin: string;
  github: string;
  location: string;
};

const EMPTY: ContactFields = { email: "", phone: "", telegram: "", linkedin: "", github: "", location: "" };

const FIELDS: { key: keyof ContactFields; label: string; type: string; placeholder: string }[] = [
  { key: "email", label: "Contact email", type: "email", placeholder: "hello@yourdomain.com" },
  { key: "phone", label: "Phone", type: "tel", placeholder: "+998 …" },
  { key: "telegram", label: "Telegram URL", type: "url", placeholder: "https://t.me/…" },
  { key: "linkedin", label: "LinkedIn URL", type: "url", placeholder: "https://linkedin.com/company/…" },
  { key: "github", label: "GitHub URL", type: "url", placeholder: "https://github.com/…" },
  { key: "location", label: "Location", type: "text", placeholder: "City, Country" },
];

export default function SettingsForm() {
  const [form, setForm] = useState<ContactFields>(EMPTY);
  const [status, setStatus] = useState<"idle" | "loading" | "saving" | "saved" | "error">("loading");

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => (r.ok ? r.json() : { contact: {} }))
      .then((d) => {
        const c = (d.contact ?? {}) as Partial<ContactFields>;
        setForm({ ...EMPTY, ...Object.fromEntries(Object.entries(c).map(([k, v]) => [k, v ?? ""])) } as ContactFields);
        setStatus("idle");
      })
      .catch(() => setStatus("error"));
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("saving");
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(form),
    });
    setStatus(res.ok ? "saved" : "error");
  };

  const inputClass =
    "w-full rounded-md border border-line bg-ink-900 px-3 py-2 text-sm text-bone placeholder:text-bone-faint focus:border-accent focus:outline-none";

  return (
    <form onSubmit={save} className="max-w-xl space-y-5 rounded-lg border border-line bg-ink-850/50 p-6">
      <p className="text-sm text-bone-muted">
        Public contact details. Only filled fields appear on the site (footer &amp; contact page). Leave blank to hide.
      </p>
      {FIELDS.map((f) => (
        <div key={f.key} className="flex flex-col gap-1.5">
          <label htmlFor={`set-${f.key}`} className="text-sm text-bone-muted">{f.label}</label>
          <input
            id={`set-${f.key}`}
            type={f.type}
            value={form[f.key]}
            placeholder={f.placeholder}
            onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))}
            className={inputClass}
          />
        </div>
      ))}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={status === "saving" || status === "loading"}
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-ink-950 hover:bg-accent-soft disabled:opacity-60"
        >
          {status === "saving" ? "Saving…" : "Save settings"}
        </button>
        {status === "saved" ? <span role="status" className="text-sm text-success">Saved ✓</span> : null}
        {status === "error" ? <span role="alert" className="text-sm text-danger">Save failed</span> : null}
      </div>
    </form>
  );
}
