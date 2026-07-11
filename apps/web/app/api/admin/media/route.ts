import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { authorize } from "@/lib/adminAuth";
import { mediaSchema } from "@/lib/adminSchemas";
import { readJsonBody } from "@/lib/request";

export async function GET() {
  const gate = await authorize("media:read");
  if (!gate.authorized) return gate.response;
  const media = await prisma.media.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ media });
}

export async function POST(req: Request) {
  const gate = await authorize("media:write");
  if (!gate.authorized) return gate.response;
  const parsed = mediaSchema.safeParse(await readJsonBody(req, 64 * 1024));
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  const item = await prisma.media.create({ data: parsed.data });
  return NextResponse.json({ media: item }, { status: 201 });
}
