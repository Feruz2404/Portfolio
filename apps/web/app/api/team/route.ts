import { prisma } from "@/lib/db";

export async function GET() {
  const members = await prisma.teamMember.findMany({ where: { isActive: true }, orderBy: { order: "asc" } });
  return Response.json({ members });
}
