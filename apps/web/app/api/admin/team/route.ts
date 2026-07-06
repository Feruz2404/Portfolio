import { NextResponse } from "next/server";
import { getAdminApiContext } from "@/lib/adminAuth";
import { writeAuditLog } from "@/lib/audit";
import { prisma } from "@/lib/db";
import { z } from "zod";

const createSchema = z.object({
  fullName: z.string().min(2),
  slug: z.string().min(2),
  position: z.string().min(2),
  bio: z.string().optional(),
  skills: z.array(z.string()).default([]),
  githubUrl: z.string().url().optional(),
  linkedinUrl: z.string().url().optional(),
  telegramUrl: z.string().url().optional(),
  portfolioUrl: z.string().url().optional(),
  yearsOfExp: z.number().int().optional(),
  certifications: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
  order: z.number().int().default(0)
});

export async function GET() {
  const gate = await getAdminApiContext("team:write");
  if (!gate.ok) return gate.response;

  const team = await prisma.teamMember.findMany({ orderBy: [{ order: "asc" }, { updatedAt: "desc" }] });
  return NextResponse.json({ team });
}

export async function POST(req: Request) {
  const gate = await getAdminApiContext("team:write");
  if (!gate.ok) return gate.response;

  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const member = await prisma.teamMember.create({ data: parsed.data });
  await writeAuditLog({
    action: "create",
    entity: "TeamMember",
    entityId: member.id,
    userId: gate.context.userId,
    changes: { fullName: member.fullName, position: member.position }
  });

  return NextResponse.json({ member }, { status: 201 });
}
