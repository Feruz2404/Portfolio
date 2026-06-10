import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/server-auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const contacts = await prisma.contact.findMany({ orderBy: { updatedAt: "desc" }, include: { notes: true, emailHistory: true } });
  return NextResponse.json({ contacts });
}
