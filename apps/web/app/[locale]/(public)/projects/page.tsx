import { prisma } from "@/lib/db";
import { getEnv } from "@/lib/env";
import ProjectsClient from "@/app/[locale]/(public)/_sections/ProjectsClient";

export default async function ProjectsPage() {
  if (!getEnv().DATABASE_URL) return <ProjectsClient projects={[]} />;

  const projects = await prisma.project.findMany({
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      category: true,
      technologies: true,
      screenshots: true,
      featured: true,
    },
  });

  return <ProjectsClient projects={projects} />;
}
