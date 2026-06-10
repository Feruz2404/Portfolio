import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/adminAuth";
import { notFound, redirect } from "next/navigation";

export default async function EditTeamMemberPage({ params }: { params: { id: string } }) {
  const member = await prisma.teamMember.findUnique({ where: { id: params.id } });
  if (!member) notFound();

  async function save(formData: FormData) {
    "use server";
    await requireAdmin("team:write");
    await prisma.teamMember.update({
      where: { id: params.id },
      data: {
        fullName: String(formData.get("fullName") ?? member.fullName),
        slug: String(formData.get("slug") ?? member.slug),
        position: String(formData.get("position") ?? member.position),
        avatar: String(formData.get("avatar") ?? "") || null,
        bio: String(formData.get("bio") ?? "") || null,
        githubUrl: String(formData.get("githubUrl") ?? "") || null,
        linkedinUrl: String(formData.get("linkedinUrl") ?? "") || null,
        telegramUrl: String(formData.get("telegramUrl") ?? "") || null,
        portfolioUrl: String(formData.get("portfolioUrl") ?? "") || null,
        isActive: formData.get("isActive") === "on",
      },
    });
    redirect(`/admin/team/${params.id}/edit`);
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold">Edit team member</h1>
      <form action={save} className="mt-6 grid gap-3">
        <input className="rounded-md border border-border bg-background px-3 py-2" name="fullName" defaultValue={member.fullName} required />
        <input className="rounded-md border border-border bg-background px-3 py-2" name="slug" defaultValue={member.slug} required />
        <input className="rounded-md border border-border bg-background px-3 py-2" name="position" defaultValue={member.position} required />
        <input className="rounded-md border border-border bg-background px-3 py-2" name="avatar" defaultValue={member.avatar ?? ""} placeholder="Avatar URL" />
        <textarea className="min-h-32 rounded-md border border-border bg-background px-3 py-2" name="bio" defaultValue={member.bio ?? ""} placeholder="Bio" />
        <div className="grid gap-3 md:grid-cols-2">
          <input className="rounded-md border border-border bg-background px-3 py-2" name="githubUrl" defaultValue={member.githubUrl ?? ""} placeholder="GitHub" />
          <input className="rounded-md border border-border bg-background px-3 py-2" name="linkedinUrl" defaultValue={member.linkedinUrl ?? ""} placeholder="LinkedIn" />
          <input className="rounded-md border border-border bg-background px-3 py-2" name="telegramUrl" defaultValue={member.telegramUrl ?? ""} placeholder="Telegram" />
          <input className="rounded-md border border-border bg-background px-3 py-2" name="portfolioUrl" defaultValue={member.portfolioUrl ?? ""} placeholder="Portfolio" />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="isActive" defaultChecked={member.isActive} /> Active
        </label>
        <button className="rounded-md bg-primary px-3 py-2 text-primary-foreground">Save</button>
      </form>
    </div>
  );
}
