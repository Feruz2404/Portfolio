import { prisma } from "@/lib/db";

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  const project = await prisma.project.findUnique({ where: { slug: params.slug }, include: { caseStudy: true } });
  if (!project?.caseStudy || !project.caseStudy.published) return new Response("Not found", { status: 404 });
  return Response.json({ caseStudy: project.caseStudy, project });
}
