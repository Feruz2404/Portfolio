import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/server-auth";
import { hasPermission } from "@/lib/rbac";
import { Role } from "@prisma/client";
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
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const role = (session.user as any).role as Role;
  if (!hasPermission(role, "team:write") && role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const team = await prisma.teamMember.findMany({ orderBy: [{ order: "asc" }, { updatedAt: "desc" }] });
  return NextResponse.json({ team });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const role = (session.user as any).role as Role;
  if (!hasPermission(role, "team:write") && role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const member = await prisma.teamMember.create({ data: parsed.data });
  return NextResponse.json({ member }, { status: 201 });
}
