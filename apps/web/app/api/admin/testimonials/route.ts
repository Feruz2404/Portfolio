import { NextResponse } from "next/server";
import { getAdminApiContext } from "@/lib/adminAuth";
import { writeAuditLog } from "@/lib/audit";
import { prisma } from "@/lib/db";
import { z } from "zod";

const testimonialSchema = z.object({
  name: z.string().min(2),
  position: z.string().optional().nullable(),
  company: z.string().optional().nullable(),
  avatar: z.string().url().optional().nullable(),
  content: z.string().min(10),
  rating: z.number().int().min(1).max(5).default(5),
  featured: z.boolean().default(false),
  approved: z.boolean().default(false),
  projectId: z.string().optional().nullable()
});

export async function GET() {
  const gate = await getAdminApiContext("testimonials:write");
  if (!gate.ok) return gate.response;

  const testimonials = await prisma.testimonial.findMany({ orderBy: { updatedAt: "desc" } });
  return NextResponse.json({ testimonials });
}

export async function POST(req: Request) {
  const gate = await getAdminApiContext("testimonials:write");
  if (!gate.ok) return gate.response;

  const body = await req.json().catch(() => null);
  const parsed = testimonialSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const testimonial = await prisma.testimonial.create({ data: parsed.data });
  await writeAuditLog({
    action: "create",
    entity: "Testimonial",
    entityId: testimonial.id,
    userId: gate.context.userId,
    changes: { name: testimonial.name, approved: testimonial.approved }
  });

  return NextResponse.json({ testimonial }, { status: 201 });
}
