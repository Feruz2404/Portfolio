"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Project } from "@prisma/client";

export default function ProjectForm({ mode, project }: { mode: "create" | "edit"; project?: Project }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <form className="space-y-6" onSubmit={async (event) => {
      event.preventDefault();
      setError(null);
      setLoading(true);
      const form = new FormData(event.currentTarget);
      const text = (name: string) => String(form.get(name) || "").trim();
      const payload = {
        title: text("title"),
        slug: text("slug"),
        description: text("description"),
        category: text("category"),
        industry: text("industry") || undefined,
        status: text("status") || "DRAFT",
        featured: form.get("featured") === "on",
        technologies: text("technologies").split(",").map((item) => item.trim()).filter(Boolean),
        screenshots: text("screenshots").split(/\r?\n/).map((item) => item.trim()).filter(Boolean),
        liveUrl: text("liveUrl") || undefined,
        vercelUrl: text("vercelUrl") || undefined,
        githubUrl: text("githubUrl") || undefined,
        videoUrl: text("videoUrl") || undefined,
        challenge: text("challenge") || undefined,
        solution: text("solution") || undefined,
        architecture: text("architecture") || undefined,
        results: text("results") || undefined
      };

      try {
        const response = await fetch(`/api/admin/projects${mode === "edit" ? `/${project!.id}` : ""}`, {
          method: mode === "edit" ? "PUT" : "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (!response.ok) {
          const body = await response.json().catch(() => null);
          setError(body?.error ?? "Unable to save the project.");
          return;
        }
        router.push("/admin/projects");
        router.refresh();
      } catch {
        setError("Network error. Please try again.");
      } finally {
        setLoading(false);
      }
    }}>
      <section className="rounded-2xl border border-white/10 bg-surface-01 p-6">
        <SectionTitle eyebrow="01 / Story" title="Make the work legible" />
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <Field label="Title"><input name="title" defaultValue={project?.title ?? ""} required className={inputClass} /></Field>
          <Field label="Slug"><input name="slug" defaultValue={project?.slug ?? ""} required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" className={inputClass} /></Field>
          <Field label="Category"><input name="category" defaultValue={project?.category ?? ""} required className={inputClass} /></Field>
          <Field label="Industry"><input name="industry" defaultValue={project?.industry ?? ""} className={inputClass} /></Field>
        </div>
        <div className="mt-5"><Field label="Short description"><textarea name="description" defaultValue={project?.description ?? ""} rows={5} required className={inputClass} /></Field></div>
        <div className="mt-5 grid gap-5 sm:grid-cols-2"><Field label="Challenge"><textarea name="challenge" defaultValue={project?.challenge ?? ""} rows={5} className={inputClass} /></Field><Field label="Solution"><textarea name="solution" defaultValue={project?.solution ?? ""} rows={5} className={inputClass} /></Field><Field label="Architecture"><textarea name="architecture" defaultValue={project?.architecture ?? ""} rows={5} className={inputClass} /><p className="text-[11px] text-white/35">Describe the system, not just the tools.</p></Field><Field label="Results"><textarea name="results" defaultValue={project?.results ?? ""} rows={5} className={inputClass} /></Field></div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-surface-01 p-6">
        <SectionTitle eyebrow="02 / Links" title="Give every project a next step" />
        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <Field label="Vercel deployment URL"><input name="vercelUrl" type="url" defaultValue={project?.vercelUrl ?? ""} placeholder="https://your-project.vercel.app" className={inputClass} /></Field>
          <Field label="Live / demo URL"><input name="liveUrl" type="url" defaultValue={project?.liveUrl ?? ""} placeholder="https://your-project.com" className={inputClass} /></Field>
          <Field label="GitHub repository"><input name="githubUrl" type="url" defaultValue={project?.githubUrl ?? ""} placeholder="https://github.com/you/project" className={inputClass} /></Field>
          <Field label="Demo video URL"><input name="videoUrl" type="url" defaultValue={project?.videoUrl ?? ""} placeholder="https://..." className={inputClass} /></Field>
          <Field label="Technologies"><input name="technologies" defaultValue={(project?.technologies ?? []).join(", ")} placeholder="Next.js, TypeScript, PostgreSQL" className={inputClass} /></Field>
        </div>
        <div className="mt-5"><Field label="Screenshots (one URL per line)"><textarea name="screenshots" defaultValue={(project?.screenshots ?? []).join("\n")} rows={5} placeholder="https://.../hero.png" className={inputClass} /></Field></div>
      </section>

      <section className="flex flex-col gap-5 rounded-2xl border border-white/10 bg-surface-01 p-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="grid gap-5 sm:grid-cols-2"><Field label="Publishing status"><select name="status" defaultValue={project?.status ?? "DRAFT"} className={inputClass}><option value="DRAFT">Draft</option><option value="IN_PROGRESS">In progress</option><option value="COMPLETED">Completed</option><option value="ARCHIVED">Archived</option></select></Field><Field label="Visibility"><label className="flex h-11 items-center gap-3 rounded-xl border border-white/10 bg-surface-00 px-3 text-sm text-white/70"><input type="checkbox" name="featured" defaultChecked={project?.featured ?? false} className="accent-cyan-200" />Show as featured</label></Field></div>
        <button type="submit" disabled={loading} className="rounded-full bg-cyan-100 px-6 py-3 text-sm font-bold text-surface-00 transition hover:bg-white disabled:cursor-wait disabled:opacity-60">{loading ? "Saving…" : mode === "edit" ? "Save changes" : "Create project"}</button>
      </section>
      {error ? <p className="rounded-xl border border-red-300/20 bg-red-300/10 px-4 py-3 text-sm text-red-100">{error}</p> : null}
    </form>
  );
}

const inputClass = "w-full rounded-xl border border-white/10 bg-surface-00 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-cyan-200/60";

function Field({ label, children }: { label: string; children: React.ReactNode }) { return <div className="space-y-2"><div className="font-mono text-[10px] uppercase tracking-[0.16em] text-white/40">{label}</div>{children}</div>; }
function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) { return <div><p className="eyebrow">{eyebrow}</p><h2 className="mt-2 text-xl font-semibold tracking-[-0.04em]">{title}</h2></div>; }
