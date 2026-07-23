import { NextResponse } from "next/server";
import { getAdminApiContext } from "@/lib/adminAuth";
import { writeAuditLog } from "@/lib/audit";
import { prisma } from "@/lib/db";
import { parseJsonBody, prismaErrorResponse } from "@/lib/api-errors";
import { z } from "zod";

const updateSchema = z.object({
  fullName: z.string().min(2).optional(),
  slug: z.string().min(2).optional(),
  position: z.string().min(2).optional(),
  avatar: z.string().optional().nullable(),
  bio: z.string().optional().nullable(),
  skills: z.array(z.string()).optional(),
  githubUrl: z.string().url().optional().nullable(),
  linkedinUrl: z.string().url().optional().nullable(),
  telegramUrl: z.string().url().optional().nullable(),
  portfolioUrl: z.string().url().optional().nullable(),
  yearsOfExp: z.number().int().optional().nullable(),
  certifications: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
  order: z.number().int().optional(),
});

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const gate = await getAdminApiContext("team:write");
  if (!gate.ok) return gate.response;

  const { id } = await params;
  const member = await prisma.teamMember.findUnique({ where: { id } });
  if (!member)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ member });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const gate = await getAdminApiContext("team:write");
  if (!gate.ok) return gate.response;

  const parsed = await parseJsonBody(req, updateSchema);
  if (!parsed.ok) return parsed.response;

  const { id } = await params;
  try {
    const member = await prisma.teamMember.update({
      where: { id },
      data: parsed.data,
    });
    await writeAuditLog({
      action: "update",
      entity: "TeamMember",
      entityId: member.id,
      userId: gate.context.userId,
      changes: parsed.data,
    });
    return NextResponse.json({ member });
  } catch (error) {
    return prismaErrorResponse(error);
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const gate = await getAdminApiContext("team:write");
  if (!gate.ok) return gate.response;

  const { id } = await params;
  try {
    await prisma.teamMember.delete({ where: { id } });
    await writeAuditLog({
      action: "delete",
      entity: "TeamMember",
      entityId: id,
      userId: gate.context.userId,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return prismaErrorResponse(error);
  }
}
