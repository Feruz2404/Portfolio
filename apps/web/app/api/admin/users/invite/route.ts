import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { authorize } from "@/lib/adminAuth";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { readJsonBody } from "@/lib/request";

const schema = z.object({
  email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
  role: z.enum(["ADMIN", "EDITOR", "MANAGER", "VIEWER"]).default("VIEWER"),
  tempPassword: z.string().min(12).max(128)
});

export async function POST(req: Request) {
  const gate = await authorize("users:write");
  if (!gate.authorized) return gate.response;

  const body = await readJsonBody(req, 16 * 1024);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const hashedPassword = await bcrypt.hash(parsed.data.tempPassword, 12);

  const user = await prisma.user.upsert({
    where: { email: parsed.data.email },
    update: { role: parsed.data.role, hashedPassword },
    create: { email: parsed.data.email, role: parsed.data.role, hashedPassword }
  });

  return NextResponse.json({
    user: { id: user.id, email: user.email, name: user.name, role: user.role, createdAt: user.createdAt }
  }, { status: 201 });
}
