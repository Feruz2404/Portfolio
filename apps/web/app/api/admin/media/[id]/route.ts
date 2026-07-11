import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { authorize } from "@/lib/adminAuth";

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const gate = await authorize("media:write");
  if (!gate.authorized) return gate.response;
  const { id } = await params;
  await prisma.media.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
