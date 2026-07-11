import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { authorize } from "@/lib/adminAuth";
import { readJsonBody } from "@/lib/request";
import { z } from "zod";

const createSchema = z.object({
  fullName: z.string().trim().min(2).max(160),
  slug: z.string().trim().min(2).max(160).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  position: z.string().trim().min(2).max(160),
  bio: z.string().trim().max(5000).optional(),
  skills: z.array(z.string().trim().max(100)).max(50).default([]),
  githubUrl: z.string().url().max(2048).optional(),
  linkedinUrl: z.string().url().max(2048).optional(),
  telegramUrl: z.string().url().max(2048).optional(),
  portfolioUrl: z.string().url().max(2048).optional(),
  yearsOfExp: z.number().int().min(0).max(80).optional(),
  certifications: z.array(z.string().trim().max(200)).max(50).default([]),
  isActive: z.boolean().default(true),
  order: z.number().int().default(0)
});

export async function GET() {
  const gate = await authorize("team:read");
  if (!gate.authorized) return gate.response;

  const team = await prisma.teamMember.findMany({ orderBy: [{ order: "asc" }, { updatedAt: "desc" }] });
  return NextResponse.json({ team });
}

export async function POST(req: Request) {
  const gate = await authorize("team:write");
  if (!gate.authorized) return gate.response;

  const body = await readJsonBody(req, 64 * 1024);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const member = await prisma.teamMember.create({ data: parsed.data });
  return NextResponse.json({ member }, { status: 201 });
}
