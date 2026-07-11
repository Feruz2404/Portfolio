import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { publicProjectSelect, publicTeamSelect, PUBLIC_PROJECT_STATUSES } from "@/lib/publicData";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const member = await prisma.teamMember.findFirst({
    where: { slug, isActive: true },
    select: {
      ...publicTeamSelect,
      projects: {
        where: { project: { status: { in: PUBLIC_PROJECT_STATUSES } } },
        select: { id: true, role: true, project: { select: publicProjectSelect } }
      },
      achievements: { select: { id: true, title: true, description: true, date: true } }
    }
  });
  if (!member) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ member });
}
