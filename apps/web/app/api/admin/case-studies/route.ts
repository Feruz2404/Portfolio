import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { getAdminApiContext } from "@/lib/adminAuth";
import { writeAuditLog } from "@/lib/audit";
import { prisma } from "@/lib/db";
import { z } from "zod";

const caseStudySchema = z.object({
  projectId: z.string().min(1),
  heroImage: z.string().url().optional().nullable(),
  overview: z.string().min(10),
  challenge: z.string().min(10),
  process: z.string().min(10),
  solution: z.string().min(10),
  outcome: z.string().min(10),
  metrics: z.unknown().optional().nullable(),
  timeline: z.unknown().optional().nullable(),
  published: z.boolean().default(false)
});

export async function GET() {
  const gate = await getAdminApiContext("projects:write");
  if (!gate.ok) return gate.response;

  const studies = await prisma.caseStudy.findMany({ orderBy: { updatedAt: "desc" }, include: { project: true } });
  return NextResponse.json({ studies });
}

export async function POST(req: Request) {
  const gate = await getAdminApiContext("projects:write");
  if (!gate.ok) return gate.response;

  const body = await req.json().catch(() => null);
  const parsed = caseStudySchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const study = await prisma.caseStudy.create({
    data: {
      ...parsed.data,
      metrics: parsed.data.metrics as Prisma.InputJsonValue,
      timeline: parsed.data.timeline as Prisma.InputJsonValue
    }
  });
  await writeAuditLog({
    action: "create",
    entity: "CaseStudy",
    entityId: study.id,
    userId: gate.context.userId,
    changes: { projectId: study.projectId, published: study.published }
  });

  return NextResponse.json({ study }, { status: 201 });
}
