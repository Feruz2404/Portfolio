import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { authorize } from "@/lib/adminAuth";

export async function GET() {
  const gate = await authorize("analytics:read");
  if (!gate.authorized) return gate.response;

  const [pageViews, leads] = await Promise.all([prisma.pageView.count(), prisma.contact.count()]);
  return NextResponse.json({ pageViews, leads });
}
