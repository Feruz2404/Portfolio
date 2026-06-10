import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/server-auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [pageViews, leads] = await Promise.all([prisma.pageView.count(), prisma.contact.count()]);
  return NextResponse.json({ pageViews, leads });
}
