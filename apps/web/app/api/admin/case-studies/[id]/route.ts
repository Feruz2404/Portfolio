import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { authorize } from "@/lib/adminAuth";
import { caseStudyUpdateSchema } from "@/lib/adminSchemas";
import { readJsonBody } from "@/lib/request";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const gate = await authorize("case-studies:write");
  if (!gate.authorized) return gate.response;
  const parsed = caseStudyUpdateSchema.safeParse(await readJsonBody(req));
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  const { id } = await params;
  const { metrics, timeline, ...fields } = parsed.data;
  const study = await prisma.caseStudy.update({
    where: { id },
    data: {
      ...fields,
      ...(metrics !== undefined ? { metrics: metrics === null ? Prisma.JsonNull : metrics as Prisma.InputJsonValue } : {}),
      ...(timeline !== undefined ? { timeline: timeline === null ? Prisma.JsonNull : timeline as Prisma.InputJsonValue } : {})
    }
  });
  return NextResponse.json({ study });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const gate = await authorize("case-studies:write");
  if (!gate.authorized) return gate.response;
  const { id } = await params;
  await prisma.caseStudy.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
