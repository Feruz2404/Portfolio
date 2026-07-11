import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { authorize } from "@/lib/adminAuth";

export async function GET() {
  const gate = await authorize("contacts:read");
  if (!gate.authorized) return gate.response;
  const contacts = await prisma.contact.findMany({ orderBy: { updatedAt: "desc" }, include: { notes: true, emailHistory: true } });
  return NextResponse.json({ contacts });
}
