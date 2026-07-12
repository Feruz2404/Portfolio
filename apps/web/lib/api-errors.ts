import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

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
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      case "P2003":
        return NextResponse.json({ error: "Invalid reference." }, { status: 400 });
      default:
        break;
    }
  }
  if (
    error instanceof Prisma.PrismaClientInitializationError ||
    (error instanceof Prisma.PrismaClientKnownRequestError && error.code.startsWith("P1"))
  ) {
    return NextResponse.json({ error: "Service temporarily unavailable" }, { status: 503 });
  }
  console.error("[api] unexpected error:", error);
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}

/** Coerce a value for a nullable Json column: null → Prisma.JsonNull, undefined → skip. */
export function toJsonInput(value: unknown): Prisma.InputJsonValue | typeof Prisma.JsonNull | undefined {
  if (value === undefined) return undefined;
  if (value === null) return Prisma.JsonNull;
  return value as Prisma.InputJsonValue;
}
