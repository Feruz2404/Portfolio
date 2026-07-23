import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import {
  parseLimitedJsonBody,
  prismaErrorResponse,
  tooManyRequestsResponse,
} from "@/lib/api-errors";

const MAX_BODY_BYTES = 2048;

const schema = z.object({
  path: z.string().min(1).max(512),
  referrer: z.string().max(512).optional(),
  country: z.string().max(80).optional(),
  device: z.string().max(80).optional(),
  browser: z.string().max(120).optional(),
});

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const limited = checkRateLimit({
    key: `pageview:${ip}`,
    limit: 120,
    windowMs: 60 * 1000,
  });
  if (!limited.allowed) return tooManyRequestsResponse();

  const parsed = await parseLimitedJsonBody(req, schema, MAX_BODY_BYTES);
  if (!parsed.ok) return parsed.response;

  try {
    await prisma.pageView.create({ data: parsed.data });
  } catch (error) {
    return prismaErrorResponse(error);
  }

  return NextResponse.json({ ok: true });
}
