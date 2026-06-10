import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import ProjectForm from "@/components/admin/projects/ProjectForm";

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const project = await prisma.project.findUnique({ where: { id: params.id } });
  if (!project) return notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Edit Project</h1>
        <p className="mt-1 text-sm text-white/60">Update project details.</p>
      </div>
      <ProjectForm mode="edit" project={project} />
    </div>
  );
}
