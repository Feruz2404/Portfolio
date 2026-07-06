import { NextResponse } from "next/server";
import { getAdminApiContext } from "@/lib/adminAuth";
import { writeAuditLog } from "@/lib/audit";
import { prisma } from "@/lib/db";
import { z } from "zod";

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  position: z.string().optional().nullable(),
  company: z.string().optional().nullable(),
  avatar: z.string().url().optional().nullable(),
  content: z.string().min(10).optional(),
  rating: z.number().int().min(1).max(5).optional(),
  featured: z.boolean().optional(),
  approved: z.boolean().optional(),
  projectId: z.string().optional().nullable()
});

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const gate = await getAdminApiContext("testimonials:write");
  if (!gate.ok) return gate.response;

  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const { id } = await params;
  const testimonial = await prisma.testimonial.update({ where: { id }, data: parsed.data });
  await writeAuditLog({
    action: "update",
    entity: "Testimonial",
    entityId: testimonial.id,
    userId: gate.context.userId,
    changes: parsed.data
  });

  return NextResponse.json({ testimonial });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const gate = await getAdminApiContext("testimonials:write");
  if (!gate.ok) return gate.response;

  const { id } = await params;
  await prisma.testimonial.delete({ where: { id } });
  await writeAuditLog({
    action: "delete",
    entity: "Testimonial",
    entityId: id,
    userId: gate.context.userId
  });

  return NextResponse.json({ ok: true });
}
