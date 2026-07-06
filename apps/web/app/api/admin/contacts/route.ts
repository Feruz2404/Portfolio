import { NextResponse } from "next/server";
import { getAdminApiContext } from "@/lib/adminAuth";
import { prisma } from "@/lib/db";

export async function GET() {
  const gate = await getAdminApiContext("contacts:write");
  if (!gate.ok) return gate.response;

  const contacts = await prisma.contact.findMany({
    orderBy: { updatedAt: "desc" },
    include: { notes: true, emailHistory: true }
  });

  return NextResponse.json({ contacts });
}
