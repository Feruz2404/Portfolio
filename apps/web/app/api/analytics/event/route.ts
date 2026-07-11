import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { readJsonBody, RequestBodyTooLargeError } from "@/lib/request";

const schema = z.object({
  event: z.string().trim().min(1).max(120),
  properties: z.record(z.unknown()).optional(),
  sessionId: z.string().trim().max(160).optional()
});

export async function POST(req: Request) {
  const limit = checkRateLimit(`event:${getClientIp(req)}`, 120, 60_000);
  if (!limit.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429, headers: { "Retry-After": String(limit.retryAfter) } });
  }

  let body: unknown;
  try {
    body = await readJsonBody(req, 32 * 1024);
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) return NextResponse.json({ error: error.message }, { status: 413 });
    body = null;
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  await prisma.analyticsEvent.create({
    data: {
      event: parsed.data.event,
      properties: parsed.data.properties as Prisma.InputJsonValue | undefined,
      sessionId: parsed.data.sessionId
    }
  });

  return NextResponse.json({ ok: true });
}
