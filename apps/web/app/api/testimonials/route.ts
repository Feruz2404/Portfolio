import { prisma } from "@/lib/db";

export async function GET() {
  const testimonials = await prisma.testimonial.findMany({ where: { approved: true }, orderBy: [{ featured: "desc" }, { createdAt: "desc" }] });
  return Response.json({ testimonials });
}
