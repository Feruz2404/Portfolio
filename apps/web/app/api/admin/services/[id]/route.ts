import { NextResponse } from "next/server";
import { getAdminApiContext } from "@/lib/adminAuth";
import { writeAuditLog } from "@/lib/audit";
import { prisma } from "@/lib/db";
import { z } from "zod";

const updateSchema = z.object({
  title: z.string().min(2).optional(),
  slug: z.string().min(2).optional(),
  description: z.string().min(10).optional(),
  icon: z.string().optional().nullable(),
  features: z.array(z.string()).optional(),
  priceFrom: z.number().int().optional().nullable(),
  priceTo: z.number().int().optional().nullable(),
  currency: z.string().optional(),
  duration: z.string().optional().nullable(),
  featured: z.boolean().optional(),
  order: z.number().int().optional(),
  isActive: z.boolean().optional()
});

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const gate = await getAdminApiContext("services:write");
  if (!gate.ok) return gate.response;

  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const { id } = await params;
  const service = await prisma.service.update({ where: { id }, data: parsed.data });
  await writeAuditLog({
    action: "update",
    entity: "Service",
    entityId: service.id,
    userId: gate.context.userId,
    changes: parsed.data
  });

  return NextResponse.json({ service });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const gate = await getAdminApiContext("services:write");
  if (!gate.ok) return gate.response;

  const { id } = await params;
  await prisma.service.delete({ where: { id } });
  await writeAuditLog({
    action: "delete",
    entity: "Service",
    entityId: id,
    userId: gate.context.userId
  });

  return NextResponse.json({ ok: true });
}
