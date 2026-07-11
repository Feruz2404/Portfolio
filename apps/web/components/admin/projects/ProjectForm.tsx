"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Project } from "@prisma/client";

export default function ProjectForm({ mode, project }: { mode: "create" | "edit"; project?: Project }) {
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
          description: String(fd.get("description") || ""),
          category: String(fd.get("category") || ""),
          industry: String(fd.get("industry") || "") || undefined,
          status: String(fd.get("status") || "DRAFT"),
          featured: fd.get("featured") === "on",
          technologies: String(fd.get("technologies") || "")
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          screenshots: [] as string[]
        };

        try {
          const res = await fetch("/api/admin/projects" + (mode === "edit" ? `/${project!.id}` : ""), {
            method: mode === "edit" ? "PUT" : "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(payload)
          });

          if (!res.ok) {
            setError("Failed to save");
            return;
          }

          router.push("/admin/projects");
          router.refresh();
        } catch {
          setError("Network error. Please try again.");
        } finally {
          setLoading(false);
        }
      }}
    >
      <Field label="Title">
        <input
          name="title"
          defaultValue={project?.title ?? ""}
          required
          className="w-full rounded-md border border-white/10 bg-surface-00 px-3 py-2 text-sm outline-none focus:border-white/20"
        />
      </Field>
      <Field label="Slug">
        <input
          name="slug"
          defaultValue={project?.slug ?? ""}
          required
          className="w-full rounded-md border border-white/10 bg-surface-00 px-3 py-2 text-sm outline-none focus:border-white/20"
        />
      </Field>
      <Field label="Category">
        <input
          name="category"
          defaultValue={project?.category ?? ""}
          required
          className="w-full rounded-md border border-white/10 bg-surface-00 px-3 py-2 text-sm outline-none focus:border-white/20"
        />
      </Field>
      <Field label="Industry">
        <input
          name="industry"
          defaultValue={project?.industry ?? ""}
          className="w-full rounded-md border border-white/10 bg-surface-00 px-3 py-2 text-sm outline-none focus:border-white/20"
        />
      </Field>
      <Field label="Technologies (comma-separated)">
        <input
          name="technologies"
          defaultValue={(project?.technologies ?? []).join(", ")}
          className="w-full rounded-md border border-white/10 bg-surface-00 px-3 py-2 text-sm outline-none focus:border-white/20"
        />
      </Field>
      <Field label="Description">
        <textarea
          name="description"
          defaultValue={project?.description ?? ""}
          rows={6}
          required
          className="w-full rounded-md border border-white/10 bg-surface-00 px-3 py-2 text-sm outline-none focus:border-white/20"
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Status">
          <select
            name="status"
            defaultValue={project?.status ?? "DRAFT"}
            className="w-full rounded-md border border-white/10 bg-surface-00 px-3 py-2 text-sm outline-none focus:border-white/20"
          >
            <option value="DRAFT">DRAFT</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="ARCHIVED">ARCHIVED</option>
          </select>
        </Field>
        <Field label="Featured">
          <label className="flex items-center gap-2 text-sm text-white/70">
            <input type="checkbox" name="featured" defaultChecked={project?.featured ?? false} />
            Featured
          </label>
        </Field>
      </div>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-brand-violet px-4 py-2 text-sm font-semibold disabled:opacity-60"
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
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
