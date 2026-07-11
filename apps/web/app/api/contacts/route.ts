import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";
import { readJsonBody, RequestBodyTooLargeError } from "@/lib/request";

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254).transform((value) => value.toLowerCase()),
  company: z.string().trim().max(160).optional(),
  phone: z.string().trim().max(40).optional(),
  message: z.string().trim().min(10).max(5000),
  budget: z.string().trim().max(100).optional(),
  projectType: z.string().trim().max(160).optional()
});

export async function POST(req: Request) {
  const limit = checkRateLimit(`contact:${getClientIp(req)}`, 10, 60_000);
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

  await prisma.contact.create({
    data: {
      ...parsed.data,
      source: "website"
    }
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
