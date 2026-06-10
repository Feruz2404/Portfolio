"use client";

import type { TeamMember } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TeamMemberForm({ mode, member }: { mode: "create" | "edit"; member?: TeamMember }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="space-y-4 rounded-xl border border-white/10 bg-surface-01 p-6"
      onSubmit={async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const fd = new FormData(e.currentTarget);
        const payload = {
          fullName: String(fd.get("fullName") || ""),
          slug: String(fd.get("slug") || ""),
          position: String(fd.get("position") || ""),
          bio: String(fd.get("bio") || "") || undefined,
          skills: String(fd.get("skills") || "")
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          isActive: fd.get("isActive") === "on",
          order: Number(fd.get("order") || 0)
        };

        const res = await fetch("/api/admin/team" + (mode === "edit" ? `/${member!.id}` : ""), {
          method: mode === "edit" ? "PUT" : "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (!res.ok) {
          setError("Failed to save");
          setLoading(false);
          return;
        }

        router.push("/admin/team");
        router.refresh();
      }}
    >
      <Field label="Full name">
        <input name="fullName" defaultValue={member?.fullName ?? ""} required className="w-full rounded-md border border-white/10 bg-surface-00 px-3 py-2 text-sm" />
      </Field>
      <Field label="Slug">
        <input name="slug" defaultValue={member?.slug ?? ""} required className="w-full rounded-md border border-white/10 bg-surface-00 px-3 py-2 text-sm" />
      </Field>
      <Field label="Position">
        <input name="position" defaultValue={member?.position ?? ""} required className="w-full rounded-md border border-white/10 bg-surface-00 px-3 py-2 text-sm" />
      </Field>
      <Field label="Skills (comma-separated)">
        <input name="skills" defaultValue={(member?.skills ?? []).join(", ")} className="w-full rounded-md border border-white/10 bg-surface-00 px-3 py-2 text-sm" />
      </Field>
      <Field label="Bio">
        <textarea name="bio" defaultValue={member?.bio ?? ""} rows={5} className="w-full rounded-md border border-white/10 bg-surface-00 px-3 py-2 text-sm" />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Order">
          <input name="order" type="number" defaultValue={member?.order ?? 0} className="w-full rounded-md border border-white/10 bg-surface-00 px-3 py-2 text-sm" />
        </Field>
        <Field label="Active">
          <label className="flex items-center gap-2 text-sm text-white/70">
            <input name="isActive" type="checkbox" defaultChecked={member?.isActive ?? true} /> Active
          </label>
        </Field>
      </div>
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
      <button disabled={loading} className="rounded-md bg-brand-violet px-4 py-2 text-sm font-semibold disabled:opacity-60">
        {loading ? "Saving..." : "Save"}
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
