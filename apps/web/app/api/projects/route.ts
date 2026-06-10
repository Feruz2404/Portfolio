import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") ?? undefined;

  const projects = await prisma.project.findMany({
    where: status ? { status: status as any } : undefined,
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });

  return Response.json({ projects });
}
