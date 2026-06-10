import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  event: z.string().min(1),
  properties: z.record(z.any()).optional(),
  sessionId: z.string().optional()
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  await prisma.analyticsEvent.create({
    data: {
      event: parsed.data.event,
      properties: parsed.data.properties,
      sessionId: parsed.data.sessionId
    }
  });

  return NextResponse.json({ ok: true });
}
