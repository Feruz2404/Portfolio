import { NextResponse } from "next/server";
import { getAdminApiContext } from "@/lib/adminAuth";
import { prisma } from "@/lib/db";

export async function GET() {
  const gate = await getAdminApiContext("analytics:read");
  if (!gate.ok) return gate.response;

  const [pageViews, leads] = await Promise.all([prisma.pageView.count(), prisma.contact.count()]);
  return NextResponse.json({ pageViews, leads });
}
