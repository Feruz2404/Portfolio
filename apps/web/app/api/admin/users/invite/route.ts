import { NextResponse } from "next/server";
import { getAdminApiContext } from "@/lib/adminAuth";
import { writeAuditLog } from "@/lib/audit";
import { prisma } from "@/lib/db";
import { prismaErrorResponse } from "@/lib/api-errors";
import { z } from "zod";
import bcrypt from "bcryptjs";

const schema = z.object({
  email: z.string().email(),
  role: z.enum(["ADMIN", "EDITOR", "MANAGER", "VIEWER"]).default("VIEWER"),
  tempPassword: z.string().min(8)
});

export async function POST(req: Request) {
  const gate = await getAdminApiContext("users:write");
  if (!gate.ok) return gate.response;

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const hashedPassword = await bcrypt.hash(parsed.data.tempPassword, 12);

  try {
    const user = await prisma.user.upsert({
      where: { email: parsed.data.email },
      update: { role: parsed.data.role, hashedPassword },
      create: { email: parsed.data.email, role: parsed.data.role, hashedPassword },
      select: { id: true, email: true, name: true, role: true, createdAt: true }
    });
    await writeAuditLog({
      action: "invite",
      entity: "User",
      entityId: user.id,
      userId: gate.context.userId,
      changes: { email: user.email, role: user.role }
    });
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    return prismaErrorResponse(error);
  }
}
