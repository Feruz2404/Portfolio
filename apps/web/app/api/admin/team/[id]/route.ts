import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/server-auth";
import { hasPermission } from "@/lib/rbac";
import { Role } from "@prisma/client";
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
  order: z.number().int().optional()
});

async function requireWrite() {
  const session = await auth();
  if (!session?.user) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  const role = (session.user as any).role as Role;
  if (!hasPermission(role, "team:write") && role !== "ADMIN") {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { session, role };
}

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const gate = await requireWrite();
  if (gate.error) return gate.error;

  const { id } = await params;
  const member = await prisma.teamMember.findUnique({ where: { id } });
  if (!member) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ member });
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const gate = await requireWrite();
  if (gate.error) return gate.error;

  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const { id } = await params;
  const member = await prisma.teamMember.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ member });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const gate = await requireWrite();
  if (gate.error) return gate.error;

  const { id } = await params;
  await prisma.teamMember.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
