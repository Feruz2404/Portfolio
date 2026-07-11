import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { readJsonBody, RequestBodyTooLargeError } from "@/lib/request";

const schema = z.object({
  path: z.string().trim().min(1).max(2048),
  referrer: z.string().trim().max(2048).optional(),
  country: z.string().trim().max(100).optional(),
  device: z.string().trim().max(100).optional(),
  browser: z.string().trim().max(100).optional()
});

export async function POST(req: Request) {
  const limit = checkRateLimit(`pageview:${getClientIp(req)}`, 120, 60_000);
  if (!limit.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429, headers: { "Retry-After": String(limit.retryAfter) } });
  }

  let body: unknown;
  try {
    body = await readJsonBody(req, 16 * 1024);
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) return NextResponse.json({ error: error.message }, { status: 413 });
    body = null;
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  await prisma.pageView.create({ data: parsed.data });
  return NextResponse.json({ ok: true });
}
