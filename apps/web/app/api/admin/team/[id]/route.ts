import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { authorize } from "@/lib/adminAuth";
import { readJsonBody } from "@/lib/request";
import { z } from "zod";

const updateSchema = z.object({
  fullName: z.string().trim().min(2).max(160).optional(),
  slug: z.string().trim().min(2).max(160).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  position: z.string().trim().min(2).max(160).optional(),
  avatar: z.string().url().max(2048).optional().nullable(),
  bio: z.string().trim().max(5000).optional().nullable(),
  skills: z.array(z.string().trim().max(100)).max(50).optional(),
  githubUrl: z.string().url().max(2048).optional().nullable(),
  linkedinUrl: z.string().url().max(2048).optional().nullable(),
  telegramUrl: z.string().url().max(2048).optional().nullable(),
  portfolioUrl: z.string().url().max(2048).optional().nullable(),
  yearsOfExp: z.number().int().min(0).max(80).optional().nullable(),
  certifications: z.array(z.string().trim().max(200)).max(50).optional(),
  isActive: z.boolean().optional(),
  order: z.number().int().optional()
});

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const gate = await authorize("team:read");
  if (!gate.authorized) return gate.response;

  const { id } = await params;
  const member = await prisma.teamMember.findUnique({ where: { id } });
  if (!member) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ member });
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const gate = await authorize("team:write");
  if (!gate.authorized) return gate.response;

  const body = await readJsonBody(req, 64 * 1024);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const { id } = await params;
  const member = await prisma.teamMember.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ member });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const gate = await authorize("team:write");
  if (!gate.authorized) return gate.response;

  const { id } = await params;
  await prisma.teamMember.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
