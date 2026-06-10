import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const team = await prisma.teamMember.findMany({
    where: { isActive: true },
    orderBy: [{ order: "asc" }, { createdAt: "desc" }]
  });
  return NextResponse.json({ team });
}
