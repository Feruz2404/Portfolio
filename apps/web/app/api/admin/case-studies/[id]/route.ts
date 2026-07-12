import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { getAdminApiContext } from "@/lib/adminAuth";
import { writeAuditLog } from "@/lib/audit";
import { prisma } from "@/lib/db";
import { prismaErrorResponse, toJsonInput } from "@/lib/api-errors";
import { z } from "zod";

const metricsSchema = z
  .array(z.object({ label: z.string().min(1).max(120), value: z.string().min(1).max(120) }))
  .max(20);
const timelineSchema = z
  .array(z.object({ label: z.string().min(1).max(120), date: z.string().max(60).optional() }))
  .max(30);

const updateSchema = z.object({
  heroImage: z.string().url().optional().nullable(),
  overview: z.string().min(10).optional(),
  challenge: z.string().min(10).optional(),
  process: z.string().min(10).optional(),
  solution: z.string().min(10).optional(),
  outcome: z.string().min(10).optional(),
  metrics: metricsSchema.optional().nullable(),
  timeline: timelineSchema.optional().nullable(),
  published: z.boolean().optional(),
});

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const gate = await getAdminApiContext("projects:write");
  if (!gate.ok) return gate.response;

  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const { id } = await params;
  const { metrics, timeline, ...rest } = parsed.data;
  try {
    const study = await prisma.caseStudy.update({
      where: { id },
      data: { ...rest, metrics: toJsonInput(metrics), timeline: toJsonInput(timeline) },
    });
    await writeAuditLog({
      action: "update",
      entity: "CaseStudy",
      entityId: study.id,
      userId: gate.context.userId,
      changes: parsed.data as Prisma.InputJsonObject,
    });
    return NextResponse.json({ study });
  } catch (error) {
    return prismaErrorResponse(error);
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const gate = await getAdminApiContext("projects:write");
  if (!gate.ok) return gate.response;

  const { id } = await params;
  try {
    await prisma.caseStudy.delete({ where: { id } });
    await writeAuditLog({ action: "delete", entity: "CaseStudy", entityId: id, userId: gate.context.userId });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return prismaErrorResponse(error);
  }
}
