import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/server-auth";
import { hasPermission } from "@/lib/rbac";
import { Role } from "@prisma/client";
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

async function requireWrite() {
  const session = await auth();
  if (!session?.user) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  const role = (session.user as any).role as Role;
  if (!hasPermission(role, "projects:write") && role !== "ADMIN") {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { session, role };
}

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const gate = await requireWrite();
  if (gate.error) return gate.error;

  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id },
    include: { teamMembers: { include: { member: true } } }
  });
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ project });
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const gate = await requireWrite();
  if (gate.error) return gate.error;

  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const { id } = await params;
  const project = await prisma.project.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ project });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const gate = await requireWrite();
  if (gate.error) return gate.error;

  const { id } = await params;
  await prisma.project.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
