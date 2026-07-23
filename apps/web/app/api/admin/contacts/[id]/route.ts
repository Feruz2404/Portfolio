import { NextResponse } from "next/server";
import { getAdminApiContext } from "@/lib/adminAuth";
import { writeAuditLog } from "@/lib/audit";
import { prisma } from "@/lib/db";
import { parseJsonBody, prismaErrorResponse } from "@/lib/api-errors";
import { z } from "zod";

const updateSchema = z
  .object({
    status: z
      .enum(["NEW", "CONTACTED", "QUALIFIED", "PROPOSAL_SENT", "WON", "LOST"])
      .optional(),
    managerId: z.string().optional().nullable(),
  })
  .strict();

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const gate = await getAdminApiContext("contacts:write");
  if (!gate.ok) return gate.response;

  const { id } = await params;
  const contact = await prisma.contact.findUnique({
    where: { id },
    include: {
      notes: true,
      emailHistory: true,
      manager: { select: { id: true, name: true, email: true } },
    },
  });
  if (!contact)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ contact });
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const gate = await getAdminApiContext("contacts:write");
  if (!gate.ok) return gate.response;

  const parsed = await parseJsonBody(req, updateSchema);
  if (!parsed.ok) return parsed.response;

  const { id } = await params;
  try {
    const contact = await prisma.contact.update({
      where: { id },
      data: parsed.data,
    });
    await writeAuditLog({
      action: "update",
      entity: "Contact",
      entityId: contact.id,
      userId: gate.context.userId,
      changes: parsed.data,
    });
    return NextResponse.json({ contact });
  } catch (error) {
    return prismaErrorResponse(error);
  }
}
