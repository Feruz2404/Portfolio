import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  const project = await prisma.project.findUnique({
    where: { slug: params.slug },
    include: {
      teamMembers: { include: { member: true } },
      testimonials: { where: { approved: true } },
      caseStudy: true
    }
  });

  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ project });
}
