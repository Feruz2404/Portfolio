import { NextResponse } from "next/server";
import { getAdminApiContext } from "@/lib/adminAuth";
import { writeAuditLog } from "@/lib/audit";
import { prisma } from "@/lib/db";
import { parseJsonBody, prismaErrorResponse } from "@/lib/api-errors";
import { z } from "zod";
import bcrypt from "bcryptjs";

const schema = z.object({
  email: z.string().email(),
  role: z.enum(["ADMIN", "EDITOR", "MANAGER", "VIEWER"]).default("VIEWER"),
  tempPassword: z.string().min(8),
});

export async function POST(req: Request) {
  const gate = await getAdminApiContext("users:write");
  if (!gate.ok) return gate.response;

  const parsed = await parseJsonBody(req, schema);
  if (!parsed.ok) return parsed.response;

  const hashedPassword = await bcrypt.hash(parsed.data.tempPassword, 12);

  try {
    const user = await prisma.user.upsert({
      where: { email: parsed.data.email },
      update: { role: parsed.data.role, hashedPassword },
      create: {
        email: parsed.data.email,
        role: parsed.data.role,
        hashedPassword,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    });
    await writeAuditLog({
      action: "invite",
      entity: "User",
      entityId: user.id,
      userId: gate.context.userId,
      changes: { email: user.email, role: user.role },
    });
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    return prismaErrorResponse(error);
  }
}
