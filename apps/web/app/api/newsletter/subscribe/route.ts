import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { readJsonBody, RequestBodyTooLargeError } from "@/lib/request";

const schema = z.object({
  email: z.string().trim().email().max(254).transform((value) => value.toLowerCase())
});

export async function POST(req: Request) {
  const limit = checkRateLimit(`newsletter:${getClientIp(req)}`, 5, 60_000);
  if (!limit.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429, headers: { "Retry-After": String(limit.retryAfter) } });
  }

  let body: unknown;
  try {
    body = await readJsonBody(req, 8 * 1024);
  } catch (error) {
    if (error instanceof RequestBodyTooLargeError) return NextResponse.json({ error: error.message }, { status: 413 });
    body = null;
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  await prisma.newsletter.upsert({
    where: { email: parsed.data.email },
    update: { confirmed: true },
    create: { email: parsed.data.email, confirmed: true }
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
