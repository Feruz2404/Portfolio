import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { authorize } from "@/lib/adminAuth";
import { caseStudySchema } from "@/lib/adminSchemas";
import { readJsonBody } from "@/lib/request";

export async function GET() {
  const gate = await authorize("case-studies:read");
  if (!gate.authorized) return gate.response;
  const studies = await prisma.caseStudy.findMany({ orderBy: { updatedAt: "desc" }, include: { project: true } });
  return NextResponse.json({ studies });
}

export async function POST(req: Request) {
  const gate = await authorize("case-studies:write");
  if (!gate.authorized) return gate.response;
  const parsed = caseStudySchema.safeParse(await readJsonBody(req));
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  const study = await prisma.caseStudy.create({
    data: {
      ...parsed.data,
      metrics: parsed.data.metrics === null ? Prisma.JsonNull : parsed.data.metrics as Prisma.InputJsonValue,
      timeline: parsed.data.timeline === null ? Prisma.JsonNull : parsed.data.timeline as Prisma.InputJsonValue
    }
  });
  return NextResponse.json({ study }, { status: 201 });
}
