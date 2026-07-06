import { NextResponse } from "next/server";
import { getAdminApiContext } from "@/lib/adminAuth";
import { writeAuditLog } from "@/lib/audit";
import { prisma } from "@/lib/db";
import { z } from "zod";

const mediaSchema = z.object({
  filename: z.string().min(1),
  url: z.string().url(),
  mimeType: z.string().min(1),
  size: z.number().int().nonnegative(),
  alt: z.string().optional().nullable(),
  caption: z.string().optional().nullable(),
  folder: z.string().optional().nullable()
});

export async function GET() {
  const gate = await getAdminApiContext("media:write");
  if (!gate.ok) return gate.response;

  const media = await prisma.media.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ media });
}

export async function POST(req: Request) {
  const gate = await getAdminApiContext("media:write");
  if (!gate.ok) return gate.response;

  const body = await req.json().catch(() => null);
  const parsed = mediaSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const item = await prisma.media.create({ data: parsed.data });
  await writeAuditLog({
    action: "create",
    entity: "Media",
    entityId: item.id,
    userId: gate.context.userId,
    changes: { filename: item.filename, mimeType: item.mimeType }
  });

  return NextResponse.json({ media: item }, { status: 201 });
}
