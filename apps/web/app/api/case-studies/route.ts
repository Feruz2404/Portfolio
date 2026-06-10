import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const studies = await prisma.caseStudy.findMany({
    where: { published: true },
    include: { project: true },
    orderBy: [{ updatedAt: "desc" }]
  });
  return NextResponse.json({ studies });
}
