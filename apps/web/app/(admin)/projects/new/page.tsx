import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/adminAuth";
import { redirect } from "next/navigation";

export default function NewProjectPage() {
  async function action(formData: FormData) {
    "use server";
    await requireAdmin("projects:write");
    const title = String(formData.get("title") ?? "");
    const slug = String(formData.get("slug") ?? "");
    const description = String(formData.get("description") ?? "");
    const category = String(formData.get("category") ?? "General");

    const project = await prisma.project.create({
      data: {
        title,
        slug,
        description,
        category,
        technologies: [],
        screenshots: [],
      },
    });

    redirect(`/admin/projects/${project.id}/edit`);
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold">New project</h1>
      <form action={action} className="mt-6 grid gap-3">
        <input className="rounded-md border border-border bg-background px-3 py-2" name="title" placeholder="Title" required />
        <input className="rounded-md border border-border bg-background px-3 py-2" name="slug" placeholder="slug" required />
        <input className="rounded-md border border-border bg-background px-3 py-2" name="category" placeholder="Category" />
        <textarea className="min-h-32 rounded-md border border-border bg-background px-3 py-2" name="description" placeholder="Description" required />
        <button className="rounded-md bg-primary px-3 py-2 text-primary-foreground">Create</button>
      </form>
    </div>
  );
}
