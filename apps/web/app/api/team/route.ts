import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { publicTeamSelect } from "@/lib/publicData";

export async function GET() {
  const team = await prisma.teamMember.findMany({
    where: { isActive: true },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
    select: publicTeamSelect
  });
  return NextResponse.json({ team });
}
