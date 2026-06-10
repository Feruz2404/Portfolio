import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  email: z.string().email()
});

export async function POST(req: Request) {
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
