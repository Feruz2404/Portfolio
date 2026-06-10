import { prisma } from "@/lib/db";

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  const member = await prisma.teamMember.findUnique({
    where: { slug: params.slug },
    include: { projects: { include: { project: true } }, achievements: true },
  });
  if (!member) return new Response("Not found", { status: 404 });
  return Response.json({ member });
}
