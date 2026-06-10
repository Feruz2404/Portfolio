import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/server-auth";
import { z } from "zod";
import bcrypt from "bcryptjs";

const schema = z.object({
  email: z.string().email(),
  role: z.enum(["ADMIN", "EDITOR", "MANAGER", "VIEWER"]).default("VIEWER"),
  tempPassword: z.string().min(8)
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if ((session.user as any).role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const hashedPassword = await bcrypt.hash(parsed.data.tempPassword, 12);

  const user = await prisma.user.upsert({
    where: { email: parsed.data.email },
    update: { role: parsed.data.role, hashedPassword },
    create: { email: parsed.data.email, role: parsed.data.role, hashedPassword }
  });

  return NextResponse.json({ user }, { status: 201 });
}
