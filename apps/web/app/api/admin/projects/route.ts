import { NextResponse } from "next/server";
import { getAdminApiContext } from "@/lib/adminAuth";
import { writeAuditLog } from "@/lib/audit";
import { prisma } from "@/lib/db";
import { z } from "zod";

const createSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(10),
  category: z.string().min(1),
  industry: z.string().optional(),
  technologies: z.array(z.string()).default([]),
  screenshots: z.array(z.string()).default([]),
  status: z.enum(["DRAFT", "IN_PROGRESS", "COMPLETED", "ARCHIVED"]).default("DRAFT"),
  featured: z.boolean().default(false)
});

export async function GET() {
  const gate = await getAdminApiContext("projects:write");
  if (!gate.ok) return gate.response;

  const projects = await prisma.project.findMany({ orderBy: { updatedAt: "desc" } });
  return NextResponse.json({ projects });
}

export async function POST(req: Request) {
  const gate = await getAdminApiContext("projects:write");
  if (!gate.ok) return gate.response;

  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const project = await prisma.project.create({ data: parsed.data });
  await writeAuditLog({
    action: "create",
    entity: "Project",
    entityId: project.id,
    userId: gate.context.userId,
    changes: { title: project.title, status: project.status }
  });

  return NextResponse.json({ project }, { status: 201 });
}
