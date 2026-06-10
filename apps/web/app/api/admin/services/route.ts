import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/server-auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const services = await prisma.service.findMany({ orderBy: [{ featured: "desc" }, { order: "asc" }] });
  return NextResponse.json({ services });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const service = await prisma.service.create({ data: body });
  return NextResponse.json({ service }, { status: 201 });
}
