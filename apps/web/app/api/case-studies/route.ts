import { prisma } from "@/lib/db";

export async function GET() {
  const caseStudies = await prisma.caseStudy.findMany({ where: { published: true }, include: { project: true }, orderBy: { createdAt: "desc" } });
  return Response.json({ caseStudies });
}
