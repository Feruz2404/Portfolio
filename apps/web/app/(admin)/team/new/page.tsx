import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/adminAuth";
import { redirect } from "next/navigation";

export default function NewTeamMemberPage() {
  async function action(formData: FormData) {
    "use server";
    await requireAdmin("team:write");
    const fullName = String(formData.get("fullName") ?? "");
    const slug = String(formData.get("slug") ?? "");
    const position = String(formData.get("position") ?? "");

    const m = await prisma.teamMember.create({
      data: {
        fullName,
        slug,
        position,
        skills: [],
        certifications: [],
      },
    });

    redirect(`/admin/team/${m.id}/edit`);
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold">New team member</h1>
      <form action={action} className="mt-6 grid gap-3">
        <input className="rounded-md border border-border bg-background px-3 py-2" name="fullName" placeholder="Full name" required />
        <input className="rounded-md border border-border bg-background px-3 py-2" name="slug" placeholder="slug" required />
        <input className="rounded-md border border-border bg-background px-3 py-2" name="position" placeholder="Position" required />
        <button className="rounded-md bg-primary px-3 py-2 text-primary-foreground">Create</button>
      </form>
    </div>
  );
}
