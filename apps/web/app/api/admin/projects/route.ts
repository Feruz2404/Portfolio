import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/adminAuth";
import { z } from "zod";

export async function GET() {
  await requireAdmin("projects:read");
  const projects = await prisma.project.findMany({ orderBy: { createdAt: "desc" } });
  return Response.json({ projects });
}

const createSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  category: z.string().min(1),
});

export async function POST(req: Request) {
  await requireAdmin("projects:write");
  const data = createSchema.parse(await req.json());
  const project = await prisma.project.create({
    data: {
      ...data,
      technologies: [],
      screenshots: [],
    },
  });
  return Response.json({ project }, { status: 201 });
}
