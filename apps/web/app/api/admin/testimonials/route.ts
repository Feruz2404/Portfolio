import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/server-auth";
import { Role } from "@prisma/client";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const testimonials = await prisma.testimonial.findMany({ orderBy: { updatedAt: "desc" } });
  return NextResponse.json({ testimonials });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const t = await prisma.testimonial.create({ data: body });
  return NextResponse.json({ testimonial: t }, { status: 201 });
}
