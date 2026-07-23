import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import {
  parseLimitedJsonBody,
  prismaErrorResponse,
  tooManyRequestsResponse,
} from "@/lib/api-errors";

const MAX_BODY_BYTES = 4096;

const propertyValue = z.union([
  z.string().max(500),
  z.number(),
  z.boolean(),
  z.null(),
]);

const schema = z.object({
  event: z.string().min(1).max(120),
  properties: z
    .record(z.string().max(60), propertyValue)
    .refine((o) => Object.keys(o).length <= 30, "Too many properties")
    .optional(),
  sessionId: z.string().max(120).optional(),
});

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const limited = checkRateLimit({
    key: `analytics:${ip}`,
    limit: 60,
    windowMs: 60 * 1000,
  });
  if (!limited.allowed) return tooManyRequestsResponse();

  const parsed = await parseLimitedJsonBody(req, schema, MAX_BODY_BYTES);
  if (!parsed.ok) return parsed.response;

  try {
    await prisma.analyticsEvent.create({
      data: {
        event: parsed.data.event,
        properties: parsed.data.properties ?? undefined,
        sessionId: parsed.data.sessionId,
      },
    });
  } catch (error) {
    return prismaErrorResponse(error);
  }

  return NextResponse.json({ ok: true });
}
