import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { authorize } from "@/lib/adminAuth";

export async function GET() {
  const gate = await authorize("users:read");
  if (!gate.authorized) return gate.response;
  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" }, select: { id: true, email: true, name: true, role: true, createdAt: true } });
  return NextResponse.json({ users });
}
