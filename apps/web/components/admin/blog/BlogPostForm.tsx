"use client";

import type { BlogPost } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function BlogPostForm({ mode, post }: { mode: "create" | "edit"; post?: BlogPost }) {
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
          title: String(fd.get("title") || ""),
          slug: String(fd.get("slug") || ""),
          excerpt: String(fd.get("excerpt") || "") || null,
          content: String(fd.get("content") || ""),
          status: String(fd.get("status") || "DRAFT")
        };

        try {
          const res = await fetch("/api/admin/blog" + (mode === "edit" ? `/${post!.id}` : ""), {
            method: mode === "edit" ? "PUT" : "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(payload)
          });

          if (!res.ok) {
            setError("Failed to save");
            return;
          }

          router.push("/admin/blog");
          router.refresh();
        } catch {
          setError("Network error. Please try again.");
        } finally {
          setLoading(false);
        }
      }}
    >
      <Field label="Title">
        <input name="title" defaultValue={post?.title ?? ""} required className="w-full rounded-md border border-white/10 bg-surface-00 px-3 py-2 text-sm" />
      </Field>
      <Field label="Slug">
        <input name="slug" defaultValue={post?.slug ?? ""} required className="w-full rounded-md border border-white/10 bg-surface-00 px-3 py-2 text-sm" />
      </Field>
      <Field label="Excerpt">
        <textarea name="excerpt" defaultValue={post?.excerpt ?? ""} rows={3} className="w-full rounded-md border border-white/10 bg-surface-00 px-3 py-2 text-sm" />
      </Field>
      <Field label="Content (MDX/Text)">
        <textarea name="content" defaultValue={post?.content ?? ""} rows={12} className="w-full rounded-md border border-white/10 bg-surface-00 px-3 py-2 text-sm font-mono" />
      </Field>
      <Field label="Status">
        <select name="status" defaultValue={post?.status ?? "DRAFT"} className="w-full rounded-md border border-white/10 bg-surface-00 px-3 py-2 text-sm">
          <option value="DRAFT">DRAFT</option>
          <option value="PUBLISHED">PUBLISHED</option>
          <option value="ARCHIVED">ARCHIVED</option>
        </select>
      </Field>
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
