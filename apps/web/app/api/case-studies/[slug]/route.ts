import { prisma } from "@/lib/db";
import { publicProjectSelect, PUBLIC_PROJECT_STATUSES } from "@/lib/publicData";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await prisma.project.findFirst({
    where: { slug, status: { in: PUBLIC_PROJECT_STATUSES }, caseStudy: { is: { published: true } } },
    select: {
      ...publicProjectSelect,
      caseStudy: { select: { id: true, projectId: true, heroImage: true, overview: true, challenge: true, process: true, solution: true, outcome: true, metrics: true, timeline: true, published: true, createdAt: true, updatedAt: true } }
    }
  });
  if (!project?.caseStudy) return new Response("Not found", { status: 404 });
  return Response.json({ caseStudy: project.caseStudy, project });
}
