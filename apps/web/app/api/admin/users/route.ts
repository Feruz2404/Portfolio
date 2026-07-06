import { NextResponse } from "next/server";
import { getAdminApiContext } from "@/lib/adminAuth";
import { prisma } from "@/lib/db";

export async function GET() {
  const gate = await getAdminApiContext("users:write");
  if (!gate.ok) return gate.response;

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, email: true, name: true, role: true, createdAt: true }
  });

  return NextResponse.json({ users });
}
