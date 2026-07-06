import { requireAdminPage } from "@/lib/adminAuth";
import TeamMemberForm from "@/components/admin/team/TeamMemberForm";

export default async function NewTeamMemberPage() {
  await requireAdminPage("team:write");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">New Team Member</h1>
      <TeamMemberForm mode="create" />
    </div>
  );
}
