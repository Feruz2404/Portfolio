import { prisma } from "@/lib/db";

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  const project = await prisma.project.findUnique({
    where: { slug: params.slug },
    include: { teamMembers: { include: { member: true } }, testimonials: true, caseStudy: true },
  });
  if (!project) return new Response("Not found", { status: 404 });
  return Response.json({ project });
}
