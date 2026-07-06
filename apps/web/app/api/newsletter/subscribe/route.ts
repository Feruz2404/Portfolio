import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { z } from "zod";

const schema = z.object({
  email: z.string().email()
});

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const limited = checkRateLimit({ key: `newsletter:${ip}`, limit: 10, windowMs: 60 * 60 * 1000 });
  if (!limited.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 });

  const sub = await prisma.newsletter.upsert({
    where: { email: parsed.data.email },
    update: { confirmed: true },
    create: { email: parsed.data.email, confirmed: true }
  });

  return NextResponse.json({ subscription: sub }, { status: 201 });
}
