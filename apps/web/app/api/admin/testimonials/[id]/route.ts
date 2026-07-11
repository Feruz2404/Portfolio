import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { authorize } from "@/lib/adminAuth";
import { testimonialUpdateSchema } from "@/lib/adminSchemas";
import { readJsonBody } from "@/lib/request";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const gate = await authorize("testimonials:write");
  if (!gate.authorized) return gate.response;
  const parsed = testimonialUpdateSchema.safeParse(await readJsonBody(req));
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  const { id } = await params;
  const t = await prisma.testimonial.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ testimonial: t });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const gate = await authorize("testimonials:write");
  if (!gate.authorized) return gate.response;
  const { id } = await params;
  await prisma.testimonial.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
