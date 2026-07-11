import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { publicProjectSelect, PUBLIC_PROJECT_STATUSES } from "@/lib/publicData";

export async function GET() {
  const studies = await prisma.caseStudy.findMany({
    where: { published: true, project: { status: { in: PUBLIC_PROJECT_STATUSES } } },
    select: {
      id: true,
      projectId: true,
      heroImage: true,
      overview: true,
      challenge: true,
      process: true,
      solution: true,
      outcome: true,
      metrics: true,
      timeline: true,
      published: true,
      createdAt: true,
      updatedAt: true,
      project: { select: publicProjectSelect }
    },
    orderBy: [{ updatedAt: "desc" }]
  });
  return NextResponse.json({ studies });
}
