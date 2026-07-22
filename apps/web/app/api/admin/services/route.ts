import { NextResponse } from "next/server";
import { getAdminApiContext } from "@/lib/adminAuth";
import { writeAuditLog } from "@/lib/audit";
import { prisma } from "@/lib/db";
import { prismaErrorResponse } from "@/lib/api-errors";
import { z } from "zod";

const serviceSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(10),
  icon: z.string().optional().nullable(),
  features: z.array(z.string()).default([]),
  priceFrom: z.number().int().optional().nullable(),
  priceTo: z.number().int().optional().nullable(),
  currency: z.string().default("USD"),
  duration: z.string().optional().nullable(),
  featured: z.boolean().default(false),
  order: z.number().int().default(0),
  isActive: z.boolean().default(true)
});

export async function GET() {
  const gate = await getAdminApiContext("services:write");
  if (!gate.ok) return gate.response;

  const services = await prisma.service.findMany({ orderBy: [{ featured: "desc" }, { order: "asc" }] });
  return NextResponse.json({ services });
}

export async function POST(req: Request) {
  const gate = await getAdminApiContext("services:write");
  if (!gate.ok) return gate.response;

  const body = await req.json().catch(() => null);
  const parsed = serviceSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  try {
    const service = await prisma.service.create({ data: parsed.data });
    await writeAuditLog({
      action: "create",
      entity: "Service",
      entityId: service.id,
      userId: gate.context.userId,
      changes: { title: service.title, isActive: service.isActive }
    });
    return NextResponse.json({ service }, { status: 201 });
  } catch (error) {
    return prismaErrorResponse(error);
  }
}
