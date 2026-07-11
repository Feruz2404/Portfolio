import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { publicProjectSelect, publicTeamSelect, PUBLIC_PROJECT_STATUSES } from "@/lib/publicData";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await prisma.project.findFirst({
    where: { slug, status: { in: PUBLIC_PROJECT_STATUSES } },
    select: {
      ...publicProjectSelect,
      teamMembers: { where: { member: { isActive: true } }, select: { id: true, role: true, member: { select: publicTeamSelect } } },
      testimonials: { where: { approved: true }, select: { id: true, name: true, position: true, company: true, avatar: true, content: true, rating: true, featured: true } },
      caseStudy: { where: { published: true }, select: { id: true, heroImage: true, overview: true, challenge: true, process: true, solution: true, outcome: true, metrics: true, timeline: true, published: true } }
    }
  });

  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ project });
}
