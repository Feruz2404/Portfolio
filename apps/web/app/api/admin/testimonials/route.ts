import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { authorize } from "@/lib/adminAuth";
import { testimonialSchema } from "@/lib/adminSchemas";
import { readJsonBody } from "@/lib/request";

export async function GET() {
  const gate = await authorize("testimonials:read");
  if (!gate.authorized) return gate.response;
  const testimonials = await prisma.testimonial.findMany({ orderBy: { updatedAt: "desc" } });
  return NextResponse.json({ testimonials });
}

export async function POST(req: Request) {
  const gate = await authorize("testimonials:write");
  if (!gate.authorized) return gate.response;
  const parsed = testimonialSchema.safeParse(await readJsonBody(req));
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  const t = await prisma.testimonial.create({ data: parsed.data });
  return NextResponse.json({ testimonial: t }, { status: 201 });
}
