import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import type { z } from "zod";

export function errorResponse(message: string, status: number): NextResponse {
  return NextResponse.json({ error: message }, { status });
}

export function invalidPayloadResponse(): NextResponse {
  return errorResponse("Invalid payload", 400);
}

export function notFoundResponse(): NextResponse {
  return errorResponse("Not found", 404);
}

export function tooManyRequestsResponse(): NextResponse {
  return errorResponse("Too many requests", 429);
}

export function payloadTooLargeResponse(): NextResponse {
  return errorResponse("Payload too large", 413);
}

export function serviceUnavailableResponse(
  message = "Service temporarily unavailable",
): NextResponse {
  return errorResponse(message, 503);
}

type ParsedBody<TSchema extends z.ZodTypeAny> =
  | { ok: true; data: z.infer<TSchema> }
  | { ok: false; response: NextResponse };

export async function parseJsonBody<TSchema extends z.ZodTypeAny>(
  req: Request,
  schema: TSchema,
  normalize?: (body: unknown) => unknown,
): Promise<ParsedBody<TSchema>> {
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(normalize ? normalize(body) : body);
  if (!parsed.success) return { ok: false, response: invalidPayloadResponse() };

  return { ok: true, data: parsed.data };
}

export async function parseLimitedJsonBody<TSchema extends z.ZodTypeAny>(
  req: Request,
  schema: TSchema,
  maxBytes: number,
): Promise<ParsedBody<TSchema>> {
  const raw = await req.text().catch(() => "");
  if (raw.length > maxBytes)
    return { ok: false, response: payloadTooLargeResponse() };

  let body: unknown = null;
  try {
    body = raw ? JSON.parse(raw) : null;
  } catch {
    body = null;
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) return { ok: false, response: invalidPayloadResponse() };

  return { ok: true, data: parsed.data };
}

/**
 * Map a thrown error to an honest HTTP response.
 *  - P2002 (unique constraint) → 409 Conflict
 *  - P2025 (record not found)  → 404 Not Found
 *  - P2003 (FK constraint)     → 400 Bad Request
 *  - connection/init failures   → 503 Service Unavailable
 *  - anything else              → 500 Internal Server Error
 */
export function prismaErrorResponse(error: unknown): NextResponse {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        return NextResponse.json(
          { error: "A record with these values already exists." },
          { status: 409 },
        );
      case "P2025":
        return notFoundResponse();
      case "P2003":
        return errorResponse("Invalid reference.", 400);
      default:
        break;
    }
  }
  if (
    error instanceof Prisma.PrismaClientInitializationError ||
    (error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code.startsWith("P1"))
  ) {
    return serviceUnavailableResponse();
  }
  console.error("[api] unexpected error:", error);
  return errorResponse("Internal server error", 500);
}

/** Coerce a value for a nullable Json column: null → Prisma.JsonNull, undefined → skip. */
export function toJsonInput(
  value: unknown,
): Prisma.InputJsonValue | typeof Prisma.JsonNull | undefined {
  if (value === undefined) return undefined;
  if (value === null) return Prisma.JsonNull;
  return value as Prisma.InputJsonValue;
}
