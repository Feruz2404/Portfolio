import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/adminAuth";
import { z } from "zod";

export async function GET() {
  await requireAdmin("team:write");
  const members = await prisma.teamMember.findMany({ orderBy: { order: "asc" } });
  return Response.json({ members });
}

const schema = z.object({
  fullName: z.string().min(1),
  slug: z.string().min(1),
  position: z.string().min(1),
});

export async function POST(req: Request) {
  await requireAdmin("team:write");
  const data = schema.parse(await req.json());
  const member = await prisma.teamMember.create({
    data: {
      ...data,
      skills: [],
      certifications: [],
    },
  });
  return Response.json({ member }, { status: 201 });
}
