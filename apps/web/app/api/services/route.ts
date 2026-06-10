import { prisma } from "@/lib/db";

export async function GET() {
  const services = await prisma.service.findMany({ where: { isActive: true }, orderBy: { order: "asc" } });
  return Response.json({ services });
}
