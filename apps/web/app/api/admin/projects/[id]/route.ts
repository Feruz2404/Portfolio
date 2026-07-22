import { NextResponse } from "next/server";
import { getAdminApiContext } from "@/lib/adminAuth";
import { writeAuditLog } from "@/lib/audit";
import { prisma } from "@/lib/db";
import { prismaErrorResponse } from "@/lib/api-errors";
import { z } from "zod";

const updateSchema = z.object({
  title: z.string().min(2).optional(),
  slug: z.string().min(2).optional(),
  description: z.string().min(10).optional(),
  category: z.string().min(1).optional(),
  industry: z.string().optional().nullable(),
  technologies: z.array(z.string()).optional(),
  screenshots: z.array(z.string()).optional(),
  status: z.enum(["DRAFT", "IN_PROGRESS", "COMPLETED", "ARCHIVED"]).optional(),
  featured: z.boolean().optional()
});

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const gate = await getAdminApiContext("projects:write");
  if (!gate.ok) return gate.response;

  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id },
    include: { teamMembers: { include: { member: true } } }
  });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ project });
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const gate = await getAdminApiContext("projects:write");
  if (!gate.ok) return gate.response;

  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const { id } = await params;
  try {
    const project = await prisma.project.update({ where: { id }, data: parsed.data });
    await writeAuditLog({
      action: "update",
      entity: "Project",
      entityId: project.id,
      userId: gate.context.userId,
      changes: parsed.data
    });
    return NextResponse.json({ project });
  } catch (error) {
    return prismaErrorResponse(error);
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const gate = await getAdminApiContext("projects:write");
  if (!gate.ok) return gate.response;

  const { id } = await params;
  try {
    await prisma.project.delete({ where: { id } });
    await writeAuditLog({
      action: "delete",
      entity: "Project",
      entityId: id,
      userId: gate.context.userId
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return prismaErrorResponse(error);
  }
}
