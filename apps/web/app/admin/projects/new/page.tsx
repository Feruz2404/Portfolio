import { requireAdminPage } from "@/lib/adminAuth";
import ProjectForm from "@/components/admin/projects/ProjectForm";

export default async function NewProjectPage() {
  await requireAdminPage("projects:write");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-normal">New Project</h1>
        <p className="mt-1 text-sm text-white/60">Create a new project entry.</p>
      </div>
      <ProjectForm mode="create" />
    </div>
  );
}
