import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/adminAuth";
import { notFound, redirect } from "next/navigation";

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const project = await prisma.project.findUnique({ where: { id: params.id }, include: { teamMembers: { include: { member: true } } } });
  if (!project) notFound();

  async function save(formData: FormData) {
    "use server";
    await requireAdmin("projects:write");
    await prisma.project.update({
      where: { id: params.id },
      data: {
        title: String(formData.get("title") ?? project.title),
        slug: String(formData.get("slug") ?? project.slug),
        description: String(formData.get("description") ?? project.description),
        category: String(formData.get("category") ?? project.category),
        industry: String(formData.get("industry") ?? "") || null,
        liveUrl: String(formData.get("liveUrl") ?? "") || null,
        githubUrl: String(formData.get("githubUrl") ?? "") || null,
        videoUrl: String(formData.get("videoUrl") ?? "") || null,
        featured: formData.get("featured") === "on",
      },
    });
    redirect(`/admin/projects/${params.id}/edit`);
  }

  const members = await prisma.teamMember.findMany({ orderBy: { order: "asc" } });

  async function addMember(formData: FormData) {
    "use server";
    await requireAdmin("projects:write");
    const memberId = String(formData.get("memberId") ?? "");
    const role = String(formData.get("role") ?? "Member");
    if (!memberId) return;
    await prisma.projectTeamMember.upsert({
      where: { projectId_memberId: { projectId: params.id, memberId } },
      create: { projectId: params.id, memberId, role },
      update: { role },
    });
    redirect(`/admin/projects/${params.id}/edit`);
  }

  async function removeMember(formData: FormData) {
    "use server";
    await requireAdmin("projects:write");
    const id = String(formData.get("id") ?? "");
    if (!id) return;
    await prisma.projectTeamMember.delete({ where: { id } });
    redirect(`/admin/projects/${params.id}/edit`);
  }

  return (
    <div className="grid gap-10">
      <div className="max-w-3xl">
        <h1 className="text-2xl font-bold">Edit project</h1>
        <form action={save} className="mt-6 grid gap-3">
          <input className="rounded-md border border-border bg-background px-3 py-2" name="title" defaultValue={project.title} required />
          <input className="rounded-md border border-border bg-background px-3 py-2" name="slug" defaultValue={project.slug} required />
          <input className="rounded-md border border-border bg-background px-3 py-2" name="category" defaultValue={project.category} />
          <input className="rounded-md border border-border bg-background px-3 py-2" name="industry" defaultValue={project.industry ?? ""} placeholder="Industry" />
          <textarea className="min-h-32 rounded-md border border-border bg-background px-3 py-2" name="description" defaultValue={project.description} required />
          <div className="grid gap-3 md:grid-cols-3">
            <input className="rounded-md border border-border bg-background px-3 py-2" name="liveUrl" defaultValue={project.liveUrl ?? ""} placeholder="Live URL" />
            <input className="rounded-md border border-border bg-background px-3 py-2" name="githubUrl" defaultValue={project.githubUrl ?? ""} placeholder="GitHub URL" />
            <input className="rounded-md border border-border bg-background px-3 py-2" name="videoUrl" defaultValue={project.videoUrl ?? ""} placeholder="Video URL" />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="featured" defaultChecked={project.featured} /> Featured
          </label>
          <button className="rounded-md bg-primary px-3 py-2 text-primary-foreground">Save</button>
        </form>
      </div>

      <div className="max-w-3xl">
        <h2 className="text-xl font-semibold">Team members</h2>
        <div className="mt-4 grid gap-3">
          {project.teamMembers.map((tm) => (
            <div key={tm.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-4">
              <div>
                <div className="font-semibold">{tm.member.fullName}</div>
                <div className="text-sm text-muted-foreground">{tm.role}</div>
              </div>
              <form action={removeMember}>
                <input type="hidden" name="id" value={tm.id} />
                <button className="rounded-md border border-border bg-secondary px-3 py-2 text-sm hover:bg-secondary/80">Remove</button>
              </form>
            </div>
          ))}
        </div>

        <form action={addMember} className="mt-4 grid gap-3 rounded-lg border border-border bg-card p-4">
          <select className="rounded-md border border-border bg-background px-3 py-2" name="memberId" defaultValue="">
            <option value="" disabled>
              Select member
            </option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.fullName}
              </option>
            ))}
          </select>
          <input className="rounded-md border border-border bg-background px-3 py-2" name="role" placeholder="Role" defaultValue="Developer" />
          <button className="rounded-md bg-primary px-3 py-2 text-primary-foreground">Add / Update</button>
        </form>
      </div>
    </div>
  );
}
