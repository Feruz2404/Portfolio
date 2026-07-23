import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import {
  parseJsonBody,
  prismaErrorResponse,
  tooManyRequestsResponse,
} from "@/lib/api-errors";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
});

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const limited = checkRateLimit({
    key: `newsletter:${ip}`,
    limit: 10,
    windowMs: 60 * 60 * 1000,
  });
  if (!limited.allowed) return tooManyRequestsResponse();

  const parsed = await parseJsonBody(req, schema);
  if (!parsed.ok) return parsed.response;

  try {
    const sub = await prisma.newsletter.upsert({
      where: { email: parsed.data.email },
      update: { confirmed: true },
      create: { email: parsed.data.email, confirmed: true },
    });

    return NextResponse.json({ subscription: sub }, { status: 201 });
  } catch (error) {
    return prismaErrorResponse(error);
  }
}
