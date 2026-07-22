import { NextResponse } from "next/server";
import { getAdminApiContext } from "@/lib/adminAuth";
import { writeAuditLog } from "@/lib/audit";
import { prisma } from "@/lib/db";
import { prismaErrorResponse } from "@/lib/api-errors";

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const gate = await getAdminApiContext("media:write");
  if (!gate.ok) return gate.response;

  const { id } = await params;
  try {
    await prisma.media.delete({ where: { id } });
    await writeAuditLog({
      action: "delete",
      entity: "Media",
      entityId: id,
      userId: gate.context.userId
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return prismaErrorResponse(error);
  }
}
