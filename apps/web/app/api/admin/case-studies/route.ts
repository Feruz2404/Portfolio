import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/server-auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const studies = await prisma.caseStudy.findMany({ orderBy: { updatedAt: "desc" }, include: { project: true } });
  return NextResponse.json({ studies });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const study = await prisma.caseStudy.create({ data: body });
  return NextResponse.json({ study }, { status: 201 });
}
