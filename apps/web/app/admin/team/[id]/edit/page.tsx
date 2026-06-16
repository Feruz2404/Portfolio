import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import TeamMemberForm from "@/components/admin/team/TeamMemberForm";

export default async function EditTeamMemberPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const member = await prisma.teamMember.findUnique({ where: { id } });
  if (!member) return notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Edit Team Member</h1>
      <TeamMemberForm mode="edit" member={member} />
    </div>
  );
}
