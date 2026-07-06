import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { getAdminApiContext } from "@/lib/adminAuth";
import { writeAuditLog } from "@/lib/audit";
import { prisma } from "@/lib/db";
import { z } from "zod";

const updateSchema = z.object({
  heroImage: z.string().url().optional().nullable(),
  overview: z.string().min(10).optional(),
  challenge: z.string().min(10).optional(),
  process: z.string().min(10).optional(),
  solution: z.string().min(10).optional(),
  outcome: z.string().min(10).optional(),
  metrics: z.unknown().optional().nullable(),
  timeline: z.unknown().optional().nullable(),
  published: z.boolean().optional()
});

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const gate = await getAdminApiContext("projects:write");
  if (!gate.ok) return gate.response;

  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const { id } = await params;
  const study = await prisma.caseStudy.update({
    where: { id },
    data: {
      ...parsed.data,
      metrics: parsed.data.metrics as Prisma.InputJsonValue,
      timeline: parsed.data.timeline as Prisma.InputJsonValue
    }
  });
  await writeAuditLog({
    action: "update",
    entity: "CaseStudy",
    entityId: study.id,
    userId: gate.context.userId,
    changes: parsed.data as Prisma.InputJsonObject
  });

  return NextResponse.json({ study });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const gate = await getAdminApiContext("projects:write");
  if (!gate.ok) return gate.response;

  const { id } = await params;
  await prisma.caseStudy.delete({ where: { id } });
  await writeAuditLog({
    action: "delete",
    entity: "CaseStudy",
    entityId: id,
    userId: gate.context.userId
  });

  return NextResponse.json({ ok: true });
}
